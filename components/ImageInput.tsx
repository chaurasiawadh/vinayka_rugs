import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, X, AlertCircle } from 'lucide-react';

interface ImageInputProps {
  label?: string;
  initialValue?: string;
  onChange: (value: File | string | null) => void;
  className?: string;
  error?: string | null;
}

const ImageInput: React.FC<ImageInputProps> = ({
  label = 'Image URL',
  initialValue,
  onChange,
  className = '',
  error,
}) => {
  const [preview, setPreview] = useState<string | null>(initialValue || null);
  const [urlInput, setUrlInput] = useState<string>(initialValue || '');

  // Sync initial value if it changes
  useEffect(() => {
    if (initialValue) {
      setPreview(initialValue);
      setUrlInput(initialValue);
    } else {
      setPreview(null);
      setUrlInput('');
    }
  }, [initialValue]);

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
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* URL Input */}
      <div className="relative group w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-terracotta transition-colors">
          <LinkIcon size={18} />
        </div>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={urlInput}
          onChange={handleUrlChange}
          className={`w-full border rounded-lg py-3 pl-10 pr-4 text-sm outline-none transition-all shadow-sm ${
            error
              ? 'border-error focus:ring-1 focus:ring-error focus:border-error bg-error/5'
              : 'border-gray-300 focus:ring-1 focus:ring-terracotta focus:border-terracotta bg-white hover:border-gray-400'
          }`}
        />
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 group bg-gray-50 max-w-md">
          <div className="aspect-[4/3] w-full relative">
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
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-gray-500 hover:text-error hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100"
            title="Remove Image"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 mt-1.5 text-xs text-error animate-fade-in bg-error/5 p-2 rounded border border-error/10">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageInput;
