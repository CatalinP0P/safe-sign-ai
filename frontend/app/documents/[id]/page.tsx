'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Document } from '../../types/document';

export default function DocumentDetail() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const res = await fetch(`http://localhost:8000/files/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setDocument(data);
        }
      } catch (err) {
        console.error('Error fetching document:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDocumentDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  const pdfUrl = document?.file_path 
  ? `http://localhost:8000/static/${encodeURIComponent(document.file_path.replace('uploads/', ''))}`
  : null;

  return (
    <main className="flex flex-col h-screen bg-gray-50 text-gray-800">
      <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-blue-900">
            {document?.filename || 'Document Analysis'}
          </h1>
        </div>
        <div className="flex gap-3">
          <a 
            href={pdfUrl || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50"
          >
            Open in New Tab
          </a>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase flex items-center">
            {document?.status}
          </span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden p-6 gap-6">

        <section className="flex-2 bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
          <div className="bg-gray-100 p-2 border-b flex justify-between items-center text-xs font-medium text-gray-500">
            <span>PREVIEW</span>
            <span>{document?.filename}</span>
          </div>
          <div className="flex-1 bg-gray-200">
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=1&view=FitH`}
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 italic">
                PDF file could not be loaded.
              </div>
            )}
          </div>
        </section>

        <section className="flex-1 flex flex-col gap-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Summary</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Analysis for <strong>{document?.filename}</strong> will be displayed here.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Details</h2>
            <div className="text-xs space-y-2 text-gray-500">
              <p>Uploaded: {document?.created_at ? new Date(document.created_at).toLocaleString() : 'N/A'}</p>
              <p>File Path: {document?.file_path}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}