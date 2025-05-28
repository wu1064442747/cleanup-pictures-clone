"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Download, Trash2, ZoomIn, ZoomOut, Sparkles, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAIDesignSuggestions, type AIDesignResponse } from '@/lib/ai-service';

interface ImageFile {
  id: string;
  file: File;
  url: string;
}

export default function TextShapedImageMerge() {
  const [text, setText] = useState('LOVE');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [scale, setScale] = useState(1);
  const [fontSize, setFontSize] = useState(250);
  const [fontWeight, setFontWeight] = useState('bold');
  const [fontFamily, setFontFamily] = useState("'Microsoft YaHei', 'SimHei', sans-serif");
  const [generating, setGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIDesignResponse | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newImages = Array.from(files).map(file => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      url: URL.createObjectURL(file)
    }));
    
    setImages(prev => [...prev, ...newImages]);
    
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
      const newImages = Array.from(e.dataTransfer.files).map(file => ({
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        url: URL.createObjectURL(file)
      }));
      
      setImages(prev => [...prev, ...newImages]);
    }
  };
  
  // Prevent default drag behavior
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Request AI design suggestions
  const requestAiSuggestions = async () => {
    if (images.length === 0 || !text) return;
    
    setAiLoading(true);
    setShowAiPanel(true);
    
    try {
      const suggestions = await getAIDesignSuggestions({
        text,
        imageCount: images.length
      });
      
      setAiSuggestions(suggestions);
      
      // 自动应用AI建议的字体
      if (suggestions.fontRecommendations && suggestions.fontRecommendations.length > 0) {
        // 根据建议选择字体
        const fontMap: Record<string, string> = {
          'Arial': 'Arial, sans-serif',
          'Times New Roman': "'Times New Roman', serif",
          'Impact': 'Impact, fantasy',
          'Comic Sans': "'Comic Sans MS', cursive",
          'Courier': "'Courier New', monospace",
        };
        
        // 查找匹配的字体
        const recommendedFont = suggestions.fontRecommendations[0];
        for (const [key, value] of Object.entries(fontMap)) {
          if (recommendedFont.toLowerCase().includes(key.toLowerCase())) {
            setFontFamily(value);
            break;
          }
        }
      }
    } catch (error) {
      console.error('获取AI建议失败:', error);
    } finally {
      setAiLoading(false);
    }
  };
  
  // Apply font from AI suggestions
  const applyAiFont = (fontIndex: number) => {
    if (!aiSuggestions || !aiSuggestions.fontRecommendations || aiSuggestions.fontRecommendations.length <= fontIndex) {
      return;
    }
    
    const fontName = aiSuggestions.fontRecommendations[fontIndex];
    const fontMap: Record<string, string> = {
      'Arial': 'Arial, sans-serif',
      'Times New Roman': "'Times New Roman', serif",
      'Impact': 'Impact, fantasy',
      'Comic Sans': "'Comic Sans MS', cursive",
      'Courier': "'Courier New', monospace",
    };
    
    // 查找匹配的字体
    for (const [key, value] of Object.entries(fontMap)) {
      if (fontName.toLowerCase().includes(key.toLowerCase())) {
        setFontFamily(value);
        break;
      }
    }
  };
  
  // Generate text mask and place images
  const generateTextMask = async () => {
    if (!canvasRef.current || images.length === 0 || !text) return;
    
    setGenerating(true);
    setError(null);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) {
        throw new Error('Unable to get canvas context');
      }
      
      // Apply design style influences with default values
      const backgroundColor = '#ffffff';
      const textColor = '#000000';
      const imageOpacity = 0.95;
      const imageSpacing = 1;
      const imageRotation = 0.02;
      
      // Set canvas size
      const canvasWidth = 1800;
      const canvasHeight = 1200;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Clear canvas with the style-based background color
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw text as mask
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 检测是否包含中文字符
      const containsChinese = /[\u4E00-\u9FFF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF]/.test(text);

      // 对中文字符采用更大的字体和加粗处理
      if (containsChinese) {
        // 使用更适合中文显示的字体设置
        const chineseFontFamily = fontFamily.includes('Arial') ? '"Microsoft YaHei", "SimHei", sans-serif' : fontFamily;
        
        // 增加字体大小
        ctx.font = `900 ${fontSize * 1.8}px ${chineseFontFamily}`;
        
        // 使用多重描边技术来显著增强文字边缘
        for (let i = 0; i < 5; i++) {
          const strokeWidth = fontSize * 0.08 + i * 2;
          ctx.lineWidth = strokeWidth;
          ctx.strokeStyle = '#000000';
          ctx.strokeText(text, canvasWidth / 2, canvasHeight / 2);
        }
        
        // 填充文字
        ctx.fillStyle = '#000000';
        ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
        
        // 添加一层更粗的描边
        ctx.lineWidth = fontSize * 0.1;
        ctx.strokeText(text, canvasWidth / 2, canvasHeight / 2);
        
        console.log(`检测到中文字符，使用大幅增强绘制: "${text}", 字体: ${ctx.font}`);
      } else {
        // 非中文使用原来的设置
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = '#000000';
        ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
        
        console.log(`绘制文字: "${text}" 在位置 (${canvasWidth/2}, ${canvasHeight/2}), 使用字体: ${ctx.font}`);
      }
      
      // Get text pixel data - 确保这一步能正确读取像素数据
      let updatedTextData2;
      try {
        updatedTextData2 = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      } catch (e) {
        console.error('读取像素数据失败:', e);
        throw new Error('无法读取文字像素数据');
      }
      const updatedTextPixels2 = updatedTextData2.data;
      
      // 修改文字像素检测算法，优化对黑色像素的检测方式
      let hasText = false;
      for (let i = 0; i < updatedTextPixels2.length; i += 4) {
        // 检查是否为黑色或深色像素 - 增加阈值
        const r = updatedTextPixels2[i];
        const g = updatedTextPixels2[i + 1];
        const b = updatedTextPixels2[i + 2];
        const brightness = (r + g + b) / 3;
        
        if (brightness < 100) { // 大幅提高阈值，更宽松地识别文字区域
          hasText = true;
          break;
        }
      }
      
      if (!hasText) {
        console.warn('未检测到文字像素，可能是字体问题或文字颜色问题');
      }
      
      // Clear canvas again for final composition
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Load all images
      const loadedImages = await Promise.all(
        images.map(img => new Promise<HTMLImageElement>((resolve, reject) => {
          const imgElement = new Image();
          imgElement.onload = () => resolve(imgElement);
          imgElement.onerror = () => reject(new Error(`无法加载图片: ${img.file.name}`));
          imgElement.src = img.url;
        }))
      );
      
      console.log(`成功加载 ${loadedImages.length} 张图片`);
      
      // Create grid for image placement
      const containsChineseForGrid = /[\u4E00-\u9FFF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF]/.test(text);
      const baseGridSize = containsChineseForGrid ? 3 : 10;
      // Apply style-based spacing adjustment
      const gridSize = Math.round(baseGridSize * imageSpacing);
      
      // Find text boundary pixels - 使用改进的检测算法
      const textBoundary = [];
      
      // 为中文字符添加更精细的检测方法
      if (containsChineseForGrid) {
        // 检测每个网格中暗像素的数量，根据比例决定是否包含
        for (let y = 0; y < canvasHeight; y += gridSize) {
          for (let x = 0; x < canvasWidth; x += gridSize) {
            // 统计暗像素比例
            let darkPixelCount = 0;
            let totalCheckedPixels = 0;
            
            for (let dy = 0; dy < gridSize && y + dy < canvasHeight; dy++) {
              for (let dx = 0; dx < gridSize && x + dx < canvasWidth; dx++) {
                const pixelIndex = ((y + dy) * canvasWidth + (x + dx)) * 4;
                const r = updatedTextPixels2[pixelIndex];
                const g = updatedTextPixels2[pixelIndex + 1];
                const b = updatedTextPixels2[pixelIndex + 2];
                const brightness = (r + g + b) / 3;
                
                totalCheckedPixels++;
                if (brightness < 100) { 
                  darkPixelCount++;
                }
              }
            }
            
            // 如果暗像素比例超过一定阈值，则认为此网格包含文字
            if (darkPixelCount > 0 && darkPixelCount / totalCheckedPixels > 0.15) {
              textBoundary.push({ x, y });
            }
          }
        }
      } else {
        // 非中文字符使用原有检测方法
        for (let y = 0; y < canvasHeight; y += gridSize) {
          for (let x = 0; x < canvasWidth; x += gridSize) {
            // Check if this grid cell contains any text pixels
            let hasTextPixel = false;
            
            for (let dy = 0; dy < gridSize && y + dy < canvasHeight; dy++) {
              for (let dx = 0; dx < gridSize && x + dx < canvasWidth; dx++) {
                const pixelIndex = ((y + dy) * canvasWidth + (x + dx)) * 4;
                const r = updatedTextPixels2[pixelIndex];
                const g = updatedTextPixels2[pixelIndex + 1];
                const b = updatedTextPixels2[pixelIndex + 2];
                const brightness = (r + g + b) / 3;
                
                if (brightness < 100) {
                  hasTextPixel = true;
                  break;
                }
              }
              if (hasTextPixel) break;
            }
            
            if (hasTextPixel) {
              textBoundary.push({ x, y });
            }
          }
        }
      }
      
      console.log(`找到 ${textBoundary.length} 个文字边界点`);
      
      // 如果没有找到边界点，尝试绘制更粗的字体
      if (textBoundary.length === 0) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // 重新绘制文字，使用更粗的笔画
        ctx.fillStyle = '#000000';

        // 检测是否包含中文字符
        const containsChineseBackup = /[\u4E00-\u9FFF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF]/.test(text);

        if (containsChineseBackup) {
          // 为中文使用特殊的渲染方式
          const chineseFontFamily = fontFamily.includes('Arial') ? '"Microsoft YaHei", "SimHei", sans-serif' : fontFamily;
          
          // 显著增大字体
          ctx.font = `900 ${fontSize * 2.2}px ${chineseFontFamily}`;
          
          // 创建非常粗的描边效果
          for (let i = 0; i < 8; i++) {
            ctx.lineWidth = fontSize * 0.15 + i * 3;
            ctx.strokeStyle = '#000000';
            // 稍微偏移每一层描边，创建更宽的边缘
            const offset = i * 0.5;
            ctx.strokeText(text, canvasWidth / 2 + offset, canvasHeight / 2 + offset);
            ctx.strokeText(text, canvasWidth / 2 - offset, canvasHeight / 2 - offset);
          }
          
          // 填充中心
          ctx.fillStyle = '#000000';
          ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
          
          console.log(`备用方案：中文字符大幅增强绘制: "${text}", 字体: ${ctx.font}`);
        } else {
          // 非中文使用原来的处理方式
          ctx.lineWidth = 10;
          ctx.strokeStyle = '#000000';
          ctx.font = `900 ${fontSize}px ${fontFamily}`;
          ctx.strokeText(text, canvasWidth / 2, canvasHeight / 2);
          ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
        }
        
        // 再次获取像素数据
        let updatedTextData2;
        try {
          updatedTextData2 = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        } catch (e) {
          console.error('读取像素数据失败:', e);
          throw new Error('无法读取文字像素数据');
        }
        const updatedTextPixels2 = updatedTextData2.data;
        
        // 再次查找边界点
        for (let y = 0; y < canvasHeight; y += gridSize) {
          for (let x = 0; x < canvasWidth; x += gridSize) {
            let hasTextPixel = false;
            
            for (let dy = 0; dy < gridSize && y + dy < canvasHeight; dy++) {
              for (let dx = 0; dx < gridSize && x + dx < canvasWidth; dx++) {
                const pixelIndex = ((y + dy) * canvasWidth + (x + dx)) * 4;
                const r = updatedTextPixels2[pixelIndex];
                const g = updatedTextPixels2[pixelIndex + 1];
                const b = updatedTextPixels2[pixelIndex + 2];
                const brightness = (r + g + b) / 3;
                
                if (brightness < 100) { // 大幅提高阈值，更宽松地识别文字区域
                  hasTextPixel = true;
                  break;
                }
              }
              if (hasTextPixel) break;
            }
            
            if (hasTextPixel) {
              textBoundary.push({ x, y });
            }
          }
        }
        
        console.log(`使用粗体后找到 ${textBoundary.length} 个文字边界点`);
        
        if (textBoundary.length === 0) {
          throw new Error('无法创建文字形状，请尝试不同的文字或字体');
        }
        
        // 准备重新绘制最终的图像
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
      
      // Place images in the text boundary
      if (textBoundary.length > 0 && loadedImages.length > 0) {
        const cellsPerImage = Math.max(1, Math.floor(textBoundary.length / loadedImages.length));
        
        textBoundary.forEach((cell, index) => {
          const imageIndex = Math.floor(index / cellsPerImage) % loadedImages.length;
          const img = loadedImages[imageIndex];
          
          // Calculate size to maintain aspect ratio
          const imgAspect = img.width / img.height;
          
          // 对中文字符的图片大小进行特殊处理 - 使用更小、更密集的图片布局获得更精细的效果
          let cellWidth = containsChineseForGrid ? gridSize * 0.9 : gridSize * 1.5;
          let cellHeight = containsChineseForGrid ? gridSize * 0.9 : gridSize * 1.5;
          
          if (imgAspect > 1) {
            cellHeight = cellWidth / imgAspect;
          } else {
            cellWidth = cellHeight * imgAspect;
          }
          
          // 增加随机偏移，使拼贴效果更自然（尤其对中文字符）
          let offsetX = 0;
          let offsetY = 0;
          
          if (containsChineseForGrid) {
            // 对中文添加更大的随机偏移，使图片排列更加自然多变
            offsetX = (Math.random() - 0.5) * (gridSize * 0.5);
            offsetY = (Math.random() - 0.5) * (gridSize * 0.5);
            
            // 对中文字符，让图片稍微重叠，使得轮廓更清晰
            cellWidth *= 1.15;
            cellHeight *= 1.15;
          }
          
          // 启用高质量图像渲染
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // 添加图片边框函数
          const drawImageWithBorder = (x: number, y: number, w: number, h: number) => {
            // Add shadow for better depth and clarity
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 1;
            ctx.shadowOffsetX = 0.5;
            ctx.shadowOffsetY = 0.5;
            
            // 绘制图片
            ctx.drawImage(img, x, y, w, h);
            
            // Reset shadow for border
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            // 为所有图片添加细微边框，提高清晰度和区分度
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x, y, w, h);
          };
          
          // Apply style-based rotation adjustment
          const styleBasedRotation = imageRotation;
          
          // Adjust random rotation based on style
          if (containsChineseForGrid && Math.random() > 0.7) {
            const rotation = (Math.random() - 0.5) * 0.2 + (styleBasedRotation * (Math.random() > 0.5 ? 1 : -1)); 
            ctx.save();
            ctx.translate(cell.x + offsetX + cellWidth/2, cell.y + offsetY + cellHeight/2);
            ctx.rotate(rotation);
            
            // Apply style-based opacity
            ctx.globalAlpha = imageOpacity;
            
            // Draw image
            drawImageWithBorder(-cellWidth/2, -cellHeight/2, cellWidth, cellHeight);
            ctx.restore();
          } else {
            // Apply style-based opacity
            ctx.globalAlpha = imageOpacity;
            
            // Draw image
            drawImageWithBorder(cell.x + offsetX, cell.y + offsetY, cellWidth, cellHeight);
          }
          
          // Reset opacity for next drawing operations
          ctx.globalAlpha = 1;
        });
      }
      
      // Update preview canvas
      updatePreviewCanvas();
      setHasResult(true);
      
    } catch (error) {
      console.error('生成图片时发生错误:', error);
      setError(error instanceof Error ? error.message : '生成图片时发生未知错误');
    } finally {
      setGenerating(false);
    }
  };
  
  // Update preview canvas with scaled version
  const updatePreviewCanvas = () => {
    if (!canvasRef.current || !previewCanvasRef.current) return;
    
    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    const previewCtx = previewCanvas.getContext('2d');
    
    if (!previewCtx) return;
    
    // Get the container width to set max dimensions
    const containerWidth = previewCanvas.parentElement?.clientWidth || window.innerWidth - 100;
    const containerHeight = window.innerHeight * 0.65; // 65vh
    
    // Calculate scaled dimensions while maintaining aspect ratio
    const canvasAspect = canvas.width / canvas.height;
    
    // Calculate the best fit size for the container
    let scaledWidth, scaledHeight;
    
    if (containerWidth / containerHeight > canvasAspect) {
      // Container is wider than needed, constrain by height
      scaledHeight = containerHeight;
      scaledWidth = scaledHeight * canvasAspect;
    } else {
      // Container is taller than needed, constrain by width
      scaledWidth = containerWidth;
      scaledHeight = scaledWidth / canvasAspect;
    }
    
    // Apply user scale factor (zooming)
    scaledWidth *= scale;
    scaledHeight *= scale;
    
    // Set preview canvas size
    previewCanvas.width = scaledWidth;
    previewCanvas.height = scaledHeight;
    
    // Clear preview canvas
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    // Draw scaled content
    previewCtx.drawImage(
      canvas,
      0, 0, canvas.width, canvas.height,
      0, 0, previewCanvas.width, previewCanvas.height
    );
    
    console.log(`Preview updated: ${scaledWidth}x${scaledHeight} (scale: ${scale})`);
  };
  
  // Export final image with high resolution
  const exportImage = () => {
    if (!canvasRef.current) return;
    
    // Get the main canvas
    const canvas = canvasRef.current;
    
    // Create a high-resolution canvas for export
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    
    if (!exportCtx) {
      console.error('Failed to get export canvas context');
      return;
    }
    
    // Set higher resolution - 4x the original for better quality when zoomed
    const scaleFactor = 4;
    exportCanvas.width = canvas.width * scaleFactor;
    exportCanvas.height = canvas.height * scaleFactor;
    
    // Use high quality image rendering
    exportCtx.imageSmoothingEnabled = true;
    exportCtx.imageSmoothingQuality = 'high';
    
    // First clear with background color
    exportCtx.fillStyle = '#ffffff';
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    
    // Draw the original canvas to the export canvas with scaling
    exportCtx.drawImage(
      canvas,
      0, 0, canvas.width, canvas.height,
      0, 0, exportCanvas.width, exportCanvas.height
    );
    
    // Generate high-quality PNG with maximum quality
    const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
    
    // Create download link
    const link = document.createElement('a');
    link.download = `text-image-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    
    console.log(`Exported high-resolution image: ${exportCanvas.width}x${exportCanvas.height}px (${scaleFactor}x upscaled)`);
  };
  
  // Clear all images
  const clearImages = () => {
    // Revoke object URLs to prevent memory leaks
    images.forEach(img => URL.revokeObjectURL(img.url));
    setImages([]);
    setHasResult(false);
  };
  
  // Effect to auto-generate when text or images change
  useEffect(() => {
    if (images.length > 0 && text) {
      const timer = setTimeout(() => {
        generateTextMask();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [text, fontSize, fontFamily, fontWeight, images.length]);
  
  // Effect to update preview when scale changes
  useEffect(() => {
    updatePreviewCanvas();
  }, [scale]);
  
  // Add resize listener to update canvas on window resize
  useEffect(() => {
    if (!hasResult) return;
    
    const handleResize = () => {
      updatePreviewCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [hasResult]);
  
  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.url));
    };
  }, []);
  
  return (
    <div className="w-full">
      {/* Hidden main canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Input Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text (e.g. LOVE, HOME, 爱)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bdf60b]"
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <input
              type="range"
              min="150"
              max="500"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-[#bdf60b]"
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#bdf60b]"
            >
              <option value="'Microsoft YaHei', 'SimHei', sans-serif">微软雅黑</option>
              <option value="'SimHei', sans-serif">黑体</option>
              <option value="'KaiTi', serif">楷体</option>
              <option value="'SimSun', serif">宋体</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Impact, fantasy">Impact</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="'Comic Sans MS', cursive">Comic Sans</option>
            </select>
          </div>
        </div>
        
        {/* 设计风格和AI助手 */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Removed the AI Design Assistant button and description */}
        </div>
        
        <div className="flex justify-between items-center">
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
              onClick={clearImages}
              variant="outline"
              disabled={images.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear Images
            </Button>
            <Button
              onClick={generateTextMask}
              disabled={images.length === 0 || !text || generating}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Generate
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setScale(prev => Math.max(0.1, prev - 0.1))}
              variant="outline"
              disabled={scale <= 0.1 || !hasResult}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-3">{Math.round(scale * 100)}%</span>
            <Button
              onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
              variant="outline"
              disabled={scale >= 2 || !hasResult}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              onClick={exportImage}
              disabled={!hasResult}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
      </div>
      
      {/* Image thumbnails */}
      {images.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({images.length})</h3>
          <div className="flex flex-wrap gap-2">
            {images.map(img => (
              <div key={img.id} className="w-16 h-16 relative overflow-hidden rounded border border-gray-200">
                <img 
                  src={img.url} 
                  alt="Uploaded" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-red-800">Error Generating Image</h4>
            <p className="text-sm text-red-700">{error}</p>
            <p className="text-xs text-red-600 mt-1">Please try different text or font, or re-upload your images</p>
          </div>
        </div>
      )}
      
      {/* AI Design Suggestions Panel */}
      {showAiPanel && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200 relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-2 right-2 h-8 w-8 p-0" 
            onClick={() => setShowAiPanel(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Sparkles className="mr-2 h-4 w-4 text-[#bdf60b]" /> 
            AI Design Suggestions
          </h3>
          
          {aiLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#bdf60b]"></div>
              <span className="ml-2 text-sm text-gray-500">Getting design suggestions...</span>
            </div>
          ) : aiSuggestions ? (
            <div className="space-y-3">
              {aiSuggestions.suggestions && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500">Arrangement Suggestions</h4>
                  <p className="text-sm text-gray-700">{aiSuggestions.suggestions}</p>
                </div>
              )}
              
              {aiSuggestions.layoutAdvice && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500">Layout Advice</h4>
                  <p className="text-sm text-gray-700">{aiSuggestions.layoutAdvice}</p>
                </div>
              )}
              
              {aiSuggestions.fontRecommendations && aiSuggestions.fontRecommendations.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500">Recommended Fonts</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {aiSuggestions.fontRecommendations.map((font, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm" 
                        onClick={() => applyAiFont(index)}
                        className="text-xs py-1"
                      >
                        {font}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No suggestions yet. Click "AI Design Assistant" to get suggestions</p>
          )}
        </div>
      )}
      
      {/* Preview area */}
      <div 
        className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center overflow-auto p-4"
        style={{ minHeight: '500px' }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {images.length === 0 ? (
          <div className="text-center text-gray-400">
            <p className="mb-2">Drag images here or click "Add Images" button</p>
            <p className="text-sm">Then input text to create a text-shaped image collage</p>
          </div>
        ) : generating ? (
          <div className="text-center text-gray-600">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bdf60b] mx-auto mb-4"></div>
            <p>Generating text image...</p>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full overflow-auto">
            <canvas ref={previewCanvasRef} className="max-w-full max-h-[65vh] object-contain shadow-lg" style={{width: 'auto', height: 'auto'}} />
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Tip: Upload multiple images, then input text. Images will be arranged in the shape of your text.</p>
      </div>
    </div>
  );
} 