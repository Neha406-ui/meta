import { useState } from 'react';
import type { UploadedFile } from '../types/metadata';
import MetadataCard from './MetadataCard';

interface FilePreviewProps {
  uploadedFile: UploadedFile;
  onRemove: () => void;
}

export default function FilePreview({ uploadedFile, onRemove }: FilePreviewProps) {
  const [showJson, setShowJson] = useState(false);
  const { file, metadata, loading, error } = uploadedFile;

  const handleCopyJson = () => {
    if (metadata) {
      navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
    }
  };

  const handleExportJson = () => {
    if (metadata) {
      const dataStr = JSON.stringify(metadata, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileName = `${file.name}.metadata.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      linkElement.click();
    }
  };

  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isImage ? 'bg-blue-100 text-blue-600' : isPdf ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {isImage ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ) : isPdf ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-gray-900 truncate">{file.name}</h3>
              <p className="text-sm text-gray-500 truncate">{file.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {metadata && (
              <>
                <button
                  onClick={() => setShowJson(!showJson)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Toggle JSON view"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </button>
                <button
                  onClick={handleCopyJson}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy JSON to clipboard"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={handleExportJson}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Export JSON file"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
                  </svg>
                </button>
              </>
            )}
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <button
              onClick={onRemove}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove file"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="p-12 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Extracting metadata...</p>
        </div>
      )}

      {error && (
        <div className="p-12 text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {showJson && metadata && (
        <div className="border-t border-gray-100">
          <div className="p-4 bg-gray-900 text-gray-100 overflow-x-auto">
            <pre className="text-sm font-mono">{JSON.stringify(metadata, null, 2)}</pre>
          </div>
        </div>
      )}

      {metadata && !loading && !error && (
        <div className="p-5">
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <MetadataCard
              title="General"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="indigo"
              items={[
                { label: 'File Name', value: metadata.general.fileName },
                { label: 'File Size', value: metadata.general.fileSize },
                { label: 'MIME Type', value: metadata.general.mimeType },
                { label: 'Last Modified', value: metadata.general.lastModified?.toLocaleString() },
              ]}
            />

            {metadata.dimensions && (
              <MetadataCard
                title="Dimensions"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                }
                color="blue"
                items={[
                  { label: 'Width', value: `${metadata.dimensions.width}px` },
                  { label: 'Height', value: `${metadata.dimensions.height}px` },
                  { label: 'Aspect Ratio', value: metadata.dimensions.aspectRatio },
                ]}
              />
            )}

            {metadata.camera && (metadata.camera.make || metadata.camera.model) && (
              <MetadataCard
                title="Camera"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                color="purple"
                items={[
                  { label: 'Make', value: metadata.camera.make },
                  { label: 'Model', value: metadata.camera.model },
                  { label: 'Software', value: metadata.camera.software },
                ]}
              />
            )}

            {metadata.image && (metadata.image.dateTaken || metadata.image.exposureTime) && (
              <MetadataCard
                title="Image"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                color="green"
                items={[
                  { label: 'Date Taken', value: metadata.image.dateTaken?.toLocaleString() },
                  { label: 'Exposure', value: metadata.image.exposureTime },
                  { label: 'Aperture', value: metadata.image.aperture },
                  { label: 'ISO', value: metadata.image.iso },
                  { label: 'Focal Length', value: metadata.image.focalLength },
                  { label: 'Flash', value: metadata.image.flash },
                ]}
              />
            )}

            {metadata.gps && metadata.gps.latitude && metadata.gps.longitude && (
              <MetadataCard
                title="GPS"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                color="red"
                items={[
                  { label: 'Latitude', value: metadata.gps.latitude.toFixed(6) },
                  { label: 'Longitude', value: metadata.gps.longitude.toFixed(6) },
                  {
                    label: 'Map',
                    value: (
                      <a
                        href={`https://www.google.com/maps?q=${metadata.gps.latitude},${metadata.gps.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-700 font-medium inline-flex items-center"
                      >
                        View on Google Maps
                        <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ),
                  },
                ]}
              />
            )}

            {metadata.pdf && (
              <MetadataCard
                title="PDF"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                color="red"
                items={[
                  { label: 'Title', value: metadata.pdf.title },
                  { label: 'Author', value: metadata.pdf.author },
                  { label: 'Subject', value: metadata.pdf.subject },
                  { label: 'Creator', value: metadata.pdf.creator },
                  { label: 'Producer', value: metadata.pdf.producer },
                  { label: 'PDF Version', value: metadata.pdf.pdfVersion },
                  { label: 'Created', value: metadata.pdf.creationDate?.toLocaleString() },
                  { label: 'Modified', value: metadata.pdf.modificationDate?.toLocaleString() },
                  { label: 'Pages', value: metadata.pdf.numPages },
                ]}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
