import React, { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, X, AlertCircle } from 'lucide-react';

interface ImageInputProps {
  label?: string;
  initialValue?: string;
  onChange: (value: File | string | null) => void;
  className?: string;
  error?: string | null;
}

const ImageInput: React.FC<ImageInputProps> = ({ 
  label = "Image", 
  initialValue, 
  onChange,
  className = "",
  error
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [preview, setPreview] = useState<string | null>(initialValue || null);
  const [urlInput, setUrlInput] = useState<string>('');

  // Sync initial value if it changes (e.g., when editing a different product)
  useEffect(() => {
    if (initialValue) {
      setPreview(initialValue);
      // If it looks like a URL, switch tab and set input
      if (typeof initialValue === 'string' && initialValue.startsWith('http')) {
        setUrlInput(initialValue);
        setActiveTab('url');
      }
    } else {
      setPreview(null);
      setUrlInput('');
      setActiveTab('upload');
    }
  }, [initialValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange(file);
    }
  };

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
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {!preview ? (
        <div className={`bg-gray-50 border rounded-lg p-3 ${error ? 'border-error/50 bg-error/5' : 'border-gray-200'}`}>
            <div className="flex gap-4 mb-4 border-b border-gray-200 px-1">
                <button 
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === 'upload' ? 'text-terracotta border-b-2 border-terracotta -mb-[1px]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Upload Image
                </button>
                <button 
                    type="button"
                    onClick={() => setActiveTab('url')}
                    className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === 'url' ? 'text-terracotta border-b-2 border-terracotta -mb-[1px]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Paste URL
                </button>
            </div>

            {activeTab === 'upload' ? (
                <div className={`relative group bg-white rounded-lg border-2 border-dashed transition-colors ${error ? 'border-error' : 'border-gray-300 hover:border-terracotta'}`}>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-8 text-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors ${error ? 'bg-error/10 text-error' : 'bg-gray-50 text-gray-400 group-hover:bg-terracotta/10 group-hover:text-terracotta'}`}>
                            <Upload size={18} />
                        </div>
                        <p className="text-sm font-medium text-gray-700">Click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF</p>
                    </div>
                </div>
            ) : (
                <div className="py-2">
                     <div className="relative">
                        <LinkIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                        <input 
                            type="url" 
                            placeholder="https://example.com/image.jpg" 
                            value={urlInput}
                            onChange={handleUrlChange}
                            className={`w-full border rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-1 outline-none bg-white ${error ? 'border-error focus:ring-error focus:border-error' : 'border-gray-300 focus:ring-terracotta focus:border-terracotta'}`}
                        />
                     </div>
                </div>
            )}
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 group bg-gray-100">
            <div className="aspect-video w-full relative">
                <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-full object-contain" 
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                    }}
                />
            </div>
            <button 
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-gray-500 hover:text-error hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
            >
                <X size={16} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white text-xs p-2 truncate">
                {activeTab === 'upload' ? 'Local File Selected' : urlInput || 'Image URL'}
            </div>
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