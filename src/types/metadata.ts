export interface GeneralMetadata {
  fileName: string;
  fileSize: string;
  mimeType: string;
  lastModified: Date;
  creationDate?: Date;
}

export interface CameraMetadata {
  make?: string;
  model?: string;
  lens?: string;
  software?: string;
}

export interface ImageMetadata {
  dateTaken?: Date;
  exposureTime?: string;
  aperture?: string;
  iso?: string;
  focalLength?: string;
  flash?: string;
}

export interface GpsMetadata {
  latitude?: number;
  longitude?: number;
  altitude?: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: string;
}

export interface PdfMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  pdfVersion?: string;
  creationDate?: Date;
  modificationDate?: Date;
  numPages?: number;
}

export interface FileMetadata {
  general: GeneralMetadata;
  image?: ImageMetadata;
  camera?: CameraMetadata;
  gps?: GpsMetadata;
  dimensions?: ImageDimensions;
  pdf?: PdfMetadata;
}

export interface UploadedFile {
  id: string;
  file: File;
  metadata: FileMetadata | null;
  loading: boolean;
  error: string | null;
}
