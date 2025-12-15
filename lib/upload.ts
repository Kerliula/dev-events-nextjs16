import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface UploadOptions {
  directory?: string;
  allowedTypes?: string[];
  maxSizeInMB?: number;
}

export interface UploadResult {
  success: boolean;
  path?: string;
  error?: string;
}

const DEFAULT_OPTIONS: UploadOptions = {
  directory: 'events',
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxSizeInMB: 5,
};

/**
 * Upload an image file to the public directory
 * @param file - The File object to upload
 * @param options - Upload configuration options
 * @returns UploadResult with path or error
 */
export async function uploadImage(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const config = { ...DEFAULT_OPTIONS, ...options };

  // Validate file exists
  if (!file || !file.size) {
    return { success: false, error: 'No file provided' };
  }

  // Validate file type
  if (config.allowedTypes && !config.allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file type. Allowed: ${config.allowedTypes.join(', ')}`,
    };
  }

  // Validate file size
  const fileSizeInMB = file.size / (1024 * 1024);
  if (config.maxSizeInMB && fileSizeInMB > config.maxSizeInMB) {
    return {
      success: false,
      error: `File size exceeds ${config.maxSizeInMB}MB limit`,
    };
  }

  try {
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const filename = `${timestamp}-${sanitizedName}`;

    // Prepare upload directory
    const uploadDir = join(process.cwd(), 'public', 'images', config.directory!);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return relative public path
    const publicPath = `/images/${config.directory}/${filename}`;
    return { success: true, path: publicPath };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Process FormData and extract event data with image upload
 * @param formData - FormData from request
 * @returns Processed event data object
 */
export async function parseEventFormData(formData: FormData): Promise<{
  data?: Record<string, any>;
  error?: string;
}> {
  const eventData: Record<string, any> = {};

  try {
    for (const [key, value] of formData.entries()) {
      // Handle image upload
      if (key === 'image' && value instanceof File) {
        const result = await uploadImage(value);
        
        if (!result.success) {
          return { error: result.error };
        }
        
        eventData[key] = result.path;
      }
      // Handle array fields
      else if (key === 'agenda' || key === 'tags') {
        const existing = eventData[key];
        eventData[key] = existing
          ? Array.isArray(existing)
            ? [...existing, value]
            : [existing, value]
          : [value];
      }
      // Handle regular fields
      else {
        eventData[key] = value;
      }
    }

    return { data: eventData };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to parse form data',
    };
  }
}
