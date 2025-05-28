"use client";

import { useEffect, useRef } from 'react';
import { Canvas } from 'fabric';

interface FabricCanvasProps {
  width: number;
  height: number;
  onReady?: (canvas: Canvas) => void;
}

export default function FabricCanvas({ width, height, onReady }: FabricCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create canvas instance
    const canvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true,
      renderOnAddRemove: true
    });

    // Store reference
    fabricCanvasRef.current = canvas;

    // Notify parent component that canvas is ready
    if (onReady) {
      onReady(canvas);
    }

    // Clean up
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [width, height, onReady]);

  // Update canvas size when dimensions change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.setWidth(width);
    canvas.setHeight(height);
    canvas.renderAll();
  }, [width, height]);

  return <canvas ref={canvasRef} />;
} 