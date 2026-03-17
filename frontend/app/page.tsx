'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Document } from './types/document';

export default function Home() {
  const [files, setFiles] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchFiles = async () => {
    try {
      const res = await fetch('http://localhost:8000/files');
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error('Error loading files:', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchFiles();
        alert('File uploaded successfully!');
      } else {
        alert('Upload error.');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  return (
    <main className="flex h-screen bg-gray-50 text-gray-800">
      <aside className="w-64 bg-white border-r flex flex-col p-6">
        <h1 className="text-xl font-bold mb-10 text-blue-900 italic">
          SafeSign AI
        </h1>
        <nav className="space-y-6">
          {['Dashboard', 'Documents', 'Settings', 'Log out'].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      <section className="flex-1 p-10 overflow-y-auto">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search..."
            className="w-96 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-white mb-10 transition-all hover:border-blue-400">
          <div className="mb-4 text-4xl">📁</div>
          <p className="mb-4 text-gray-600">
            {loading
              ? 'Loading...'
              : 'Upload a new document (PDF, DOCX). Drag and drop or choose manually.'}
          </p>

          <label className="bg-blue-950 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-900 transition-colors inline-block">
            {loading ? 'Waiting...' : 'Choose file'}
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              accept=".pdf,.docx"
              disabled={loading}
            />
          </label>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-400 text-sm">
                <th className="pb-4 font-medium uppercase">Document Name</th>
                <th className="pb-4 font-medium uppercase">Date</th>
                <th className="pb-4 font-medium uppercase text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 ? (
                files.map((file) => (
                  <tr
                    key={file.id}
                    onClick={() => router.push(`/documents/${file.id}`)}
                    className="border-b last:border-0 hover:bg-blue-50 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 font-medium group-hover:text-blue-700">
                      <div className="flex items-center gap-2">
                        {file.filename}
                      </div>
                    </td>
                    <td className="py-4 text-gray-500">
                      {file.created_at 
                        ? new Date(file.created_at).toLocaleDateString('ro-RO')
                        : new Date().toLocaleDateString('ro-RO')}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        file.status === 'uploaded' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {file.status || 'Uploaded'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-gray-400">
                    No documents found. Upload your first file!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}