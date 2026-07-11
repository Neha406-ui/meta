import * as pdfjsLib from 'pdfjs-dist';
import type { PdfMetadata } from '../types/metadata';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function extractPdfMetadata(file: File): Promise<PdfMetadata> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  const metadata = await pdf.getMetadata();
  const info = metadata.info as Record<string, any>;
  
  const pdfMetadata: PdfMetadata = {
    title: info.Title,
    author: info.Author,
    subject: info.Subject,
    creator: info.Creator,
    producer: info.Producer,
    pdfVersion: info.PDFFormatVersion,
    numPages: pdf.numPages,
  };
  
  if (info.CreationDate) {
    pdfMetadata.creationDate = new Date(info.CreationDate);
  }
  if (info.ModDate) {
    pdfMetadata.modificationDate = new Date(info.ModDate);
  }
  
  return pdfMetadata;
}
