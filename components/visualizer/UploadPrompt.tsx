'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useVisualizer } from '@/context/VisualizerContext';
import { useRouter } from 'next/navigation';

export default function UploadPrompt() {
  const { setRoomImage } = useVisualizer();
  const router = useRouter();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setRoomImage(result);
          router.push('/visualizer');
        };
        reader.readAsDataURL(file);
      }
    },
    [setRoomImage, router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer text-center group
        ${isDragActive ? 'border-terracotta bg-terracotta/5' : 'border-gray-300 hover:border-terracotta hover:bg-gray-50'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-terracotta group-hover:scale-110 transition-transform">
          {isDragActive ? <UploadCloud size={32} /> : <ImageIcon size={32} />}
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-gray-800 mb-1">
            {isDragActive ? 'Drop it here!' : 'Upload Your Room Photo'}
          </h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Drag & drop an image, or click to select from your device.
          </p>
        </div>
        <button className="bg-terracotta text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-terracotta/90 transition-colors">
          Select Photo
        </button>
      </div>
    </div>
  );
}
