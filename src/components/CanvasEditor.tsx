"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Upload, Download, ZoomIn, ZoomOut, Move, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageElement {
  id: string;
  file: File;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number;
  selected: boolean;
}

export default function CanvasEditor() {
  const [images, setImages] = useState<ImageElement[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedImage, setDraggedImage] = useState<ImageElement | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    addImagesToCanvas(Array.from(files));
    
    // Clear the file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addImagesToCanvas(Array.from(e.dataTransfer.files));
    }
  };

  // Prevent default drag behavior
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Add images to canvas
  const addImagesToCanvas = (files: File[]) => {
    // Only accept image files
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/jpeg') || 
      file.type.startsWith('image/png') || 
      file.type.startsWith('image/gif')
    );

    if (imageFiles.length === 0) return;

    // Create URL for each file and add to state
    const newImages = imageFiles.map(file => {
      return new Promise<ImageElement>((resolve) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;
        
        img.onload = () => {
          // Calculate aspect ratio
          const aspectRatio = img.width / img.height;
          
          // Position image in the center of canvas
          const canvasWidth = canvasRef.current?.clientWidth || 800;
          const canvasHeight = canvasRef.current?.clientHeight || 600;
          
          // Set initial size, maintaining aspect ratio
          const width = Math.min(300, img.width);
          const height = width / aspectRatio;
          
          resolve({
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            file,
            url,
            x: (canvasWidth / 2) - (width / 2),
            y: (canvasHeight / 2) - (height / 2),
            width,
            height,
            aspectRatio,
            selected: false
          });
        };
      });
    });

    // Wait for all images to load then update state
    Promise.all(newImages).then((loadedImages) => {
      setImages(prev => [...prev, ...loadedImages]);
    });
  };

  // Select an image
  const selectImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setImages(prev => prev.map(img => ({
      ...img,
      selected: img.id === id
    })));
  };

  // Start dragging an image
  const startDragging = (image: ImageElement, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Ensure the image is selected
    if (!image.selected) {
      selectImage(image.id, e);
    }
    
    setIsDragging(true);
    setDraggedImage(image);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Drag to move image
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && draggedImage) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      setImages(prev => prev.map(img => {
        if (img.id === draggedImage.id) {
          return {
            ...img,
            x: img.x + dx,
            y: img.y + dy
          };
        }
        return img;
      }));

      setDragStart({ x: e.clientX, y: e.clientY });
    }

    if (isResizing && draggedImage) {
      const dx = e.clientX - dragStart.x;
      const newWidth = resizeStart.width + dx;
      
      // Maintain aspect ratio
      const newHeight = newWidth / draggedImage.aspectRatio;

      setImages(prev => prev.map(img => {
        if (img.id === draggedImage.id) {
          return {
            ...img,
            width: Math.max(50, newWidth), // Set minimum width
            height: Math.max(50, newHeight) // Set minimum height
          };
        }
        return img;
      }));
    }
  };

  // Stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setDraggedImage(null);
  };

  // Clear selection on canvas
  const handleCanvasClick = () => {
    setImages(prev => prev.map(img => ({
      ...img,
      selected: false
    })));
  };

  // Start resizing an image
  const startResizing = (image: ImageElement, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Ensure the image is selected
    if (!image.selected) {
      selectImage(image.id, e);
    }
    
    setIsResizing(true);
    setDraggedImage(image);
    setDragStart({ x: e.clientX, y: e.clientY });
    setResizeStart({ width: image.width, height: image.height });
  };

  // Delete selected image
  const deleteSelectedImage = () => {
    const selectedImage = images.find(img => img.selected);
    if (selectedImage) {
      // Release created object URLs to prevent memory leaks
      URL.revokeObjectURL(selectedImage.url);
      
      setImages(prev => prev.filter(img => !img.selected));
    }
  };

  // Export composite image
  const exportImage = () => {
    if (images.length === 0 || !canvasRef.current) return;
    
    // Create an off-screen canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to edit area size
    canvas.width = canvasRef.current.clientWidth;
    canvas.height = canvasRef.current.clientHeight;
    
    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw images in sequence (later added on top)
    const drawImages = images.map(img => {
      return new Promise<void>((resolve) => {
        const imgElement = new Image();
        imgElement.src = img.url;
        imgElement.onload = () => {
          ctx.drawImage(
            imgElement,
            img.x,
            img.y,
            img.width,
            img.height
          );
          resolve();
        };
      });
    });
    
    // Wait for all images to be drawn then export
    Promise.all(drawImages).then(() => {
      // Create download link
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `merged-image-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    });
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(img => {
        URL.revokeObjectURL(img.url);
      });
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-8">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex space-x-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#bdf60b] hover:bg-[#bdf60b]/90 text-black"
          >
            <Upload className="mr-2 h-4 w-4" /> Add Images
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/jpeg,image/png,image/gif"
            multiple
            className="hidden"
          />
          <Button
            onClick={deleteSelectedImage}
            variant="outline"
            disabled={!images.some(img => img.selected)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
            variant="outline"
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="flex items-center px-3">{Math.round(scale * 100)}%</span>
          <Button
            onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
            variant="outline"
            disabled={scale >= 2}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            onClick={exportImage}
            disabled={images.length === 0}
            className="bg-black hover:bg-gray-800 text-white ml-4"
          >
            <Download className="mr-2 h-4 w-4" /> Export Image
          </Button>
        </div>
      </div>

      {/* Canvas Edit Area */}
      <div 
        ref={canvasRef}
        className={cn(
          "relative w-full h-[500px] bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden",
          "transition-all duration-200",
          (isDragging || images.some(img => img.selected)) && "border-[#bdf60b]"
        )}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ transform: `scale(${scale})` }}
      >
        {images.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="h-12 w-12 mb-4" />
            <p className="text-lg">Drag images here or click "Add Images" button</p>
          </div>
        ) : (
          images.map(img => (
            <div
              key={img.id}
              className={cn(
                "absolute cursor-move",
                img.selected && "outline outline-2 outline-[#bdf60b]"
              )}
              style={{
                left: `${img.x}px`,
                top: `${img.y}px`,
                width: `${img.width}px`,
                height: `${img.height}px`,
              }}
              onClick={(e) => selectImage(img.id, e)}
              onMouseDown={(e) => startDragging(img, e)}
            >
              <img
                src={img.url}
                alt="Uploaded"
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
              {/* Resize handle */}
              {img.selected && (
                <div 
                  className="absolute right-0 bottom-0 w-4 h-4 bg-[#bdf60b] rounded-full cursor-se-resize"
                  onMouseDown={(e) => startResizing(img, e)}
                />
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Usage instructions */}
      <div className="mt-6 text-center text-gray-600 text-sm">
        <p>Tip: Click to select an image, drag to move, use corner handle to resize, then click "Export Image"</p>
      </div>
    </div>
  );
} 