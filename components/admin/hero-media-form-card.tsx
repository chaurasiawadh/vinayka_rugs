'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Film, Image as ImageIcon } from 'lucide-react';
import Button from '@/components/Button';
import ImageInput from '@/components/ImageInput';
import { HeroMediaFormData, HeroMediaType } from '@/types/hero-media.types';

interface HeroMediaFormCardProps {
  formData: HeroMediaFormData;
  uploadError: string | null;
  isSaving: boolean;
  isUploading: boolean;
  isEdit: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onTypeChange: (type: HeroMediaType) => void;
  onMediaUpload: (value: File | string | null) => void;
  onThumbnailUpload: (value: File | string | null) => void;
}

const HeroMediaFormCard: React.FC<HeroMediaFormCardProps> = ({
  formData,
  uploadError,
  isSaving,
  isUploading,
  isEdit,
  onSubmit,
  onCancel,
  onTypeChange,
  onMediaUpload,
  onThumbnailUpload,
}) => {
  return (
    <motion.form
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onSubmit={onSubmit}
      className="relative rounded-2xl border-2 border-terracotta/40 bg-white shadow-md overflow-hidden min-h-[280px] flex flex-col"
    >
      <div className="px-4 py-3 border-b border-gray-100 bg-cream/40 flex justify-between items-center gap-2">
        <h3 className="text-sm font-serif font-bold text-gray-800">
          {isEdit ? 'Edit Media' : 'New Media'}
        </h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isSaving || isUploading}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[520px]">
        <div>
          <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block tracking-wider">
            Media Type
          </label>
          <div className="flex gap-2">
            {(['image', 'video'] as HeroMediaType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onTypeChange(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  formData.type === type
                    ? 'bg-terracotta text-white border-terracotta'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-terracotta'
                }`}
              >
                {type === 'video' ? (
                  <Film size={14} />
                ) : (
                  <ImageIcon size={14} />
                )}
                {type === 'video' ? 'Video' : 'Image'}
              </button>
            ))}
          </div>
        </div>

        <ImageInput
          initialValue={formData.url}
          onChange={onMediaUpload}
          label={
            formData.type === 'video' ? 'Hero Video URL' : 'Hero Image URL'
          }
          error={uploadError}
          urlPlaceholder={
            formData.type === 'video'
              ? 'Paste video URL...'
              : 'Paste image URL...'
          }
        />

        {formData.type === 'video' && (
          <ImageInput
            initialValue={formData.thumbnail}
            onChange={onThumbnailUpload}
            label="Thumbnail (Optional)"
            error={null}
            urlPlaceholder="Paste thumbnail URL..."
          />
        )}

        <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-video bg-black">
          {isUploading && (
            <div className="absolute inset-0 z-10 bg-gray-900/60 flex items-center justify-center">
              <div className="w-full h-full animate-pulse bg-gray-700/50" />
              <span className="absolute text-white/80 text-xs">
                Loading preview...
              </span>
            </div>
          )}
          {formData.url ? (
            formData.type === 'video' ? (
              <video
                src={formData.url}
                className="w-full h-full object-cover"
                controls
                muted
                poster={formData.thumbnail}
              />
            ) : (
              <img
                src={formData.url}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
              Preview appears here
            </div>
          )}
        </div>
      </div>
    </motion.form>
  );
};

export default HeroMediaFormCard;
