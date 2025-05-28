import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dbjnk9nfq',
  api_key: process.env.CLOUDINARY_API_KEY || '367448531737447',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'FKdOuJvjjqfG2f8ibWTJI8sYiWs',
  secure: true,
});

interface CollageRequest {
  text: string;
  imageIds: string[];
}

export async function POST(request: NextRequest) {
  try {
    const data: CollageRequest = await request.json();
    const { text, imageIds } = data;

    if (!text || !imageIds || imageIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required parameters: text and imageIds' },
        { status: 400 }
      );
    }

    // Limit text length
    if (text.length > 20) {
      return NextResponse.json(
        { error: 'Text must be 20 characters or less' },
        { status: 400 }
      );
    }

    // Generate a unique identifier for this collage
    const uniqueId = `collage_${Date.now()}`;
    
    // Create a collage using Cloudinary's text and overlay capabilities
    
    // Method 1: Use text as mask and create a simple URL transformation
    // This is more direct but less customizable
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dbjnk9nfq';
    const imageId = imageIds[0]; // Use first image as base
    
    // Build the transformation URL
    // Create a text layer and use it as a mask for the image
    const transformation = [
      { width: 1000, height: 600, crop: 'fill' },
      { color: 'black', overlay: { font_family: 'Arial', font_size: 150, font_weight: 'bold', text: text } },
      { color: 'white', effect: 'mask' }
    ];
    
    // Generate URL directly (simpler method for MVP)
    const url = cloudinary.url(imageId, {
      transformation,
      sign_url: true,
      secure: true,
    });
    
    return NextResponse.json({
      success: true,
      collageUrl: url,
      message: 'Collage generated successfully'
    });
    
  } catch (error) {
    console.error('Error generating collage:', error);
    return NextResponse.json(
      { error: 'Failed to generate collage', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 