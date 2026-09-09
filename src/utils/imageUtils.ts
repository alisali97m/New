/**
 * Utility functions for handling exercise images, client-side compression,
 * and base64 encoding to maintain fast performance and prevent storage quotas.
 */

export async function compressImage(
  file: File,
  maxWidth: number = 1000,
  maxHeight: number = 1000,
  quality: number = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('الملف المختار ليس صورة صالحة'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('فشل قراءة ملف الصورة'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('فشل معالجة محتوى الصورة'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio downscaling if larger than max bounds
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original read if canvas context fails
          resolve(reader.result as string);
          return;
        }

        // Draw image on canvas with nice interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to efficient JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

export async function processImageFiles(
  files: FileList | File[],
  maxWidth: number = 1000,
  maxHeight: number = 1000,
  quality: number = 0.78
): Promise<string[]> {
  const fileArray = Array.from(files);
  const imageFiles = fileArray.filter((f) => f.type.startsWith('image/'));
  
  if (imageFiles.length === 0) {
    return [];
  }

  const compressionPromises = imageFiles.map((f) =>
    compressImage(f, maxWidth, maxHeight, quality).catch((err) => {
      console.warn('Could not compress image file:', f.name, err);
      return null;
    })
  );

  const results = await Promise.all(compressionPromises);
  return results.filter((res): res is string => Boolean(res));
}
