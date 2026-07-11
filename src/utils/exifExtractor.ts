import EXIF from 'exif-js';
import type { CameraMetadata, ImageMetadata, GpsMetadata, ImageDimensions } from '../types/metadata';

function toDecimalDegrees(coords: [number, number, number], ref: string): number {
  const degrees = coords[0];
  const minutes = coords[1];
  const seconds = coords[2];
  
  let decimal = degrees + (minutes / 60) + (seconds / 3600);
  if (ref === 'S' || ref === 'W') {
    decimal = -decimal;
  }
  return decimal;
}

export async function extractExifMetadata(file: File): Promise<{ camera: CameraMetadata; image: ImageMetadata; gps: GpsMetadata }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        (EXIF as any).getData(img, () => {
          const make = (EXIF as any).getTag(img, 'Make');
          const model = (EXIF as any).getTag(img, 'Model');
          const software = (EXIF as any).getTag(img, 'Software');
          
          const dateTimeOriginal = (EXIF as any).getTag(img, 'DateTimeOriginal');
          const exposureTime = (EXIF as any).getTag(img, 'ExposureTime');
          const fNumber = (EXIF as any).getTag(img, 'FNumber');
          const isoSpeedRatings = (EXIF as any).getTag(img, 'ISOSpeedRatings');
          const focalLength = (EXIF as any).getTag(img, 'FocalLength');
          const flash = (EXIF as any).getTag(img, 'Flash');
          
          const gpsLatitude = (EXIF as any).getTag(img, 'GPSLatitude');
          const gpsLatitudeRef = (EXIF as any).getTag(img, 'GPSLatitudeRef');
          const gpsLongitude = (EXIF as any).getTag(img, 'GPSLongitude');
          const gpsLongitudeRef = (EXIF as any).getTag(img, 'GPSLongitudeRef');
          const gpsAltitude = (EXIF as any).getTag(img, 'GPSAltitude');
          
          const camera: CameraMetadata = {
            make,
            model,
            software,
          };
          
          const image: ImageMetadata = {};
          if (dateTimeOriginal) {
            image.dateTaken = new Date(dateTimeOriginal.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3'));
          }
          if (exposureTime) {
            image.exposureTime = `${exposureTime.numerator}/${exposureTime.denominator}`;
          }
          if (fNumber) {
            image.aperture = `f/${(fNumber.numerator / fNumber.denominator).toFixed(1)}`;
          }
          if (isoSpeedRatings) {
            image.iso = String(isoSpeedRatings);
          }
          if (focalLength) {
            image.focalLength = `${(focalLength.numerator / focalLength.denominator).toFixed(0)}mm`;
          }
          if (flash !== undefined) {
            image.flash = (flash & 1) ? 'Fired' : 'Did not fire';
          }
          
          const gps: GpsMetadata = {};
          if (gpsLatitude && gpsLatitudeRef && gpsLongitude && gpsLongitudeRef) {
            gps.latitude = toDecimalDegrees(gpsLatitude, gpsLatitudeRef);
            gps.longitude = toDecimalDegrees(gpsLongitude, gpsLongitudeRef);
          }
          if (gpsAltitude) {
            gps.altitude = gpsAltitude.numerator / gpsAltitude.denominator;
          }
          
          resolve({ camera, image, gps });
        });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const aspectRatio = (img.width / img.height).toFixed(2);
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}
