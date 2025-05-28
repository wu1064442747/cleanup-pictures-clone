"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Droplets, SunDim, Contrast, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  className: string;
  settings: {
    brightness?: number;
    contrast?: number;
    saturate?: number;
    grayscale?: number;
    sepia?: number;
    hueRotate?: number;
    blur?: number;
  };
}

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  blur: number;
}

interface ImageFiltersProps {
  onApplyFilter: (filter: FilterSettings) => void;
  filterSettings: FilterSettings;
}

export default function ImageFilters({ onApplyFilter, filterSettings }: ImageFiltersProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Predefined filters
  const filters: FilterOption[] = [
    {
      id: 'normal',
      name: 'Normal',
      icon: <Droplets className="w-6 h-6" />,
      className: '',
      settings: {
        brightness: 100,
        contrast: 100,
        saturate: 100,
        grayscale: 0,
        sepia: 0,
        hueRotate: 0,
        blur: 0
      }
    },
    {
      id: 'bright',
      name: 'Bright',
      icon: <Sun className="w-6 h-6" />,
      className: 'brightness-125',
      settings: {
        brightness: 125,
        contrast: 100,
        saturate: 100,
        grayscale: 0,
        sepia: 0,
        hueRotate: 0,
        blur: 0
      }
    },
    {
      id: 'vintage',
      name: 'Vintage',
      icon: <SunDim className="w-6 h-6" />,
      className: 'sepia-[0.5] brightness-90',
      settings: {
        brightness: 90,
        contrast: 110,
        saturate: 85,
        grayscale: 0,
        sepia: 50,
        hueRotate: 0,
        blur: 0
      }
    },
    {
      id: 'dramatic',
      name: 'Dramatic',
      icon: <Contrast className="w-6 h-6" />,
      className: 'contrast-125 saturate-150',
      settings: {
        brightness: 100,
        contrast: 125,
        saturate: 150,
        grayscale: 0,
        sepia: 0,
        hueRotate: 0,
        blur: 0
      }
    },
    {
      id: 'grayscale',
      name: 'B&W',
      icon: <Moon className="w-6 h-6" />,
      className: 'grayscale',
      settings: {
        brightness: 100,
        contrast: 100,
        saturate: 100,
        grayscale: 100,
        sepia: 0,
        hueRotate: 0,
        blur: 0
      }
    }
  ];

  const handleFilterSelect = (filter: FilterOption) => {
    setSelectedFilter(filter.id);
    onApplyFilter(filter.settings as FilterSettings);
  };

  const handleFilterChange = (property: keyof FilterSettings, value: number) => {
    const newSettings = {
      ...filterSettings,
      [property]: value
    };
    onApplyFilter(newSettings);
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* Filter Presets */}
        <div>
          <h3 className="text-lg font-medium mb-2">Image Filters</h3>
          <div className="grid grid-cols-5 gap-3">
            {filters.map((filter) => (
              <Card 
                key={filter.id}
                className={cn(
                  "p-3 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center justify-center",
                  selectedFilter === filter.id && "border-[#bdf60b] bg-[#bdf60b]/10"
                )}
                onClick={() => handleFilterSelect(filter)}
              >
                <div className="mb-1">
                  {filter.icon}
                </div>
                <span className="text-xs text-center">{filter.name}</span>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Custom Filter Controls */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium mb-2">Adjust Image</h3>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Brightness</span>
              <span className="text-sm text-gray-500">{filterSettings.brightness}%</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="150" 
              value={filterSettings.brightness} 
              onChange={(e) => handleFilterChange('brightness', Number(e.target.value))}
              className="w-full accent-[#bdf60b]"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Contrast</span>
              <span className="text-sm text-gray-500">{filterSettings.contrast}%</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="150" 
              value={filterSettings.contrast} 
              onChange={(e) => handleFilterChange('contrast', Number(e.target.value))}
              className="w-full accent-[#bdf60b]"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Saturation</span>
              <span className="text-sm text-gray-500">{filterSettings.saturate}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="200" 
              value={filterSettings.saturate} 
              onChange={(e) => handleFilterChange('saturate', Number(e.target.value))}
              className="w-full accent-[#bdf60b]"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Grayscale</span>
              <span className="text-sm text-gray-500">{filterSettings.grayscale}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={filterSettings.grayscale} 
              onChange={(e) => handleFilterChange('grayscale', Number(e.target.value))}
              className="w-full accent-[#bdf60b]"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 