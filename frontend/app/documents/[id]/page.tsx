'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Document } from '../../types/document';
import remarkGfm from 'remark-gfm';

type TabType = 'summary' | 'chat' | 'details';

export default function DocumentDetail() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Tab Management
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  // Edit Name State
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  // Chat State
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const res = await fetch(`http://localhost:8000/files/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setDocument(data);
          setNewName(data.filename);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchDocumentDetails();
  }, [params.id]);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, activeTab]);

  const handleUpdateName = async () => {
    try {
      const res = await fetch(`http://localhost:8000/files/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: newName }),
      });
      if (res.ok) {
        setDocument(prev => prev ? { ...prev, filename: newName } : null);
        setIsEditingName(false);
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure?")) {
      try {
        const res = await fetch(`http://localhost:8000/files/${params.id}`, { method: 'DELETE' });
        if (res.ok) router.push('/documents');
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`http://localhost:8000/files/${params.id}/analyze`, { method: 'POST' });
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

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAsking) return;

    const userMsg = { role: 'user', content: question };
    setChatHistory(prev => [...prev, userMsg]);
    setQuestion('');
    setIsAsking(true);

    try {
      const res = await fetch(`http://localhost:8000/files/${params.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg.content }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [...prev, { role: 'ai', content: data.answer }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsAsking(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  const pdfUrl = document?.file_path 
    ? `http://localhost:8000/static/${encodeURIComponent(document.file_path.replace('uploads/', ''))}`
    : null;

  return (
    <main className="flex flex-col h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} className="text-sm font-semibold text-slate-700 border-b border-blue-500 focus:outline-none bg-blue-50/50 px-1" autoFocus />
              <button onClick={handleUpdateName} className="text-xs text-emerald-600 font-bold">Save</button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 className="text-sm font-semibold text-slate-700 truncate">{document?.filename}</h1>
              <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-red-600 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </button>
          <button onClick={handleAnalyze} disabled={isAnalyzing || document?.status === 'ANALYZED'} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${isAnalyzing ? 'bg-slate-100 text-slate-400' : document?.status === 'ANALYZED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
            {isAnalyzing ? 'Analyzing...' : document?.status === 'ANALYZED' ? 'Analyzed' : 'Run AI Analysis'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* PDF Viewer */}
        <section className="flex-3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="flex-1 bg-slate-100">{pdfUrl && <iframe src={`${pdfUrl}#view=FitH`} className="w-full h-full border-none" title="PDF" />}</div>
        </section>

        {/* Tabbed Right Panel */}
        <section className="flex-2 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            {(['summary', 'chat', 'details'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'text-blue-600 bg-white border-b-2 border-blue-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col relative">
            
            {/* SUMMARY TAB */}
            {activeTab === 'summary' && (
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                {document?.summary ? (
                  <div className="prose prose-slate max-w-none prose-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{document.summary}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 italic text-sm">
                    No summary available. Run AI analysis first.
                  </div>
                )}
              </div>
            )}

            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                  {chatHistory.length === 0 && (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs text-center px-10">
                      Ask specific questions about clauses, dates, or parties in this document.
                    </div>
                  )}
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200 shadow-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isAsking && <div className="text-[10px] text-blue-500 font-bold animate-pulse">AI is typing...</div>}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleAskQuestion} className="p-4 border-t border-slate-100 bg-slate-50">
                  <div className="relative">
                    <input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask document..."
                      disabled={!document?.summary || isAsking}
                      className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <button type="submit" disabled={!question.trim() || isAsking} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 disabled:text-slate-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* DETAILS TAB (PROPERTIES) */}
            {activeTab === 'details' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Upload Date</label>
                  <p className="text-sm text-slate-700 font-medium">{document?.created_at ? new Date(document.created_at).toLocaleString('ro-RO') : 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${document?.status === 'ANALYZED' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    {document?.status}
                  </span>
                </div>
              </div>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}