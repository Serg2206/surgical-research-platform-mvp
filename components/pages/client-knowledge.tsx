'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { marked } from 'marked';
import mermaid from 'mermaid';
import lunr from 'lunr';

const BASE_DOCS = [
  { title: 'Введение', path: '/knowledge/data/intro.md' },
  { title: 'Острый аппендицит', path: '/knowledge/data/diseases/acute_appendicitis.md' },
  { title: 'Алгоритм лечения', path: '/knowledge/data/algorithms/appendicitis_flow.md' },
];

const COURSE_BASE = '/knowledge/data/courses/abdominal-emergency-2026';

const COURSE_MODULES = [
  {
    title: 'Модуль 1. Фундамент и система принятия решений',
    indexPath: `${COURSE_BASE}/module-1/index.md`,
    lectures: [
      { title: '1.1 Острый живот 2026: от семиотики к алгоритму', path: `${COURSE_BASE}/module-1/lecture-1-1.md` },
      { title: '1.2 Damage Control Surgery: философия и физиология', path: `${COURSE_BASE}/module-1/lecture-1-2.md` },
      { title: '1.3 Лапароскопия в экстренной хирургии', path: `${COURSE_BASE}/module-1/lecture-1-3.md` },
      { title: '1.4 AI и клиническое мышление хирурга', path: `${COURSE_BASE}/module-1/lecture-1-4.md` },
    ],
  },
  {
    title: 'Модуль 2. Перитонит и интраабдоминальный сепсис',
    indexPath: `${COURSE_BASE}/module-2/index.md`,
    lectures: [
      { title: '2.1 Классификация и стратификация перитонита', path: `${COURSE_BASE}/module-2/lecture-2-1.md` },
      { title: '2.2 Хирургическая тактика: source control', path: `${COURSE_BASE}/module-2/lecture-2-2.md` },
      { title: '2.3 Антибиотикотерапия и антибиотикорезистентность', path: `${COURSE_BASE}/module-2/lecture-2-3.md` },
      { title: '2.4 Третичный перитонит и абдоминальный сепсис в ОРИТ', path: `${COURSE_BASE}/module-2/lecture-2-4.md` },
    ],
  },
];

const DOCS = [
  ...BASE_DOCS,
  ...COURSE_MODULES.flatMap(m => [{ title: `${m.title} — обзор`, path: m.indexPath }, ...m.lectures]),
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

  const navButtonClass = (path: string) =>
    `block w-full text-left px-3 py-2 rounded-lg text-sm ${
      selectedPath === path ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
    }`;

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
        <nav className="w-72 border-r bg-white/60 p-4 space-y-1 overflow-y-auto">
          {BASE_DOCS.map(doc => (
            <button key={doc.path} onClick={() => setSelectedPath(doc.path)} className={navButtonClass(doc.path)}>
              {doc.title}
            </button>
          ))}

          {COURSE_MODULES.length > 0 && (
            <div className="pt-3 mt-3 border-t">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Курс «Абдоминальная неотложная хирургия — 2026»
              </p>
              {COURSE_MODULES.map(module => {
                const isActiveModule =
                  selectedPath === module.indexPath || module.lectures.some(l => l.path === selectedPath);
                return (
                  <details key={module.indexPath} open={isActiveModule} className="group">
                    <summary className="cursor-pointer select-none list-none px-3 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-100 flex items-center justify-between">
                      <span
                        className="truncate"
                        role="button"
                        tabIndex={0}
                        onClick={e => {
                          e.preventDefault();
                          setSelectedPath(module.indexPath);
                        }}
                      >
                        {module.title}
                      </span>
                      <span className="text-gray-400 transition-transform group-open:rotate-90">›</span>
                    </summary>
                    <div className="pl-3 space-y-1 pb-1">
                      {module.lectures.map(lecture => (
                        <button
                          key={lecture.path}
                          onClick={() => setSelectedPath(lecture.path)}
                          className={navButtonClass(lecture.path)}
                        >
                          {lecture.title}
                        </button>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          )}
        </nav>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div ref={contentRef} />
        </main>
      </div>
    </div>
  );
}
