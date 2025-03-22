import {
  BlendMode,
  ImageFormat,
  type InputColorMatrix,
  Skia,
  type SkImage,
  type SkPaint,
  type SkSurface,
  TileMode,
} from '@shopify/react-native-skia';
import { createWorkletRuntime, runOnJS, runOnRuntime } from 'react-native-reanimated';

export interface IImportOptimization {
  optimize: (image: string) => Promise<string>;
}

function fromBase64(data: string): SkImage {
  'worklet';
  return Skia.Image.MakeImageFromEncoded(Skia.Data.fromBase64(data))!;
}

function downscaleImage(image: SkImage, maxSize: number): [width: number, height: number] {
  'worklet';
  let width = image.width();
  let height = image.height();

  if (width > maxSize) {
    height = Math.floor((height * maxSize) / width);
    width = maxSize;
  }

  if (height > maxSize) {
    width = Math.floor((width * maxSize) / height);
    height = maxSize;
  }

  return [width, height];
}

function makeSurface(image: SkImage): SkSurface {
  'worklet';
  const [width, height] = downscaleImage(image, 2000);
  const surface = Skia.Surface.Make(width, height)!;

  surface.getCanvas().drawImageRect(
    image,
    Skia.XYWHRect(0, 0, image.width(), image.height()),
    Skia.XYWHRect(0, 0, width, height),
    Skia.Paint(),
    true,
  );

  return surface;
}

function applyPaint(surface: SkSurface, transform: (paint: SkPaint) => void) {
  'worklet';
  const paint = Skia.Paint();
  transform(paint);
  const canvas = surface.getCanvas();
  const image = surface.makeImageSnapshot();
  canvas.drawImage(image, 0, 0, paint);
  paint.dispose();
}

function applyColorMatrix(surface: SkSurface, matrix: InputColorMatrix): void {
  'worklet';
  applyPaint(surface, (paint) => paint.setColorFilter(Skia.ColorFilter.MakeMatrix(matrix)));
}

function calculateAverageBrightness(image: SkImage) {
  'worklet';
  const sampleSize = 10;
  const scaledWidth = Math.max(Math.floor(image.width() / sampleSize), 1);
  const scaledHeight = Math.max(Math.floor(image.height() / sampleSize), 1);

  const surface = Skia.Surface.Make(scaledWidth, scaledHeight);
  if (!surface) return 128;

  const canvas = surface.getCanvas();

  canvas.drawImageRect(
    image,
    Skia.XYWHRect(0, 0, image.width(), image.height()),
    Skia.XYWHRect(0, 0, scaledWidth, scaledHeight),
    Skia.Paint(),
  );

  const snapshot = surface.makeImageSnapshot();
  const pixels = snapshot.readPixels(0, 0, snapshot.getImageInfo())!;

  let totalBrightness = 0;
  let pixelCount = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    totalBrightness += brightness;
    pixelCount++;
  }

  return totalBrightness / pixelCount;
}

function calculateDynamicContrastMatrix(avgBrightness: number) {
  'worklet';
  const normalizedBrightness = avgBrightness / 255;

  // Calculate contrast level based on brightness
  // We want higher contrast for middle brightness
  // and lower contrast for extreme brightness (very dark or very light)
  let contrastLevel;
  if (normalizedBrightness < 0.5) {
    // For darker images: gradually increase contrast as we move from black to mid-gray
    contrastLevel = 1.0 + (normalizedBrightness * 0.6); // Range: 1.0 to 1.3
  } else {
    // For lighter images: gradually decrease contrast as we move from mid-gray to white
    contrastLevel = 1.3 - ((normalizedBrightness - 0.5) * 0.5); // Range: 1.3 to 1.05
  }

  // Calculate brightness adjustment (offset)
  // For dark images: add brightness
  // For light images: reduce brightness
  // For mid-gray: minimal adjustment
  let brightnessAdjustment;
  if (normalizedBrightness < 0.3) {
    // For very dark images: add brightness
    brightnessAdjustment = 20 * (0.3 - normalizedBrightness); // Up to +20
  } else if (normalizedBrightness > 0.7) {
    // For very light images: reduce brightness
    brightnessAdjustment = -15 * (normalizedBrightness - 0.7); // Up to -15
  } else {
    // For mid-range images: minimal adjustment
    brightnessAdjustment = 0;
  }

  // Create the contrast matrix with calculated values
  return [
    contrastLevel, 0, 0, 0, brightnessAdjustment,
    0, contrastLevel, 0, 0, brightnessAdjustment,
    0, 0, contrastLevel, 0, brightnessAdjustment,
    0, 0, 0, 1, 0,
  ];
}

function optimize(source: string): string {
  'worklet';
  let image = fromBase64(source);
  source = '';
  const surface = makeSurface(image);

  const originalAverageBrightness = calculateAverageBrightness(image);
  applyColorMatrix(surface, calculateDynamicContrastMatrix(originalAverageBrightness));

  applyColorMatrix(surface, [
    0.2126, 0.7152, 0.0722, 0, 0,
    0.2126, 0.7152, 0.0722, 0, 0,
    0.2126, 0.7152, 0.0722, 0, 0,
    0, 0, 0, 1, 0,
  ]);

  applyPaint(surface, (paint) => {
    paint.setImageFilter(Skia.ImageFilter.MakeBlur(0.5, 0.5, TileMode.Clamp, null));
    paint.setBlendMode(BlendMode.Overlay);
  });

  image.dispose();
  image = surface.makeImageSnapshot();

  source = image.encodeToBase64(ImageFormat.JPEG);
  image.dispose();
  surface.dispose();
  return source;
}

const runtime = createWorkletRuntime('import-photo-optimization');

export function useImportOptimization(): IImportOptimization {
  function optimize_(source: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      runOnRuntime(runtime, (source: string) => {
        'worklet';
        try {
          const result = optimize(source);
          runOnJS(resolve)(result);
        } catch (error) {
          runOnJS(reject)(error);
        }
      })(source);
    });
  }

  return { optimize: optimize_ };
}
