"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  LayoutTemplate, 
  Grid2X2, 
  LayoutGrid, 
  Instagram, 
  Image as ImageIcon, 
  FileImage
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  layout: {
    width: number;
    height: number;
    slots: {
      x: number;
      y: number;
      width: number;
      height: number;
    }[];
  };
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: TemplateOption) => void;
}

export default function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Predefined templates
  const templates: TemplateOption[] = [
    {
      id: 'single',
      name: 'Single Image',
      icon: <ImageIcon className="w-6 h-6" />,
      layout: {
        width: 800,
        height: 600,
        slots: [
          { x: 0, y: 0, width: 800, height: 600 }
        ]
      }
    },
    {
      id: 'side-by-side',
      name: 'Side by Side',
      icon: <LayoutTemplate className="w-6 h-6" />,
      layout: {
        width: 800,
        height: 400,
        slots: [
          { x: 0, y: 0, width: 395, height: 400 },
          { x: 405, y: 0, width: 395, height: 400 }
        ]
      }
    },
    {
      id: 'grid-2x2',
      name: 'Grid 2x2',
      icon: <Grid2X2 className="w-6 h-6" />,
      layout: {
        width: 800,
        height: 800,
        slots: [
          { x: 0, y: 0, width: 395, height: 395 },
          { x: 405, y: 0, width: 395, height: 395 },
          { x: 0, y: 405, width: 395, height: 395 },
          { x: 405, y: 405, width: 395, height: 395 }
        ]
      }
    },
    {
      id: 'instagram-post',
      name: 'Instagram Post',
      icon: <Instagram className="w-6 h-6" />,
      layout: {
        width: 1080,
        height: 1080,
        slots: [
          { x: 0, y: 0, width: 1080, height: 1080 }
        ]
      }
    },
    {
      id: 'collage',
      name: 'Photo Collage',
      icon: <FileImage className="w-6 h-6" />,
      layout: {
        width: 800,
        height: 600,
        slots: [
          { x: 0, y: 0, width: 500, height: 600 },
          { x: 510, y: 0, width: 290, height: 295 },
          { x: 510, y: 305, width: 290, height: 295 }
        ]
      }
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: <LayoutGrid className="w-6 h-6" />,
      layout: {
        width: 736,
        height: 1104,
        slots: [
          { x: 0, y: 0, width: 736, height: 1104 }
        ]
      }
    }
  ];

  const handleTemplateSelect = (template: TemplateOption) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Choose a Template</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={cn(
              "p-3 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center justify-center",
              selectedTemplate === template.id && "border-[#bdf60b] bg-[#bdf60b]/10"
            )}
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="mb-2">
              {template.icon}
            </div>
            <span className="text-xs text-center">{template.name}</span>
          </Card>
        ))}
      </div>
    </div>
  );
} 