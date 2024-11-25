import axios from 'axios';
import logger from '@/lib/core/logger';

export const handleImageUpload = async (
  files: string[],
  startLoadingCallback: () => void,
  endLoadingCallback: () => void,
  errorCallback: () => void,
  progressCallback: (fileIndex: number, progress: number) => void,
) => {
  startLoadingCallback();
  const urls: { url: string; mimeType: string }[] = [];
  const blobs: Blob[] = [];

  for await (const file of files) {
    const blob = await fetch(file).then((r) => r.blob());
    blobs.push(blob);
  }

  for await (const [index, file] of Array.from(blobs).entries()) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'product_form');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || 0;
            const progress = Math.round((progressEvent.loaded / total) * 100);
            progressCallback(index, progress);
          },
        },
      );
      urls.push({ url: response.data.url.replace('http://', 'https://'), mimeType: file.type });
    } catch (error) {
      errorCallback();
      logger.error('Error uploading image:', error);
    }
  }
  endLoadingCallback();

  return urls;
};
