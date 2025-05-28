import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dbjnk9nfq',
  api_key: process.env.CLOUDINARY_API_KEY || '367448531737447',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'FKdOuJvjjqfG2f8ibWTJI8sYiWs',
  secure: true,
});

/**
 * Processes form data to extract files
 * @param request NextRequest object containing form data
 * @returns The files extracted from the form data
 */
async function processFormData(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll('file') as File[];
  return files;
}

/**
 * Buffer to Stream conversion for Cloudinary upload
 * @param buffer The buffer to convert
 * @returns Readable stream
 */
function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable._read = () => {}; // _read is required but we don't need to implement it
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export async function POST(request: NextRequest) {
  try {
    const files = await processFormData(request);
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Process each file (up to 20 images as per requirements)
    const maxFiles = 20;
    const filesToProcess = files.slice(0, maxFiles);
    
    const uploadPromises = filesToProcess.map(async (file) => {
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Upload to Cloudinary
      return new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'text-collage',
            resource_type: 'image',
            // Add additional options as needed
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        );
        
        bufferToStream(buffer).pipe(uploadStream);
      });
    });
    
    const uploadResults = await Promise.all(uploadPromises);
    
    // Extract the necessary information from results
    const uploadedImages = uploadResults.map(result => ({
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    }));
    
    return NextResponse.json({
      success: true,
      images: uploadedImages,
      message: `Successfully uploaded ${uploadedImages.length} images`
    });
    
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
} 