'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';
import HeroMediaCard from './hero-media-card';
import HeroMediaFormCard from './hero-media-form-card';
import HeroMediaAddCard from './hero-media-add-card';
import {
  HeroMediaFormData,
  HeroMediaItem,
  HeroMediaType,
} from '@/types/hero-media.types';
import {
  subscribeHeroMedia,
  sortHeroMediaItems,
  createHeroMedia,
  updateHeroMedia,
  deleteHeroMedia,
  reorderHeroMedia,
  moveHeroMediaItem,
  resolveMediaUrl,
  getUploadErrorMessage,
} from '@/lib/hero-media.service';
import { HERO_MEDIA_ERRORS, HERO_MEDIA_MIN_ITEMS } from '@/constants';

type FormMode = null | 'add' | string;

const defaultFormData = (): HeroMediaFormData => ({
  type: 'image',
  url: '',
  thumbnail: '',
});

const mergeWithOptimistic = (
  firestoreItems: HeroMediaItem[],
  prevItems: HeroMediaItem[]
): HeroMediaItem[] => {
  const temps = prevItems.filter((i) => i.id.startsWith('temp-'));
  const combined = [...firestoreItems];
  for (const t of temps) {
    const exists = firestoreItems.some(
      (d) => d.url === t.url && d.type === t.type
    );
    if (!exists) combined.push(t);
  }
  return sortHeroMediaItems(combined);
};

