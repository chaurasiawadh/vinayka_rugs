'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useCollection } from '@/hooks/useFirestore';
import Button from '@/components/Button';
import ImageInput from '@/components/ImageInput';
import { GalleryItem } from '@/types';
import DeleteConfirmModal from './DeleteConfirmModal';

const GalleryManager: React.FC = () => {
  const galleryItems = useCollection('gallery') as GalleryItem[];
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    title: '',
    image: '',
    link: '/shop',
    description: '',
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      setUploadError('Please upload or provide an image URL first.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        updatedAt: serverTimestamp(),
      };
      if (!formData.id) {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'gallery'), payload);
      } else {
        await updateDoc(doc(db, 'gallery', formData.id), payload);
      }
      setIsEditing(false);
      setFormData({ title: '', image: '', link: '/shop', description: '' });
      setUploadError(null);
    } catch (err: any) {
      alert(`Error saving gallery item: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (fileOrUrl: File | string | null) => {
    if (!fileOrUrl) {
      setFormData((prev) => ({ ...prev, image: '' }));
      return;
    }
    setLoading(true);
    setUploadError(null);
    try {
      let url = '';
      if (typeof fileOrUrl === 'string') {
        url = fileOrUrl;
      } else {
        const storageRef = ref(
          storage,
          `gallery/${Date.now()}_${fileOrUrl.name}`
        );
        await uploadBytes(storageRef, fileOrUrl);
        url = await getDownloadURL(storageRef);
      }
      setFormData((prev) => ({ ...prev, image: url }));
      setUploadError(null);
    } catch (err: any) {
      setUploadError(
        err.message?.includes('CORS') || err.message?.includes('preflight')
          ? "CORS Error: Please use 'Paste URL' or configure bucket CORS (see instructions provided)."
          : 'Upload Failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'gallery', deleteModal.id));
      setDeleteModal({ isOpen: false, id: null });
    } catch (err) {
      alert('Failed to delete collection item.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData(item);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="bg-gray-50 min-h-screen p-6 pb-20">
        <div className="sticky top-0 z-20 bg-white shadow-sm p-4 rounded-lg flex justify-between items-center mb-6 border border-gray-200">
          <h2 className="text-xl font-bold font-serif">
            {formData.id ? 'Edit Collection Item' : 'New Collection Item'}
          </h2>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6 max-w-3xl">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
              Collection Title
            </label>
            <input
              className="w-full border p-2 rounded"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="e.g. Modern, Viraasat, Silk Route"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
              Sort Order / Description (Optional)
            </label>
            <textarea
              className="w-full border p-2 rounded"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Optional description"
            />
          </div>

          <div>
            <ImageInput
              initialValue={formData.image}
              onChange={handleImageUpload}
              label="Cover Image"
              error={uploadError}
              showFileUpload={false}
            />
          </div>
        </div>
      </form>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif">Curated Collections</h2>
          <p className="text-text-muted text-sm">
            Manage the gallery items displayed on the home page.
          </p>
        </div>
        <Button
          onClick={() => {
            setFormData({
              title: '',
              image: '',
              link: '/shop',
              description: '',
            });
            setIsEditing(true);
          }}
        >
          <Plus size={18} className="mr-2" /> Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="group relative h-[300px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-serif mb-1">{item.title}</h3>
              <p className="text-xs opacity-70 truncate mb-4">
                {item.link || 'No link set'}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm text-red-200 hover:text-white transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {galleryItems.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">
              No collection items found. Add one to get started.
            </p>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Collection Item"
        loading={loading}
      />
    </div>
  );
};

export default GalleryManager;
