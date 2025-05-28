"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Image as ImageIcon, 
  Type, 
  Sticker
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Layer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'sticker';
  visible: boolean;
  thumbnailUrl?: string;
}

interface LayerManagerProps {
  layers: Layer[];
  onLayerVisibilityChange: (id: string, visible: boolean) => void;
  onLayerOrderChange: (id: string, direction: 'up' | 'down') => void;
  onLayerSelect: (id: string) => void;
  selectedLayerId: string | null;
}

export default function LayerManager({ 
  layers, 
  onLayerVisibilityChange, 
  onLayerOrderChange,
  onLayerSelect,
  selectedLayerId
}: LayerManagerProps) {
  
  const handleToggleVisibility = (id: string, visible: boolean) => {
    onLayerVisibilityChange(id, !visible);
  };

  const handleMoveLayer = (id: string, direction: 'up' | 'down') => {
    onLayerOrderChange(id, direction);
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'sticker':
        return <Sticker className="w-4 h-4" />;
      default:
        return <ImageIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-2">Layers</h3>
      
      <div className="space-y-2">
        {layers.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No layers yet. Add images, text, or stickers.</p>
        ) : (
          layers.map((layer, index) => (
            <Card 
              key={layer.id}
              className={cn(
                "p-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors",
                selectedLayerId === layer.id && "border-[#bdf60b] bg-[#bdf60b]/10"
              )}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center gap-3">
                {layer.thumbnailUrl ? (
                  <div className="w-8 h-8 relative overflow-hidden rounded border border-gray-200">
                    <img 
                      src={layer.thumbnailUrl} 
                      alt={layer.name} 
                      className={cn(
                        "w-full h-full object-cover",
                        !layer.visible && "opacity-50"
                      )}
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded">
                    {getLayerIcon(layer.type)}
                  </div>
                )}
                
                <span className={cn(
                  "text-sm font-medium truncate max-w-[120px]",
                  !layer.visible && "text-gray-400"
                )}>
                  {layer.name}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleVisibility(layer.id, layer.visible);
                  }}
                >
                  {layer.visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={index === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveLayer(layer.id, 'up');
                  }}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={index === layers.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveLayer(layer.id, 'down');
                  }}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 