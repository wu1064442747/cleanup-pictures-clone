"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Type, 
  Smile, 
  Heart, 
  Star, 
  Award, 
  Sun, 
  CloudSun,
  Sparkles,
  PenTool
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StickerOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  element: React.ReactNode;
}

export interface TextStickerElement {
  id: string;
  type: 'text' | 'sticker';
  content: string;
  color: string;
  fontSize?: number;
  fontFamily?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface TextStickerControlsProps {
  onAddText: (text: Omit<TextStickerElement, 'id'>) => void;
  onAddSticker: (sticker: Omit<TextStickerElement, 'id'>) => void;
}

export default function TextStickerControls({ onAddText, onAddSticker }: TextStickerControlsProps) {
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [textSize, setTextSize] = useState(24);

  const stickers: StickerOption[] = [
    {
      id: 'heart',
      name: 'Heart',
      icon: <Heart className="w-6 h-6 text-red-500" fill="currentColor" />,
      element: <Heart className="w-full h-full text-red-500" fill="currentColor" />
    },
    {
      id: 'star',
      name: 'Star',
      icon: <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />,
      element: <Star className="w-full h-full text-yellow-500" fill="currentColor" />
    },
    {
      id: 'award',
      name: 'Award',
      icon: <Award className="w-6 h-6 text-blue-500" fill="currentColor" />,
      element: <Award className="w-full h-full text-blue-500" fill="currentColor" />
    },
    {
      id: 'smile',
      name: 'Smile',
      icon: <Smile className="w-6 h-6 text-yellow-500" fill="currentColor" />,
      element: <Smile className="w-full h-full text-yellow-500" fill="currentColor" />
    },
    {
      id: 'sun',
      name: 'Sun',
      icon: <Sun className="w-6 h-6 text-orange-500" fill="currentColor" />,
      element: <Sun className="w-full h-full text-orange-500" fill="currentColor" />
    },
    {
      id: 'cloud-sun',
      name: 'Cloud & Sun',
      icon: <CloudSun className="w-6 h-6 text-blue-400" />,
      element: <CloudSun className="w-full h-full text-blue-400" />
    },
    {
      id: 'sparkles',
      name: 'Sparkles',
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      element: <Sparkles className="w-full h-full text-purple-500" />
    },
    {
      id: 'pen',
      name: 'Pen',
      icon: <PenTool className="w-6 h-6 text-green-500" />,
      element: <PenTool className="w-full h-full text-green-500" />
    }
  ];

  const handleAddText = () => {
    if (!textInput.trim()) return;
    
    onAddText({
      type: 'text',
      content: textInput,
      color: textColor,
      fontSize: textSize,
      fontFamily: 'Arial',
      x: 100,
      y: 100,
      width: textInput.length * textSize * 0.6, // Approximate width based on text length
      height: textSize * 1.5,
      rotation: 0
    });
    
    setTextInput('');
  };

  const handleAddSticker = (stickerId: string) => {
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker) return;
    
    onAddSticker({
      type: 'sticker',
      content: stickerId,
      color: 'currentColor',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0
    });
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* Text Controls */}
        <div>
          <h3 className="text-lg font-medium mb-2">Add Text</h3>
          <div className="flex gap-2">
            <input 
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter your text..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bdf60b]"
            />
            <input 
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-10 h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
            />
            <select
              value={textSize}
              onChange={(e) => setTextSize(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bdf60b]"
            >
              <option value={16}>Small</option>
              <option value={24}>Medium</option>
              <option value={32}>Large</option>
              <option value={48}>X-Large</option>
            </select>
            <Button
              onClick={handleAddText}
              disabled={!textInput.trim()}
              className="bg-[#bdf60b] hover:bg-[#bdf60b]/90 text-black"
            >
              <Type className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>
        
        {/* Stickers */}
        <div>
          <h3 className="text-lg font-medium mb-2">Add Sticker</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {stickers.map((sticker) => (
              <Card 
                key={sticker.id}
                className="p-3 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center justify-center"
                onClick={() => handleAddSticker(sticker.id)}
              >
                <div className="mb-1">
                  {sticker.icon}
                </div>
                <span className="text-xs text-center">{sticker.name}</span>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 