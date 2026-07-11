export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getGeneralMetadata(file: File): { fileName: string; fileSize: string; mimeType: string; lastModified: Date } {
  return {
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    mimeType: file.type,
    lastModified: new Date(file.lastModified),
  };
}
