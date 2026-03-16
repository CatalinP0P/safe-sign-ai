'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    if (!file) return setStatus('Selectează un fișier mai întâi!');

    const formData = new FormData();
    formData.append('file', file);

    setStatus('Se încarcă...');

    try {
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setStatus(`Succes: ${data.filename}`);
    } catch (err) {
      console.log(err);
      setStatus('Eroare: Verifică dacă backend-ul rulează!');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center p-10 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-8">SafeSign AI</h1>

      <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-gray-400 rounded-xl bg-gray-50">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Încarcă Contractul
        </button>
      </div>

      <p className="mt-6 text-lg font-mono text-gray-700">{status}</p>
    </main>
  );
}
