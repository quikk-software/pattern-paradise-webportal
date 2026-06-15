export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Draws the selected crop area onto a canvas of the exact target size and
 * returns a JPEG data URL. Used to enforce the binding 4:1 banner format
 * (default 1600x400) before the image is uploaded.
 */
export async function getCroppedImg(
  imageSrc: string,
  cropPixels: PixelCrop,
  outputWidth = 1600,
  outputHeight = 400,
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  return canvas.toDataURL('image/jpeg', 0.92);
}
