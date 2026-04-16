export type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export async function getCroppedImg(
  imageSrc: string,
  crop: CropArea,
  rotation: number,
  outputSize = 400,
): Promise<Blob> {
  const image = await loadImage(imageSrc);

  // First draw the rotated image to a temp canvas, then crop from it.
  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const rotatedW = image.width * cos + image.height * sin;
  const rotatedH = image.width * sin + image.height * cos;

  const rotCanvas = document.createElement("canvas");
  rotCanvas.width = rotatedW;
  rotCanvas.height = rotatedH;
  const rotCtx = rotCanvas.getContext("2d");
  if (!rotCtx) throw new Error("Canvas context unavailable");

  rotCtx.translate(rotatedW / 2, rotatedH / 2);
  rotCtx.rotate(rad);
  rotCtx.drawImage(image, -image.width / 2, -image.height / 2);

  const out = document.createElement("canvas");
  out.width = outputSize;
  out.height = outputSize;
  const outCtx = out.getContext("2d");
  if (!outCtx) throw new Error("Canvas context unavailable");

  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = "high";
  outCtx.drawImage(
    rotCanvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outputSize,
    outputSize,
  );

  return await new Promise<Blob>((resolve, reject) => {
    out.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to generate image blob"));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      0.9,
    );
  });
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }
      resolve(result);
    });
    reader.addEventListener("error", () =>
      reject(new Error("Failed to read file")),
    );
    reader.readAsDataURL(file);
  });
}
