import React, { useState, useEffect } from 'react';
import {
  Link as LinkIcon,
  X,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

interface ImageInputProps {
  label?: string;
  initialValue?: string;
  onChange: (value: File | string | null) => void;
  className?: string;
  error?: string | null;
  urlPlaceholder?: string;
}

const ImageInput: React.FC<ImageInputProps> = ({
  label = 'Upload Image',
  initialValue,
  onChange,
  className = '',
  error,
  urlPlaceholder = 'Paste image URL...',
}) => {
  const [preview, setPreview] = useState<string | null>(initialValue || null);
  const [urlInput, setUrlInput] = useState<string>(initialValue || '');

  useEffect(() => {
    if (initialValue) {
      setPreview(initialValue);
      setUrlInput(initialValue);
    } else if (!preview?.startsWith('data:')) {
      setPreview(null);
      setUrlInput('');
    }
  }, [initialValue, preview]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrlInput(url);
    if (url) {
      setPreview(url);
      onChange(url);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setUrlInput('');
    onChange(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
        {label}
      </label>

      <div className="flex flex-col justify-center gap-3 max-w-md">
        <div className="relative group w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-terracotta transition-colors">
            <LinkIcon size={18} />
          </div>
          <input
            type="url"
            placeholder={urlPlaceholder}
            value={urlInput}
            onChange={handleUrlChange}
            className={`w-full border rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all shadow-sm ${
              error
                ? 'border-error focus:ring-1 focus:ring-error focus:border-error bg-error/5'
                : 'border-gray-200 focus:ring-1 focus:ring-terracotta focus:border-terracotta bg-white hover:border-gray-300'
            }`}
          />
        </div>
        <p className="text-[10px] text-gray-400 px-1 italic">
          Tip: Use URL for media already hosted online.
        </p>
      </div>

      {preview && (
        <div className="relative rounded-xl overflow-hidden border border-gray-100 group bg-gray-50 max-w-sm mt-4 shadow-sm">
          <div className="aspect-[3/2] w-full relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://via.placeholder.com/400x300?text=Invalid+Image';
              }}
            />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleClear}
              className="bg-white text-error p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
              title="Remove Image"
            >
              <X size={20} />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] text-white font-medium flex items-center gap-1.5">
            <ImageIcon size={12} />
            Preview
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 mt-1.5 text-xs text-error bg-error/5 p-3 rounded-lg border border-error/10">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageInput;
