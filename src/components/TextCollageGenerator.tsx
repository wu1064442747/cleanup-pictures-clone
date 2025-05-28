"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  Download, 
  Trash2, 
  Image as ImageIcon, 
  Loader2,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedImage {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
}

export default function TextCollageGenerator() {
  // State management
  const [text, setText] = useState<string>('LOVE');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [collageUrl, setCollageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    handleImageUpload(files);
    
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  
  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  }, []);
  
  // Prevent default drag behavior
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  // Upload images to server
  const handleImageUpload = async (files: FileList) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Add each file to form data
      Array.from(files).forEach(file => {
        formData.append('file', file);
      });
      
      // Upload to our API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload images');
      }
      
      const data = await response.json();
      
      // Update state with new images
      setImages(prev => [...prev, ...data.images]);
    } catch (err) {
      console.error('Error uploading images:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Remove an image
  const handleRemoveImage = (publicId: string) => {
    setImages(prev => prev.filter(img => img.publicId !== publicId));
  };
  
  // Clear all images
  const handleClearImages = () => {
    setImages([]);
  };
  
  // Generate collage
  const handleGenerateCollage = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    
    if (!text || text.trim() === '') {
      setError('Please enter some text');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Call our collage API endpoint
      const response = await fetch('/api/collage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          imageIds: images.map(img => img.publicId),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate collage');
      }
      
      const data = await response.json();
      setCollageUrl(data.collageUrl);
      setIsPreviewMode(true);
    } catch (err) {
      console.error('Error generating collage:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate collage');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Download collage
  const handleDownloadCollage = () => {
    if (!collageUrl) return;
    
    const link = document.createElement('a');
    link.href = collageUrl;
    link.download = `text-collage-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Reset to editor mode
  const handleBackToEditor = () => {
    setIsPreviewMode(false);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {isPreviewMode && collageUrl ? (
        // Preview mode
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Text Collage</h2>
              <Button variant="ghost" size="icon" onClick={handleBackToEditor}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="relative aspect-video w-full overflow-hidden rounded-md border border-gray-200">
              <img 
                src={collageUrl} 
                alt="Generated text collage" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex justify-center mt-4 gap-2">
              <Button onClick={handleDownloadCollage} className="bg-[#bdf60b] text-black hover:bg-[#bdf60b]/90">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button variant="outline" onClick={handleBackToEditor}>
                Create New Collage
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Editor mode
        <div className="space-y-4">
          {/* Text input */}
          <Card className="p-4">
            <Label htmlFor="text" className="text-base font-medium mb-2 block">
              Enter your text (max 20 characters)
            </Label>
            <div className="flex gap-2">
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 20))}
                placeholder="Enter text for your collage"
                className="text-lg"
                maxLength={20}
              />
              <div className="text-sm text-gray-500 w-16 text-right">
                {text.length}/20
              </div>
            </div>
          </Card>
          
          {/* Image upload */}
          <Card className="p-4">
            <Label className="text-base font-medium mb-2 block">
              Upload Images (max 20)
            </Label>
            
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center",
                "hover:bg-gray-50 transition-colors duration-200",
                "flex flex-col items-center justify-center"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-gray-700 mb-1">Drag and drop images here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                disabled={isUploading || images.length >= 20}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Select Images
                  </>
                )}
              </Button>
              
              {images.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  {images.length} {images.length === 1 ? 'image' : 'images'} selected
                  {images.length >= 20 && " (maximum reached)"}
                </p>
              )}
            </div>
            
            {/* Image previews */}
            {images.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Uploaded Images</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearImages}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Clear All
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {images.map((image) => (
                    <div key={image.publicId} className="relative group aspect-square">
                      <img
                        src={image.url}
                        alt="Uploaded image"
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        onClick={() => handleRemoveImage(image.publicId)}
                        className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 
                                  text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          
          {/* Generate button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateCollage}
              disabled={isGenerating || images.length === 0 || !text || text.trim() === ''}
              className="bg-[#bdf60b] text-black hover:bg-[#bdf60b]/90 px-8 py-6 text-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Text Collage
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 