const HeroMediaAdmin: React.FC = () => {
  const [items, setItems] = useState<HeroMediaItem[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [formData, setFormData] =
    useState<HeroMediaFormData>(defaultFormData());
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [newCardIds, setNewCardIds] = useState<Set<string>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ isOpen: false, id: null });

  const lastAddedRef = useRef<string | null>(null);

  const canDelete = items.length > HERO_MEDIA_MIN_ITEMS;

  useEffect(() => {
    const unsubscribe = subscribeHeroMedia(
      (data) => {
        setItems((prev) => mergeWithOptimistic(data, prev));
        setListLoading(false);

        if (lastAddedRef.current) {
          const el = document.getElementById(
            `hero-media-${lastAddedRef.current}`
          );
          el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          lastAddedRef.current = null;
        }
      },
      () => setListLoading(false)
    );
    return unsubscribe;
  }, []);

  const closeForm = useCallback(() => {
    setFormMode(null);
    setFormData(defaultFormData());
    setUploadError(null);
  }, []);

  const openAddForm = useCallback(() => {
    setFormData(defaultFormData());
    setUploadError(null);
    setFormMode('add');
  }, []);

  const handleEdit = useCallback((item: HeroMediaItem) => {
    setFormData({
      id: item.id,
      type: item.type,
      url: item.url,
      thumbnail: item.thumbnail ?? '',
    });
    setUploadError(null);
    setFormMode(item.id);
  }, []);

  const handleMediaUpload = async (fileOrUrl: File | string | null) => {
    if (!fileOrUrl) {
      setFormData((prev) => ({ ...prev, url: '' }));
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await resolveMediaUrl(fileOrUrl, formData.type);
      setFormData((prev) => ({ ...prev, url }));
    } catch (err) {
      setUploadError(getUploadErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleThumbnailUpload = async (fileOrUrl: File | string | null) => {
    if (!fileOrUrl) {
      setFormData((prev) => ({ ...prev, thumbnail: '' }));
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await resolveMediaUrl(fileOrUrl, 'thumbnail');
      setFormData((prev) => ({ ...prev, thumbnail: url }));
    } catch (err) {
      setUploadError(getUploadErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleTypeChange = (type: HeroMediaType) => {
    setFormData((prev) => ({
      ...prev,
      type,
      url: prev.type === type ? prev.url : '',
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url) {
      setUploadError(HERO_MEDIA_ERRORS.mediaRequired);
      return;
    }

    const isAdd = formMode === 'add';
    const tempId = isAdd ? `temp-${Date.now()}` : null;

    if (isAdd && tempId) {
      const optimistic: HeroMediaItem = {
        id: tempId,
        type: formData.type,
        url: formData.url,
        thumbnail: formData.thumbnail,
        order: items.length,
      };
      setItems((prev) => sortHeroMediaItems([...prev, optimistic]));
      setNewCardIds((prev) => new Set(prev).add(tempId));
      closeForm();
    }

    setIsSaving(true);
    try {
      if (isAdd && tempId) {
        const realId = await createHeroMedia(formData, items.length);
        lastAddedRef.current = realId;
        setNewCardIds((prev) => {
          const next = new Set(prev);
          next.delete(tempId);
          next.add(realId);
          return next;
        });
      } else if (formData.id) {
        await updateHeroMedia(formData.id, {
          type: formData.type,
          url: formData.url,
          thumbnail: formData.thumbnail,
        });
        closeForm();
      }
      setUploadError(null);
    } catch (err) {
      if (isAdd && tempId) {
        setItems((prev) => prev.filter((i) => i.id !== tempId));
        setNewCardIds((prev) => {
          const next = new Set(prev);
          next.delete(tempId);
          return next;
        });
        setFormMode('add');
        setFormData({ ...formData });
      }
      alert(
        `Error saving hero media: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!canDelete) return;
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsSaving(true);
    try {
      await deleteHeroMedia(deleteModal.id, items.length);
      setDeleteModal({ isOpen: false, id: null });
      if (formMode === deleteModal.id) closeForm();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : 'Failed to delete hero media.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = items.findIndex((item) => item.id === id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (index === -1 || targetIndex < 0 || targetIndex >= items.length) return;

    const previous = items;
    const reordered = moveHeroMediaItem(items, id, direction);
    setItems(reordered);
    setIsReordering(true);
    try {
      await reorderHeroMedia(reordered);
    } catch {
      setItems(previous);
      alert('Failed to reorder hero media.');
    } finally {
      setIsReordering(false);
    }
  };

  const gridClass =
    'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif">Hero Banner</h2>
        <p className="text-text-muted text-sm mt-1">
          Manage images and videos shown randomly on the home page hero.
        </p>
        {items.length === HERO_MEDIA_MIN_ITEMS && !listLoading && (
          <p className="text-amber-700 text-xs mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-block">
            At least one hero media item is required. Delete is disabled while
            only one item exists.
          </p>
        )}
      </div>

      {listLoading ? (
        <div className={gridClass}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-h-[280px] rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
          <div className="min-h-[280px] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 animate-pulse" />
        </div>
      ) : (
        <div className={gridClass}>
          {items.map((item, index) => {
            const isEditingThis = formMode === item.id;

            if (isEditingThis) {
              return (
                <div key={item.id} id={`hero-media-${item.id}`}>
                  <HeroMediaFormCard
                    formData={formData}
                    uploadError={uploadError}
                    isSaving={isSaving}
                    isUploading={isUploading}
                    isEdit
                    onSubmit={handleSave}
                    onCancel={closeForm}
                    onTypeChange={handleTypeChange}
                    onMediaUpload={handleMediaUpload}
                    onThumbnailUpload={handleThumbnailUpload}
                  />
                </div>
              );
            }

            return (
              <div key={item.id} id={`hero-media-${item.id}`}>
                <HeroMediaCard
                  item={item}
                  index={index}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                  canDelete={canDelete}
                  isReordering={isReordering}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onReorder={handleReorder}
                  isNew={newCardIds.has(item.id)}
                />
              </div>
            );
          })}

          {formMode === 'add' ? (
            <HeroMediaFormCard
              formData={formData}
              uploadError={uploadError}
              isSaving={isSaving}
              isUploading={isUploading}
              isEdit={false}
              onSubmit={handleSave}
              onCancel={closeForm}
              onTypeChange={handleTypeChange}
              onMediaUpload={handleMediaUpload}
              onThumbnailUpload={handleThumbnailUpload}
            />
          ) : (
            <HeroMediaAddCard
              onClick={openAddForm}
              isEmpty={items.length === 0}
            />
          )}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Hero Media"
        loading={isSaving}
      />
    </div>
  );
};

export default HeroMediaAdmin;
