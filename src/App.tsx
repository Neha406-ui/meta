import { useState, useCallback } from 'react';
import FileUploader from './components/FileUploader';
import FilePreview from './components/FilePreview';
import type { UploadedFile, FileMetadata } from './types/metadata';
import { getGeneralMetadata } from './utils/fileMetadata';
import { extractExifMetadata, getImageDimensions } from './utils/exifExtractor';
import { extractPdfMetadata } from './utils/pdfExtractor';

function App() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const processFile = useCallback(async (file: File): Promise<FileMetadata> => {
    const general = getGeneralMetadata(file);
    const metadata: FileMetadata = { general };

    if (file.type.startsWith('image/')) {
      const [exif, dimensions] = await Promise.all([
        extractExifMetadata(file).catch(() => ({ camera: {}, image: {}, gps: {} })),
        getImageDimensions(file),
      ]);
      metadata.camera = exif.camera;
      metadata.image = exif.image;
      metadata.gps = exif.gps;
      metadata.dimensions = dimensions;
    }

    if (file.type === 'application/pdf') {
      const pdfMetadata = await extractPdfMetadata(file);
      metadata.pdf = pdfMetadata;
    }

    return metadata;
  }, []);

  const handleFilesSelected = useCallback(
    (selectedFiles: File[]) => {
      const newFiles: UploadedFile[] = selectedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        metadata: null,
        loading: true,
        error: null,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach(async (uploadedFile) => {
        try {
          const metadata = await processFile(uploadedFile.file);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id ? { ...f, metadata, loading: false } : f
            )
          );
        } catch (err) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? { ...f, error: (err as Error).message, loading: false }
                : f
            )
          );
        }
      });
    },
    [processFile]
  );

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">Metadata Explorer</h1>
                <p className="text-sm text-gray-500">Local file metadata inspector</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                <svg className="w-3.5 h-3.5 mr-1.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Files stay local
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="mb-10">
          <FileUploader onFilesSelected={handleFilesSelected} />
        </section>

        <section>
          {files.length > 0 ? (
            <div className="space-y-6">
              {files.map((file) => (
                <FilePreview
                  key={file.id}
                  uploadedFile={file}
                  onRemove={() => handleRemoveFile(file.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No files uploaded yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Upload an image or PDF above to inspect its metadata — everything runs locally in your browser.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
