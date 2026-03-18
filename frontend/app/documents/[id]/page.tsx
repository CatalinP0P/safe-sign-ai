'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Document } from '../../types/document';
import remarkGfm from 'remark-gfm';

export default function DocumentDetail() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const res = await fetch(`http://localhost:8000/files/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setDocument(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDocumentDetails();
    }
  }, [params.id]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`http://localhost:8000/files/${params.id}/analyze`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setDocument(prev => prev ? { ...prev, summary: data.summary, status: 'ANALYZED' } : null);
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50/50">
        <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  const pdfUrl = document?.file_path 
  ? `http://localhost:8000/static/${encodeURIComponent(document.file_path.replace('uploads/', ''))}`
  : null;

  return (
    <main className="flex flex-col h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      {/* Header - Înălțime fixă */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-500 hover:text-slate-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <h1 className="text-sm font-semibold text-slate-700 truncate max-w-75">
            {document?.filename}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || document?.status === 'ANALYZED'}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              isAnalyzing 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : document?.status === 'ANALYZED'
                ? 'bg-emerald-50 text-emerald-600 cursor-default border border-emerald-100'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200'
            }`}
          >
            {isAnalyzing ? (
               <><div className="h-3 w-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /> Analyzing...</>
            ) : document?.status === 'ANALYZED' ? (
               <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Analysis Complete</>
            ) : 'Run AI Analysis'}
          </button>
          
          <a 
            href={pdfUrl || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm"
          >
            Open Original PDF
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        
        {/* Left: PDF Viewer (Fixat la înălțimea ecranului) */}
        <section className="flex-3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-w-0">
          <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Preview</span>
          </div>
          <div className="flex-1 bg-slate-100 relative">
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 italic text-sm">
                PDF content could not be displayed.
              </div>
            )}
          </div>
        </section>

        {/* Right: AI Insights (Independent Scrolling) */}
        <section className="flex-2 flex flex-col min-w-0 h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            
            {/* Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col transition-all">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-2 w-2 bg-blue-500 rounded-full" />
                  AI Summary Report
                </h2>
                {document?.status === 'ANALYZED' && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">GENERATED BY AI</span>
                )}
              </div>
              
              <div className="p-6">
                {document?.summary ? (
                  <div className="prose prose-slate max-w-none 
                    prose-headings:text-slate-900 prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4
                    prose-li:text-slate-600 prose-li:marker:text-blue-500 prose-li:list-disc pl-2
                    prose-strong:text-slate-900 prose-strong:font-bold">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{document.summary}</ReactMarkdown>
                  </div>
                ) : isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                    <div className="h-10 w-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Gemini is processing...</p>
                      <p className="text-xs text-slate-400 mt-1">Extracting and analyzing document content</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-24 text-center flex flex-col items-center gap-4">
                    <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-400 max-w-55 leading-relaxed">
                      No analysis found. Click the button above to generate an AI summary for this document.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Metadata Card */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5">System Properties</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Upload Date</span>
                  <span className="text-xs text-slate-200">{document?.created_at ? new Date(document.created_at).toLocaleString('ro-RO') : 'N/A'}</span>
                </div>
                <div className="h-px bg-slate-800" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Document ID</span>
                  <span className="text-xs font-mono text-blue-400">#{document?.id}</span>
                </div>
                <div className="h-px bg-slate-800" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Status</span>
                  <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-emerald-400 border border-emerald-400/20 uppercase">
                    {document?.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Mic spațiu la final pentru scroll curat */}
            <div className="h-4 shrink-0" />
          </div>
        </section>
      </div>
    </main>
  );
}