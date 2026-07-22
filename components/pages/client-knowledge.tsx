'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { marked } from 'marked';
import mermaid from 'mermaid';
import lunr from 'lunr';

const DOCS = [
  { title: 'Введение', path: '/knowledge/data/intro.md' },
  { title: 'Острый аппендицит', path: '/knowledge/data/diseases/acute_appendicitis.md' },
  { title: 'Алгоритм лечения', path: '/knowledge/data/algorithms/appendicitis_flow.md' },
];

export default function ClientKnowledge() {
  const contentRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef<any>(null);
  const [query, setQuery] = useState('');
  const [selectedPath, setSelectedPath] = useState<string>(DOCS[0].path);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
  }, []);

  const renderDoc = useCallback(async (mdPath: string) => {
    const res = await fetch(mdPath);
    if (!res.ok) throw new Error(`404: ${mdPath}`);
    const md = await res.text();
    if (!contentRef.current) return;
    contentRef.current.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'prose prose-invert max-w-none';
    wrapper.innerHTML = marked.parse(md) as string;
    contentRef.current.appendChild(wrapper);
    await mermaid.run({ querySelector: '.mermaid' });
  }, []);

  useEffect(() => {
    renderDoc(selectedPath).catch(console.error);
  }, [selectedPath, renderDoc]);

  useEffect(() => {
    fetch('/knowledge/data/search-index.json')
      .then(r => r.json())
      .then((data: any) => {
        idxRef.current = lunr(function () {
          this.ref('path');
          this.field('title');
          this.field('body');
          data.docs.forEach((d: any) => this.add(d));
        });
      })
      .catch(console.error);
  }, []);

  const onSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.trim();
    setQuery(q);
    if (!q || !idxRef.current) return;
    const res = idxRef.current.search(q);
    if (res.length) {
      const hit = DOCS.find(d => d.path === res[0].ref);
      if (hit) setSelectedPath(hit.path);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-900">База знаний: Неотложная абдоминальная хирургия</h1>
          <input
            type="text"
            value={query}
            onChange={onSearch}
            placeholder="Поиск по базе…"
            className="w-80 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 flex">
        <nav className="w-64 border-r bg-white/60 p-4 space-y-2">
          {DOCS.map(doc => (
            <button
              key={doc.path}
              onClick={() => setSelectedPath(doc.path)}
              className={`block w-full text-left px-3 py-2 rounded-lg ${
                selectedPath === doc.path ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {doc.title}
            </button>
          ))}
        </nav>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div ref={contentRef} />
        </main>
      </div>
    </div>
  );
}
