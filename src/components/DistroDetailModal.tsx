import React, { useEffect, useState } from 'react';
import { BookOpen, Check, Copy, Download, ExternalLink, GitCompareArrows, Globe, X } from 'lucide-react';
import type { Distro } from '../types/linux';
import { DistroEmblem, DistroPreviewMedia } from './DistroVisual';

interface DistroDetailModalProps {
  distro: Distro | null;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  onClose: () => void;
}

export const DistroDetailModal: React.FC<DistroDetailModalProps> = ({
  distro,
  isCompared,
  onToggleCompare,
  onClose,
}) => {
  const [copiedField, setCopiedField] = useState<'install' | 'update' | null>(null);

  useEffect(() => {
    if (!distro) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [distro, onClose]);

  if (!distro) return null;

  const copyText = async (text: string, field: 'install' | 'update') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    } catch {
      // Fallback ignored gracefully
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="distro-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-stone-200 bg-[#FAF9F6] shadow-2xl dark:border-slate-700 dark:bg-[#0E1116]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Visual Preview */}
        <div className="relative">
          <DistroPreviewMedia distro={distro} variant="hero" />
          <button
            type="button"
            onClick={onClose}
            aria-label={`إغلاق نافذة ${distro.name}`}
            className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white transition-colors hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Title & Actions */}
          <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-start dark:border-slate-800">
            <div className="flex items-start gap-4">
              <DistroEmblem distro={distro} size="lg" />
              <div>
                <p className="text-xs font-medium text-stone-500 dark:text-slate-400">
                  الترتيب <span dir="ltr" className="tabular-nums">#{distro.rank}</span> · {distro.family} · {distro.category} · تأسست {distro.yearFounded}
                </p>
                <h2
                  id="distro-modal-title"
                  className="font-display mt-1 text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-slate-50"
                >
                  {distro.name}
                </h2>
                <p className="mt-1 text-sm text-stone-600 dark:text-slate-300">{distro.tagline}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleCompare(distro.id)}
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2 text-xs font-semibold transition-colors ${
                isCompared
                  ? 'border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              {isCompared ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
              <span>{isCompared ? 'مضافة للمقارنة' : 'أضف للمقارنة'}</span>
            </button>
          </div>

          {/* Official Links Row */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={distro.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <Download className="h-4 w-4" />
              <span>صفحة التحميل والتثبيت المباشر</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </a>

            <a
              href={distro.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Globe className="h-4 w-4" />
              <span>الموقع الرسمي</span>
            </a>

            <a
              href={distro.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <BookOpen className="h-4 w-4" />
              <span>التوثيق والويكي</span>
            </a>
          </div>

          {/* Full Explanation & Highlights */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div>
                <h3 className="font-display text-lg font-bold text-stone-900 dark:text-slate-100">
                  شرح التوزيعة وهويتها التقنية
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-slate-300">
                  {distro.description}
                </p>
              </div>

              <div>
                <h4 className="font-display text-base font-bold text-stone-900 dark:text-slate-100">
                  أبرز المميزات والخصائص
                </h4>
                <ul className="mt-2 space-y-2 text-sm text-stone-700 dark:text-slate-300">
                  {distro.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-700 dark:bg-blue-400" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-display text-base font-bold text-stone-900 dark:text-slate-100">
                  لمن تناسب هذه التوزيعة؟
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-700 dark:text-slate-300">
                  {distro.idealFor}
                </p>
              </div>
            </div>

            {/* Accession Metadata Table */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-slate-800 dark:bg-[#141922]">
                <h3 className="font-display text-base font-bold text-stone-900 dark:text-slate-100">
                  البطاقة التقنية والمتطلبات
                </h3>
                <dl className="mt-4 divide-y divide-stone-100 text-xs dark:divide-slate-800">
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-stone-500 dark:text-slate-400">مبنية على</dt>
                    <dd className="font-medium text-stone-900 dark:text-slate-100">{distro.basedOn}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-stone-500 dark:text-slate-400">الواجهات المدعومة</dt>
                    <dd className="text-left font-medium text-stone-900 dark:text-slate-100">
                      {distro.desktopEnvironments.join('، ')}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-stone-500 dark:text-slate-400">مدير الحزم</dt>
                    <dd className="font-mono font-medium text-stone-900 dark:text-slate-100">
                      {distro.packageManager}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-stone-500 dark:text-slate-400">نظام التمهيد</dt>
                    <dd className="font-mono font-medium text-stone-900 dark:text-slate-100">
                      {distro.initSystem}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-stone-500 dark:text-slate-400">نموذج التحديث</dt>
                    <dd className="font-medium text-stone-900 dark:text-slate-100">{distro.releaseModel}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-stone-500 dark:text-slate-400">المعماريات</dt>
                    <dd className="font-mono font-medium text-stone-900 dark:text-slate-100">
                      {distro.architecture.join(' · ')}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-stone-500 dark:text-slate-400">أدنى ذاكرة (RAM)</dt>
                    <dd className="font-mono tabular-nums font-medium text-stone-900 dark:text-slate-100">
                      {distro.minRamMb} MB
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-stone-500 dark:text-slate-400">مساحة القرص</dt>
                    <dd className="font-mono tabular-nums font-medium text-stone-900 dark:text-slate-100">
                      {distro.minDiskGb} GB+
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-stone-500 dark:text-slate-400">المنشأ</dt>
                    <dd className="font-medium text-stone-900 dark:text-slate-100">{distro.origin}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Terminal Commands & Step-by-Step Installation */}
          <div className="mt-8 border-t border-stone-200 pt-6 dark:border-slate-800">
            <h3 className="font-display text-lg font-bold text-stone-900 dark:text-slate-100">
              أوامر إدارة الحزم وخطوات التثبيت
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-stone-200 bg-stone-950 p-4 text-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>تثبيت حزمة جديدة</span>
                  <button
                    type="button"
                    onClick={() => copyText(distro.installCommand, 'install')}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-slate-300 hover:bg-slate-800"
                  >
                    {copiedField === 'install' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedField === 'install' ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                </div>
                <pre dir="ltr" className="mt-2 overflow-x-auto font-mono text-xs text-blue-300">
                  <code>{distro.installCommand}</code>
                </pre>
              </div>

              <div className="rounded-xl border border-stone-200 bg-stone-950 p-4 text-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>تحديث النظام بالكامل</span>
                  <button
                    type="button"
                    onClick={() => copyText(distro.updateCommand, 'update')}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-slate-300 hover:bg-slate-800"
                  >
                    {copiedField === 'update' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedField === 'update' ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                </div>
                <pre dir="ltr" className="mt-2 overflow-x-auto font-mono text-xs text-emerald-300">
                  <code>{distro.updateCommand}</code>
                </pre>
              </div>
            </div>

            <ol className="mt-6 space-y-3">
              {distro.installSteps.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-stone-200 bg-white p-3.5 text-sm text-stone-700 dark:border-slate-800 dark:bg-[#141922] dark:text-slate-300"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-stone-100 font-mono text-xs font-bold tabular-nums text-stone-800 dark:bg-slate-800 dark:text-slate-200">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
