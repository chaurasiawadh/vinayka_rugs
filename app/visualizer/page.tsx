'use client';
import React, { useEffect } from 'react';
import { useVisualizer } from '@/context/VisualizerContext';
import { useRouter } from 'next/navigation';
import ProductSidebar from '@/components/visualizer/ProductSidebar';
import ActiveRug from '@/components/visualizer/ActiveRug';

export default function VisualizerPage() {
  const { roomImage, selectedRug, setSelectedRug } = useVisualizer();
  const router = useRouter();

  // Redirect if no image (Phase 1 safety)
  useEffect(() => {
    // Phase 2: Removed redirect to allow dev testing, or keep it?
    // Let's keep it but maybe we need a way to bypass if we just want to test?
    if (!roomImage) {
      // router.push('/'); // Uncomment later
    }
  }, [roomImage, router]);

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden bg-gray-900 text-white">
      {/* SIDEBAR: Product List */}
      <aside className="w-full md:w-80 bg-gray-800 border-r border-gray-700 flex flex-col z-20 shadow-xl relative">
        <ProductSidebar />
      </aside>

      {/* MAIN CANVAS: Room View */}
      <main className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {roomImage ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* The Room Image */}
            <div className="relative max-w-full max-h-full">
              <img
                src={roomImage}
                alt="My Room"
                className="max-w-full max-h-full object-contain pointer-events-none select-none"
                style={{ maxHeight: '85vh' }}
              />

              {/* The Rug Layer */}
              {selectedRug && (
                <div className="absolute inset-0">
                  <ActiveRug
                    image={selectedRug.images[0]}
                    onClose={() => setSelectedRug(null)}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <div className="bg-gray-800/50 p-8 rounded-xl border-2 border-dashed border-gray-600">
              <p className="text-gray-300 mb-4">No room photo uploaded.</p>
              <button
                onClick={() => router.push('/')}
                className="text-terracotta underline hover:text-white transition-colors"
              >
                Go back to Upload
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
