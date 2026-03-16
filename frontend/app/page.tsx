'use client';
import { useState } from 'react';

export default function Home() {
  return (
    <main className="flex h-screen bg-gray-50 text-gray-800">
      <aside className="w-64 bg-white border-r flex flex-col p-6">
        <h1 className="text-xl font-bold mb-10 text-blue-900">SafeSign AI</h1>
        <nav className="space-y-6">
          {['Dashboard', 'Documente', 'Setari', 'Log out'].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              <span>📄</span> {item}
            </div>
          ))}
        </nav>
      </aside>

      <section className="flex-1 p-10">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search..."
            className="w-96 p-3 border rounded-lg"
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-white mb-10">
          <div className="mb-4 text-4xl">📁</div>
          <p className="mb-4">
            Incarca un document nou (PDF, DOCX). Trage si plaseaza sau alege
            manual.
          </p>
          <button className="bg-blue-950 text-white px-6 py-2 rounded-lg">
            Alege fisier
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="pb-4">Name Document</th>
                <th className="pb-4">Data</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {['Contract Prestari', 'Ciorna', 'Proces Verbal'].map(
                (doc, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-4">{doc}</td>
                    <td className="py-4">16.03.2026</td>
                    <td className="py-4">
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
                        Analizat
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
