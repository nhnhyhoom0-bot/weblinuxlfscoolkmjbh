import React, { useMemo, useState } from 'react';
import { ExternalLink, RotateCcw } from 'lucide-react';
import type { Distro, FinderAnswers } from '../types/linux';
import { recommendDistros } from '../utils/distroLogic';
import { DistroEmblem } from './DistroVisual';

interface DistroFinderWizardProps {
  distros: Distro[];
  onSelectDistro: (distro: Distro) => void;
}

const DEFAULT_ANSWERS: FinderAnswers = {
  experience: 'beginner',
  useCase: 'daily',
  hardware: 'mid',
  updateStyle: 'stable',
  desktopStyle: 'familiar',
};

export const DistroFinderWizard: React.FC<DistroFinderWizardProps> = ({
  distros,
  onSelectDistro,
}) => {
  const [answers, setAnswers] = useState<FinderAnswers>(DEFAULT_ANSWERS);

  const recommendations = useMemo(
    () => recommendDistros(distros, answers, 6),
    [distros, answers]
  );

  return (
    <section aria-label="مستشار اختيار توزيعة لينكس" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end dark:border-slate-800">
        <div>
          <p className="text-xs font-semibold tracking-wide text-stone-500 dark:text-slate-400">
            مستشار التوزيعات الذكي · تصفية من بين {distros.length} توزيعة
          </p>
          <h2 className="font-display mt-2 text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-slate-50">
            أي توزيعة لينكس تناسبك؟
          </h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-slate-400">
            حدد مواصفات جهازك وخبرتك وهدفك الأساسي لنرشح لك أفضل 6 توزيعات بدقة فورية.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAnswers(DEFAULT_ANSWERS)}
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>إعادة التعيين</span>
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Questionnaire Column */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-slate-800 dark:bg-[#141922]">
            <h3 className="font-display text-sm font-bold text-stone-900 dark:text-slate-100">
              1. مستواك الحالي مع لينكس
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { id: 'beginner', label: 'مبتدئ تماماً' },
                { id: 'intermediate', label: 'متوسط الخبرة' },
                { id: 'advanced', label: 'محترف / خبير' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnswers({ ...answers, experience: opt.id as FinderAnswers['experience'] })}
                  className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                    answers.experience === opt.id
                      ? 'border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-slate-800 dark:bg-[#141922]">
            <h3 className="font-display text-sm font-bold text-stone-900 dark:text-slate-100">
              2. ما الاستخدام الأساسي للجهاز؟
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { id: 'daily', label: 'استخدام يومي ومكتبي' },
                { id: 'dev', label: 'برمجة وتطوير' },
                { id: 'gaming', label: 'ألعاب ووسائط' },
                { id: 'security', label: 'أمن سيبراني' },
                { id: 'server', label: 'خادم وسحابة' },
                { id: 'old_pc', label: 'إحياء حاسوب قديم' },
                { id: 'privacy', label: 'خصوصية وتخفي' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnswers({ ...answers, useCase: opt.id as FinderAnswers['useCase'] })}
                  className={`rounded-lg border px-3 py-2 text-right text-xs font-medium transition-colors ${
                    answers.useCase === opt.id
                      ? 'border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-slate-800 dark:bg-[#141922]">
            <h3 className="font-display text-sm font-bold text-stone-900 dark:text-slate-100">
              3. مواصفات العتاد والذاكرة (RAM)
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { id: 'low', label: 'ضعيف (≤ 2GB)' },
                { id: 'mid', label: 'متوسط (4–8GB)' },
                { id: 'high', label: 'قوي (16GB+)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnswers({ ...answers, hardware: opt.id as FinderAnswers['hardware'] })}
                  className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                    answers.hardware === opt.id
                      ? 'border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-slate-800 dark:bg-[#141922]">
            <h3 className="font-display text-sm font-bold text-stone-900 dark:text-slate-100">
              4. أسلوب التحديث المفضل
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { id: 'stable', label: 'ثابت ومستقر' },
                { id: 'rolling', label: 'متدحرج (الأحدث)' },
                { id: 'immutable', label: 'غير قابل للكسر' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnswers({ ...answers, updateStyle: opt.id as FinderAnswers['updateStyle'] })}
                  className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                    answers.updateStyle === opt.id
                      ? 'border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-slate-800 dark:bg-[#141922]">
            <h3 className="font-display text-sm font-bold text-stone-900 dark:text-slate-100">
              5. شكل سطح المكتب الذي تفضله
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { id: 'familiar', label: 'مألوف (شبيه بويندوز / KDE)' },
                { id: 'modern', label: 'عصري مبسط (GNOME)' },
                { id: 'lightweight', label: 'خفيف كلاسيكي (XFCE / LXQt)' },
                { id: 'tiling', label: 'تبليط بلوحة المفاتيح (Hyprland)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnswers({ ...answers, desktopStyle: opt.id as FinderAnswers['desktopStyle'] })}
                  className={`rounded-lg border px-3 py-2 text-right text-xs font-medium transition-colors ${
                    answers.desktopStyle === opt.id
                      ? 'border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Recommendations Column */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-stone-900 dark:text-slate-100">
              أفضل الترشيحات المناسبة لاختياراتك
            </h3>
            <span className="text-xs text-stone-500 dark:text-slate-400">تحديث فوري</span>
          </div>

          <div className="mt-4 space-y-4">
            {recommendations.map(({ distro, score, reasons }, idx) => (
              <div
                key={distro.id}
                className="rounded-xl border border-stone-200 bg-white p-5 transition-colors hover:border-stone-300 dark:border-slate-800 dark:bg-[#141922] dark:hover:border-slate-700"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-3.5">
                    <DistroEmblem distro={distro} size="md" />
                    <div>
                      <p className="text-xs font-medium text-stone-500 dark:text-slate-400">
                        الترشيح <span dir="ltr" className="tabular-nums">#{idx + 1}</span> · {distro.family} · تطابق{' '}
                        <span className="tabular-nums font-semibold text-blue-700 dark:text-blue-400">
                          {score}%
                        </span>
                      </p>
                      <h4 className="font-display mt-0.5 text-lg font-bold text-stone-900 dark:text-slate-50">
                        {distro.name}
                      </h4>
                      <p className="mt-1 text-sm text-stone-600 dark:text-slate-300">{distro.tagline}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectDistro(distro)}
                      className="whitespace-nowrap rounded-lg bg-stone-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                      عرض دليل التثبيت
                    </button>
                    <a
                      href={distro.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`تحميل ${distro.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 dark:border-slate-700 dark:text-slate-300"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-stone-100 pt-3 text-xs text-stone-600 dark:border-slate-800 dark:text-slate-400">
                  {reasons.map((r, rIdx) => (
                    <React.Fragment key={rIdx}>
                      {rIdx > 0 && <span className="text-stone-400 dark:text-slate-600" aria-hidden="true">·</span>}
                      <span>{r}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
