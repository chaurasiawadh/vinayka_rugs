'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VisualizerContextType {
  roomImage: string | null;
  setRoomImage: (image: string | null) => void;
  selectedRug: any | null;
  setSelectedRug: (rug: any | null) => void;
}

const VisualizerContext = createContext<VisualizerContextType | undefined>(
  undefined
);

export const VisualizerProvider = ({ children }: { children: ReactNode }) => {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [selectedRug, setSelectedRug] = useState<any | null>(null);

  return (
    <VisualizerContext.Provider
      value={{
        roomImage,
        setRoomImage,
        selectedRug,
        setSelectedRug,
      }}
    >
      {children}
    </VisualizerContext.Provider>
  );
};

export const useVisualizer = () => {
  const context = useContext(VisualizerContext);
  if (context === undefined) {
    throw new Error('useVisualizer must be used within a VisualizerProvider');
  }
  return context;
};
