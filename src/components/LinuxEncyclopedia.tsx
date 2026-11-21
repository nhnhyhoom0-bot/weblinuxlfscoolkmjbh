import React, { useState } from 'react';
import { ENCYCLOPEDIA_CHAPTERS } from '../data/linuxEncyclopedia';

export const LinuxEncyclopedia: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useState(ENCYCLOPEDIA_CHAPTERS[0].id);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const chapter =
    ENCYCLOPEDIA_CHAPTERS.find((c) => c.id === activeChapterId) ?? ENCYCLOPEDIA_CHAPTERS[0];

  return (
    <section aria-label="موسوعة نظام لينكس الشاملة" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-stone-200 pb-6 dark:border-slate-800">
        <p className="text-xs font-semibold tracking-wide text-stone-500 dark:text-slate-400">
          الموسوعة التقنية الكاملة · 6 فصول مرجعية
        </p>
        <h2 className="font-display mt-2 text-balance text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-slate-50">
          كل ما تحتاج معرفته عن نظام لينكس من النواة إلى التثبيت
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Chapter Rail */}
        <aside className="lg:col-span-4">
          <nav aria-label="فصول الموسوعة" className="sticky top-24 space-y-1.5">
            {ENCYCLOPEDIA_CHAPTERS.map((ch) => {
              const active = ch.id === chapter.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setActiveChapterId(ch.id)}
                  aria-current={active ? 'step' : undefined}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-right transition-colors ${
                    active
                      ? 'border-blue-700 bg-white text-stone-900 dark:border-blue-500 dark:bg-[#141922] dark:text-slate-50'
                      : 'border-stone-200/80 bg-transparent text-stone-600 hover:bg-white/70 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-bold tabular-nums ${
                      active ? 'text-blue-700 dark:text-blue-400' : 'text-stone-400 dark:text-slate-500'
                    }`}
                  >
                    {ch.index}.
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-sm font-bold">{ch.title}</div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-stone-500 dark:text-slate-400">
                      {ch.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Reading Canvas */}
        <article className="lg:col-span-8">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-10 dark:border-slate-800 dark:bg-[#141922]">
            <p className="font-mono text-xs font-semibold tabular-nums text-blue-700 dark:text-blue-400">
              الفصل {chapter.index}
            </p>
            <h3 className="font-display mt-2 text-balance text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-slate-50">
              {chapter.title}
            </h3>
            <p className="mt-2 text-sm text-stone-500 dark:text-slate-400">{chapter.subtitle}</p>

            <div className="mt-6 border-y border-stone-200 py-4 text-base leading-relaxed text-stone-700 dark:border-slate-800 dark:text-slate-300">
              {chapter.summary}
            </div>

            {chapter.image && (
              <figure className="mt-6 overflow-hidden rounded-xl border border-stone-200 bg-stone-100 dark:border-slate-800 dark:bg-slate-900">
                {!imgErrors[chapter.id] ? (
                  <img
                    src={chapter.image}
                    alt={chapter.imageCaption ?? chapter.title}
                    referrerPolicy="no-referrer"
                    onError={() => setImgErrors((prev) => ({ ...prev, [chapter.id]: true }))}
                    className="h-64 w-full object-cover sm:h-80"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-slate-900 text-sm text-slate-300">
                    {chapter.title}
                  </div>
                )}
                {chapter.imageCaption && (
                  <figcaption className="border-t border-stone-200 bg-stone-50 px-4 py-2.5 text-xs text-stone-600 dark:border-slate-800 dark:bg-[#0E1116] dark:text-slate-400">
                    {chapter.imageCaption}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="mt-8 space-y-8">
              {chapter.sections.map((sec, idx) => (
                <section key={idx} className="space-y-3">
                  <h4 className="font-display text-xl font-bold text-stone-900 dark:text-slate-100">
                    {sec.heading}
                  </h4>
                  <p className="max-w-3xl text-sm leading-loose text-stone-700 sm:text-base dark:text-slate-300">
                    {sec.body}
                  </p>

                  {sec.points && (
                    <ul className="mt-3 space-y-2.5 text-sm text-stone-700 dark:text-slate-300">
                      {sec.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5">
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700 dark:bg-blue-400"
                            aria-hidden="true"
                          />
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.table && (
                    <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200 dark:border-slate-800">
                      <table className="w-full min-w-[540px] border-collapse text-right text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                            {sec.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="px-4 py-3 font-semibold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                          {sec.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-stone-50/60 dark:hover:bg-slate-800/30">
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`px-4 py-3 ${
                                    cIdx === 0
                                      ? 'font-semibold text-stone-900 dark:text-slate-100'
                                      : 'text-stone-700 dark:text-slate-300'
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
