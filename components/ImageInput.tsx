import React, { useState, useEffect, useRef } from 'react';
import { Link as LinkIcon, X, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageInputProps {
  label?: string;
  initialValue?: string;
  onChange: (value: File | string | null) => void;
  className?: string;
  error?: string | null;
  showFileUpload?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({
  label = 'Upload Image',
  initialValue,
  onChange,
  className = '',
  error,
  showFileUpload = true,
}) => {
  const [preview, setPreview] = useState<string | null>(initialValue || null);
  const [urlInput, setUrlInput] = useState<string>(initialValue || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial value if it changes
  useEffect(() => {
    if (initialValue) {
      setPreview(initialValue);
      setUrlInput(initialValue);
    } else if (!preview?.startsWith('data:')) {
      // Only clear if we don't have a local preview currently
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onChange(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
        {label}
      </label>

      {/* Upload Methods Container */}
      <div className={showFileUpload ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "block"}>
        {/* File Upload Area */}
        {showFileUpload && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-3 bg-white hover:bg-gray-50 hover:border-terracotta/30 cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-terracotta/10 group-hover:text-terracotta transition-colors">
              <Upload size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Click to upload</p>
              <p className="text-xs text-gray-400">PNG, JPG or WebP</p>
            </div>
          </div>
        )}

        {/* URL Input Area */}
        <div className={`flex flex-col justify-center gap-3 ${!showFileUpload ? 'max-w-md' : ''}`}>
          <div className="relative group w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-terracotta transition-colors">
              <LinkIcon size={18} />
            </div>
            <input
              type="url"
              placeholder="Paste image URL..."
              value={urlInput}
              onChange={handleUrlChange}
              className={`w-full border rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all shadow-sm ${error
                ? 'border-error focus:ring-1 focus:ring-error focus:border-error bg-error/5'
                : 'border-gray-200 focus:ring-1 focus:ring-terracotta focus:border-terracotta bg-white hover:border-gray-300'
                }`}
            />
          </div>
          <p className="text-[10px] text-gray-400 px-1 italic">
            Tip: Use URL for images already hosted online.
          </p>
        </div>
      </div>

      {/* Image Preview */}
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
            Image Preview
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
