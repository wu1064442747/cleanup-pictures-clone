import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dbjnk9nfq',
  api_key: process.env.CLOUDINARY_API_KEY || '367448531737447',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'FKdOuJvjjqfG2f8ibWTJI8sYiWs',
  secure: true,
});

/**
 * Uploads an image to Cloudinary
 * @param file The file to upload
 * @returns The Cloudinary upload response
 */
export async function uploadImage(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'text-collage'); // You can create this preset in Cloudinary dashboard

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dbjnk9nfq'}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

/**
 * Creates a text image mask using Cloudinary
 * @param text The text to use for the mask
 * @param imageUrls Array of image URLs to use in the collage
 * @returns URL of the generated collage
 */
export function generateTextCollage(text: string, imageUrls: string[]): string {
  // Build the Cloudinary transformation URL
  // This is a simple implementation - we'll improve it later
  
  // Base Cloudinary URL
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dbjnk9nfq'}/image/upload`;
  
  // Create the text layer with proper styling
  const textLayer = `l_text:Arial_80_bold:${encodeURIComponent(text)},co_white,w_800,c_fit`;
  
  // Apply a background for better visibility
  const backgroundLayer = 'b_rgb:000000';
  
  // Combine transformations
  const transformation = `${backgroundLayer}/${textLayer}/fl_cutter,e_colorize`;
  
  // Use the first image as base for the collage
  // In a more advanced implementation, we would create a proper collage of all images
  const baseImage = imageUrls[0].includes('cloudinary') 
    ? imageUrls[0].replace('/upload/', `/upload/${transformation}/`)
    : `${baseUrl}/${transformation}/${imageUrls[0]}`;
  
  return baseImage;
}

export default cloudinary; 