import React, { useState } from 'react';
import { ArrowDownLeft, BookOpen, Moon, Sun, Terminal } from 'lucide-react';
import { LINUX_IMAGES } from '../data/linuxAssets';
import type { ActiveTab } from './Header';

interface HeroSectionProps {
  totalDistros: number;
  familiesCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onFocusSearch: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalDistros,
  familiesCount,
  isDark,
  onToggleTheme,
  onSelectTab,
  onFocusSearch,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="border-b border-stone-200 bg-[#FAF9F6] dark:border-slate-800 dark:bg-[#0E1116]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Editorial Intro Column */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <p className="text-xs font-semibold tracking-wide text-stone-500 dark:text-slate-400">
                المرجع العربي الشامل · <span className="tabular-nums">{totalDistros}</span> توزيعة موثقة · دليل النظام والطرفية
              </p>

              <h1 className="font-display mt-3 text-balance text-3xl font-extrabold leading-tight text-stone-900 sm:text-4xl lg:text-[2.75rem] dark:text-slate-50">
                كل ما يخص نظام لينكس وتوزيعاته{' '}
                <span className="whitespace-nowrap">
                  الـ <span className="tabular-nums text-blue-700 dark:text-blue-400">{totalDistros}</span>
                </span>{' '}
                في موسوعة واحدة
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg dark:text-slate-300">
                استكشف دليلاً مصوراً ومفصلاً يغطي أشهر التوزيعات وأندرها مع شرح المعمارية، بيئات سطح المكتب،
                مديري الحزم، متطلبات التشغيل، وروابط التحميل والتثبيت الرسمية خطوة بخطوة.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onFocusSearch}
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <span>تصفح الـ {totalDistros} توزيعة</span>
                <ArrowDownLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('finder')}
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition-colors duration-150 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <span>ساعدني أختار توزيعتي</span>
              </button>
            </div>
          </div>

          {/* Visual Showcase Column */}
          <div className="lg:col-span-6">
            <figure className="flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-stone-100 dark:border-slate-800 dark:bg-slate-900">
              <div className="relative min-h-[240px] flex-1 overflow-hidden bg-stone-200 dark:bg-slate-800">
                {!imgError ? (
                  <img
                    src={LINUX_IMAGES.workstation.src}
                    alt={LINUX_IMAGES.workstation.alt}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover lg:h-full"
                  />
                ) : (
                  <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-800 to-slate-950 p-6 text-center text-slate-200">
                    <Terminal className="h-10 w-10 text-blue-400" />
                    <span className="font-display text-sm font-semibold">بيئة عمل لينكس مفتوحة المصدر</span>
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent"
                />
              </div>
              <figcaption className="border-t border-stone-200 bg-white px-4 py-2.5 text-xs text-stone-600 dark:border-slate-800 dark:bg-[#141922] dark:text-slate-400">
                محطة عمل لينكس متكاملة — تضم واجهات سطح مكتب حديثة وأدوات تطوير مفتوحة المصدر.
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Full-Width 4-Column Institutional Metrics & Workspace Utility Ribbon */}
        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-stone-200 pt-8 md:grid-cols-4 dark:border-slate-800">
          <div>
            <div className="font-display tabular-nums text-2xl font-bold text-stone-900 dark:text-slate-50">
              {totalDistros}
            </div>
            <div className="mt-1 text-xs text-stone-600 dark:text-slate-400">
              توزيعة لينكس موثقة بروابطها
            </div>
          </div>
          <div>
            <div className="font-display tabular-nums text-2xl font-bold text-stone-900 dark:text-slate-50">
              {familiesCount}
            </div>
            <div className="mt-1 text-xs text-stone-600 dark:text-slate-400">
              عائلات رئيسية ومستقلة
            </div>
          </div>
          <div>
            <div className="font-display tabular-nums text-2xl font-bold text-stone-900 dark:text-slate-50">
              6 فصول
            </div>
            <div className="mt-1 text-xs text-stone-600 dark:text-slate-400">
              شرح النواة والملفات والتثبيت
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-display tabular-nums text-2xl font-bold text-stone-900 dark:text-slate-50">
                16+ أداة
              </div>
              <div className="mt-1 text-xs text-stone-600 dark:text-slate-400">
                مرجع ومحاكاة الطرفية الحية
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الداكن'}
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
              <span>{isDark ? 'نهاري' : 'داكن'}</span>
            </button>
          </div>
        </div>

        {/* Quick Workspace Shortcuts */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-stone-200/70 pt-5 text-xs text-stone-600 dark:border-slate-800/80 dark:text-slate-400">
          <span className="font-semibold text-stone-800 dark:text-slate-200">أقسام سريعة:</span>
          <button
            type="button"
            onClick={() => onSelectTab('encyclopedia')}
            className="inline-flex items-center gap-1.5 font-medium text-blue-700 hover:underline dark:text-blue-400"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>اقرأ موسوعة لينكس ودليل التثبيت الشامل</span>
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => onSelectTab('terminal')}
            className="inline-flex items-center gap-1.5 font-medium text-blue-700 hover:underline dark:text-blue-400"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>جرّب الطرفية التفاعلية ومترجم أوامر الحزم</span>
          </button>
        </div>
      </div>
    </section>
  );
};
