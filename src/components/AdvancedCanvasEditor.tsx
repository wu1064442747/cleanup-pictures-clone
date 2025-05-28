"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  Upload, 
  Download, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Undo2, 
  Redo2,
  ImageIcon,
  LayoutTemplate,
  Type,
  Smile,
  Sliders,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Import our custom components
import TemplateSelector, { TemplateOption } from './TemplateSelector';
import TextStickerControls, { TextStickerElement as ImportedTextStickerElement } from './TextStickerControls';
import ImageFilters, { FilterSettings } from './ImageFilters';
import LayerManager, { Layer } from './LayerManager';

// Dynamic import for Fabric.js to avoid SSR issues
const FabricCanvas = dynamic(() => import('./FabricCanvas'), { ssr: false });

// Types
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
  visible: boolean;
  filters?: FilterSettings;
  thumbnailUrl?: string;
}

interface TextStickerElement extends ImportedTextStickerElement {
  visible: boolean;
}

interface HistoryState {
  images: ImageElement[];
  textElements: TextStickerElement[];
  stickerElements: TextStickerElement[];
  canvasWidth: number;
  canvasHeight: number;
}

export default function AdvancedCanvasEditor() {
  // State for canvas settings
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [scale, setScale] = useState(1);
  
  // State for elements
  const [images, setImages] = useState<ImageElement[]>([]);
  const [textElements, setTextElements] = useState<TextStickerElement[]>([]);
  const [stickerElements, setStickerElements] = useState<TextStickerElement[]>([]);
  
  // Selected element tracking
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // Filter settings
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
    blur: 0
  });
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Compute all layers for the layer manager
  const allLayers = [
    ...images.map(img => ({
      id: img.id,
      name: `Image ${img.id.substring(0, 4)}`,
      type: 'image' as const,
      visible: true,
      thumbnailUrl: img.thumbnailUrl || img.url
    })),
    ...textElements.map(text => ({
      id: text.id,
      name: text.content.substring(0, 10) + (text.content.length > 10 ? '...' : ''),
      type: 'text' as const,
      visible: true
    })),
    ...stickerElements.map(sticker => ({
      id: sticker.id,
      name: `Sticker ${sticker.id.substring(0, 4)}`,
      type: 'sticker' as const,
      visible: true
    }))
  ].reverse(); // Reverse to match visual stacking order (last is top)
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    addImagesToCanvas(Array.from(files));
    
    // Clear file input to allow selecting the same file again
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
    // Filter to only accept image files
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
          const width = Math.min(300, img.width);
          const height = width / aspectRatio;
          
          const newImage: ImageElement = {
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            file,
            url,
            x: (canvasWidth / 2) - (width / 2),
            y: (canvasHeight / 2) - (height / 2),
            width,
            height,
            aspectRatio,
            selected: false,
            visible: true,
            filters: { ...filterSettings },
            thumbnailUrl: url
          };
          
          resolve(newImage);
        };
      });
    });

    // Wait for all images to load then update state
    Promise.all(newImages).then((loadedImages) => {
      setImages(prev => [...prev, ...loadedImages]);
      
      // Add to history
      addToHistory();
    });
  };
  
  // Add text element
  const handleAddText = (text: Omit<ImportedTextStickerElement, 'id'>) => {
    const newText: TextStickerElement = {
      ...text,
      id: `text-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      visible: true
    };
    
    setTextElements(prev => [...prev, newText]);
    setSelectedElementId(newText.id);
    
    // Add to history
    addToHistory();
  };
  
  // Add sticker element
  const handleAddSticker = (sticker: Omit<ImportedTextStickerElement, 'id'>) => {
    const newSticker: TextStickerElement = {
      ...sticker,
      id: `sticker-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      visible: true
    };
    
    setStickerElements(prev => [...prev, newSticker]);
    setSelectedElementId(newSticker.id);
    
    // Add to history
    addToHistory();
  };
  
  // Apply filter to selected image
  const handleApplyFilter = (filter: FilterSettings) => {
    setFilterSettings(filter);
    
    if (selectedElementId) {
      const selectedImage = images.find(img => img.id === selectedElementId);
      
      if (selectedImage) {
        setImages(prev => prev.map(img => 
          img.id === selectedElementId 
            ? { ...img, filters: filter }
            : img
        ));
        
        // Add to history
        addToHistory();
      }
    }
  };
  
  // Handle template selection
  const handleSelectTemplate = (template: TemplateOption) => {
    setCanvasWidth(template.layout.width);
    setCanvasHeight(template.layout.height);
    
    // Add to history
    addToHistory();
  };
  
  // Layer visibility change
  const handleLayerVisibilityChange = (id: string, visible: boolean) => {
    // Check if it's an image
    const imageIndex = images.findIndex(img => img.id === id);
    if (imageIndex !== -1) {
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, visible } : img
      ));
      return;
    }
    
    // Check if it's a text element
    const textIndex = textElements.findIndex(text => text.id === id);
    if (textIndex !== -1) {
      setTextElements(prev => prev.map(text => 
        text.id === id ? { ...text, visible } : text
      ));
      return;
    }
    
    // Check if it's a sticker
    const stickerIndex = stickerElements.findIndex(sticker => sticker.id === id);
    if (stickerIndex !== -1) {
      setStickerElements(prev => prev.map(sticker => 
        sticker.id === id ? { ...sticker, visible } : sticker
      ));
      return;
    }
    
    // Add to history
    addToHistory();
  };
  
  // Layer order change
  const handleLayerOrderChange = (id: string, direction: 'up' | 'down') => {
    // Since we're showing layers in reverse order in the UI,
    // "up" means moving the element down in the arrays
    const moveUp = direction === 'down';
    const moveDown = direction === 'up';
    
    // Find layer in all layers
    const layerIndex = allLayers.findIndex(layer => layer.id === id);
    if (layerIndex === -1) return;
    
    const layer = allLayers[layerIndex];
    
    // Add to history
    addToHistory();
  };
  
  // Layer selection
  const handleLayerSelect = (id: string) => {
    setSelectedElementId(id);
  };
  
  // Delete selected element
  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    
    // Check if it's an image
    const imageIndex = images.findIndex(img => img.id === selectedElementId);
    if (imageIndex !== -1) {
      // Release object URL
      URL.revokeObjectURL(images[imageIndex].url);
      
      setImages(prev => prev.filter(img => img.id !== selectedElementId));
      setSelectedElementId(null);
      return;
    }
    
    // Check if it's a text element
    const textIndex = textElements.findIndex(text => text.id === selectedElementId);
    if (textIndex !== -1) {
      setTextElements(prev => prev.filter(text => text.id !== selectedElementId));
      setSelectedElementId(null);
      return;
    }
    
    // Check if it's a sticker
    const stickerIndex = stickerElements.findIndex(sticker => sticker.id === selectedElementId);
    if (stickerIndex !== -1) {
      setStickerElements(prev => prev.filter(sticker => sticker.id !== selectedElementId));
      setSelectedElementId(null);
      return;
    }
    
    // Add to history
    addToHistory();
  };
  
  // Export composite image
  const exportImage = () => {
    if ((images.length === 0 && textElements.length === 0 && stickerElements.length === 0) || !canvasRef.current) return;
    
    // Create off-screen canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw all elements in order (bottom to top)
    const drawElements = async () => {
      // Draw images first
      for (const img of images) {
        if (!img.visible) continue;
        
        const imgElement = new Image();
        imgElement.src = img.url;
        
        await new Promise<void>((resolve) => {
          imgElement.onload = () => {
            // Apply filters if needed
            if (img.filters) {
              ctx.filter = `
                brightness(${img.filters.brightness}%)
                contrast(${img.filters.contrast}%)
                saturate(${img.filters.saturate}%)
                grayscale(${img.filters.grayscale}%)
                sepia(${img.filters.sepia}%)
                hue-rotate(${img.filters.hueRotate}deg)
                blur(${img.filters.blur}px)
              `;
            }
            
            ctx.drawImage(
              imgElement,
              img.x,
              img.y,
              img.width,
              img.height
            );
            
            // Reset filters
            ctx.filter = 'none';
            
            resolve();
          };
        });
      }
      
      // Draw text elements
      for (const text of textElements) {
        if (!text.visible) continue;
        
        ctx.save();
        ctx.font = `${text.fontSize}px ${text.fontFamily || 'Arial'}`;
        ctx.fillStyle = text.color;
        ctx.translate(text.x + text.width / 2, text.y + text.height / 2);
        ctx.rotate(text.rotation * Math.PI / 180);
        ctx.fillText(text.content, -text.width / 2, -text.height / 2 + text.fontSize! * 0.8);
        ctx.restore();
      }
      
      // Draw stickers
      for (const sticker of stickerElements) {
        if (!sticker.visible) continue;
        
        // For SVG stickers, this would be more complex
        // This is a simplified version
        ctx.save();
        ctx.translate(sticker.x + sticker.width / 2, sticker.y + sticker.height / 2);
        ctx.rotate(sticker.rotation * Math.PI / 180);
        
        // Draw placeholder for sticker (in real app, you'd render the actual SVG)
        ctx.fillStyle = sticker.color;
        ctx.fillRect(-sticker.width / 2, -sticker.height / 2, sticker.width, sticker.height);
        
        ctx.restore();
      }
      
      // Create download link
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `merged-image-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    };
    
    drawElements();
  };
  
  // History management
  const addToHistory = () => {
    const currentState = {
      images: [...images],
      textElements: [...textElements],
      stickerElements: [...stickerElements],
      canvasWidth,
      canvasHeight
    };
    
    // If we're not at the end of history, remove future states
    if (historyIndex < history.length - 1) {
      setHistory(prev => prev.slice(0, historyIndex + 1));
    }
    
    setHistory(prev => [...prev, currentState]);
    setHistoryIndex(prev => prev + 1);
  };
  
  const undo = () => {
    if (historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    const previousState = history[newIndex];
    
    setImages(previousState.images);
    setTextElements(previousState.textElements);
    setStickerElements(previousState.stickerElements);
    setCanvasWidth(previousState.canvasWidth);
    setCanvasHeight(previousState.canvasHeight);
    
    setHistoryIndex(newIndex);
  };
  
  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    
    const newIndex = historyIndex + 1;
    const nextState = history[newIndex];
    
    setImages(nextState.images);
    setTextElements(nextState.textElements);
    setStickerElements(nextState.stickerElements);
    setCanvasWidth(nextState.canvasWidth);
    setCanvasHeight(nextState.canvasHeight);
    
    setHistoryIndex(newIndex);
  };
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(img => {
        URL.revokeObjectURL(img.url);
      });
    };
  }, []);
  
  // Initialize history
  useEffect(() => {
    addToHistory();
  }, []);
  
  return (
    <div className="w-full">
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
            onClick={deleteSelectedElement}
            variant="outline"
            disabled={!selectedElementId}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Button
            onClick={undo}
            variant="outline"
            disabled={historyIndex <= 0}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={redo}
            variant="outline"
            disabled={historyIndex >= history.length - 1}
          >
            <Redo2 className="h-4 w-4" />
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
            disabled={images.length === 0 && textElements.length === 0 && stickerElements.length === 0}
            className="bg-black hover:bg-gray-800 text-white ml-4"
          >
            <Download className="mr-2 h-4 w-4" /> Export Image
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
        {/* Left sidebar with tools */}
        <div className="space-y-4">
          <Card className="p-4">
            <Tabs defaultValue="template">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="template">
                  <LayoutTemplate className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Templates</span>
                </TabsTrigger>
                <TabsTrigger value="text">
                  <Type className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Text</span>
                </TabsTrigger>
                <TabsTrigger value="stickers">
                  <Smile className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Stickers</span>
                </TabsTrigger>
                <TabsTrigger value="filters">
                  <Sliders className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                </TabsTrigger>
                <TabsTrigger value="layers">
                  <Layers className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Layers</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="template">
                <TemplateSelector onSelectTemplate={handleSelectTemplate} />
              </TabsContent>
              
              <TabsContent value="text">
                <TextStickerControls 
                  onAddText={handleAddText}
                  onAddSticker={handleAddSticker}
                />
              </TabsContent>
              
              <TabsContent value="stickers">
                <TextStickerControls 
                  onAddText={handleAddText}
                  onAddSticker={handleAddSticker}
                />
              </TabsContent>
              
              <TabsContent value="filters">
                <ImageFilters 
                  onApplyFilter={handleApplyFilter}
                  filterSettings={filterSettings}
                />
              </TabsContent>
              
              <TabsContent value="layers">
                <LayerManager 
                  layers={allLayers}
                  onLayerVisibilityChange={handleLayerVisibilityChange}
                  onLayerOrderChange={handleLayerOrderChange}
                  onLayerSelect={handleLayerSelect}
                  selectedLayerId={selectedElementId}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        {/* Canvas area */}
        <div 
          ref={canvasRef}
          className={cn(
            "relative bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden",
            "transition-all duration-200",
            selectedElementId && "border-[#bdf60b]"
          )}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ 
            height: `${canvasHeight * scale}px`,
            width: `${canvasWidth * scale}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
          }}
        >
          {/* Canvas placeholder */}
          {images.length === 0 && textElements.length === 0 && stickerElements.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="h-12 w-12 mb-4" />
              <p className="text-lg">Drag images here or use the tools to add content</p>
            </div>
          ) : (
            <div className="absolute inset-0">
              {/* Here we would render the actual canvas with images, text, stickers */}
              {/* For now, we'll just show placeholder boxes */}
              {images.map(img => (
                <div
                  key={img.id}
                  className={cn(
                    "absolute cursor-move",
                    selectedElementId === img.id && "outline outline-2 outline-[#bdf60b]"
                  )}
                  style={{
                    left: `${img.x}px`,
                    top: `${img.y}px`,
                    width: `${img.width}px`,
                    height: `${img.height}px`,
                    filter: img.filters ? `
                      brightness(${img.filters.brightness}%)
                      contrast(${img.filters.contrast}%)
                      saturate(${img.filters.saturate}%)
                      grayscale(${img.filters.grayscale}%)
                      sepia(${img.filters.sepia}%)
                      hue-rotate(${img.filters.hueRotate}deg)
                      blur(${img.filters.blur}px)
                    ` : undefined
                  }}
                  onClick={() => setSelectedElementId(img.id)}
                >
                  <img
                    src={img.url}
                    alt="Uploaded"
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                  />
                </div>
              ))}
              
              {/* Text elements */}
              {textElements.map(text => (
                <div
                  key={text.id}
                  className={cn(
                    "absolute cursor-move flex items-center justify-center",
                    selectedElementId === text.id && "outline outline-2 outline-[#bdf60b]"
                  )}
                  style={{
                    left: `${text.x}px`,
                    top: `${text.y}px`,
                    width: `${text.width}px`,
                    height: `${text.height}px`,
                    transform: `rotate(${text.rotation}deg)`
                  }}
                  onClick={() => setSelectedElementId(text.id)}
                >
                  <span
                    style={{
                      color: text.color,
                      fontSize: `${text.fontSize}px`,
                      fontFamily: text.fontFamily || 'Arial'
                    }}
                  >
                    {text.content}
                  </span>
                </div>
              ))}
              
              {/* Sticker elements */}
              {stickerElements.map(sticker => (
                <div
                  key={sticker.id}
                  className={cn(
                    "absolute cursor-move flex items-center justify-center",
                    selectedElementId === sticker.id && "outline outline-2 outline-[#bdf60b]"
                  )}
                  style={{
                    left: `${sticker.x}px`,
                    top: `${sticker.y}px`,
                    width: `${sticker.width}px`,
                    height: `${sticker.height}px`,
                    transform: `rotate(${sticker.rotation}deg)`
                  }}
                  onClick={() => setSelectedElementId(sticker.id)}
                >
                  {/* Placeholder for sticker */}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs">Sticker: {sticker.content}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Usage instructions */}
      <div className="mt-6 text-center text-gray-600 text-sm">
        <p>Tip: Use the tabs on the left to add templates, text, stickers, and adjust filters. Click elements to select and edit them.</p>
      </div>
    </div>
  );
} 