'use client';

import React, { useEffect, useRef, useState } from 'react';
import Moveable from 'react-moveable';

interface ActiveRugProps {
  image: string;
  onClose: () => void;
}

export default function ActiveRug({ image, onClose }: ActiveRugProps) {
  const targetRef = useRef<HTMLImageElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const [mode, setMode] = useState<'scale' | 'warp'>('warp');
  const [opacity, setOpacity] = useState(0.9);
  const [blendMode, setBlendMode] = useState<'multiply' | 'normal'>('multiply');

  useEffect(() => {
    setTarget(targetRef.current);
  }, []);

  return (
    <div className="absolute top-[20%] left-[20%] w-[300px] z-10 group">
      {/* Controls Toolbar */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur p-3 rounded-xl shadow-xl min-w-[200px]"
        onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking toolbar
      >
        {/* Mode Toggles */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('scale')}
            className={`flex-1 px-3 py-1 text-xs font-semibold rounded-md transition-all ${mode === 'scale' ? 'bg-white text-terracotta shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Scale
          </button>
          <button
            onClick={() => setMode('warp')}
            className={`flex-1 px-3 py-1 text-xs font-semibold rounded-md transition-all ${mode === 'warp' ? 'bg-white text-terracotta shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Distort
          </button>
        </div>

        {/* Opacity Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
            <span>Visibility</span>
            <span>{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-terracotta"
          />
        </div>

        {/* Blend Mode */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              setBlendMode(blendMode === 'multiply' ? 'normal' : 'multiply')
            }
            className="w-full text-xs border border-gray-200 rounded py-1 hover:bg-gray-50 text-gray-700"
          >
            Blend:{' '}
            <strong>{blendMode === 'multiply' ? 'Realistic' : 'Opaque'}</strong>
          </button>
        </div>
      </div>

      {/* The Rug Image */}
      <img
        ref={targetRef}
        src={image}
        alt="Rug"
        className="w-full h-full object-contain origin-top-left"
        style={{
          mixBlendMode: blendMode,
          opacity: opacity,
          filter:
            blendMode === 'multiply'
              ? 'brightness(0.95) contrast(1.1)'
              : 'none',
        }}
      />

      {/* Delete Button */}
      <button
        onClick={onClose}
        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-md"
      >
        ×
      </button>

      {/* The Moveable Control */}
      <Moveable
        target={target}
        // Toggle modes based on state
        draggable={true}
        rotatable={mode === 'scale'}
        resizable={mode === 'scale'}
        warpable={mode === 'warp'}
        // Handlers
        onDrag={({ target, transform }) => {
          target.style.transform = transform;
        }}
        onResize={({ target, width, height, delta }) => {
          delta[0] && (target.style.width = `${width}px`);
          delta[1] && (target.style.height = `${height}px`);
        }}
        onRotate={({ target, transform }) => {
          target.style.transform = transform;
        }}
        onWarp={({ target, transform }) => {
          target.style.transform = transform;
        }}
        // Visuals
        renderDirections={['nw', 'ne', 'sw', 'se']}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        // Styles for handles to make them visible against rugs
        rotationPosition="top"
        lineWidth={2}
        lineColor="#E07A5F" // Terracotta
        controlColor="#E07A5F"
      />
    </div>
  );
}
