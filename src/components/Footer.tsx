import React from 'react';
import type { ActiveTab } from './Header';

interface FooterProps {
  totalDistros: number;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ totalDistros, onSelectTab }) => {
  return (
    <footer className="border-t border-stone-200 bg-[#F4F2EC] py-10 dark:border-slate-800 dark:bg-[#0B0D12]">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-base font-bold text-stone-900 dark:text-slate-100">
            أطلس لينكس
          </p>
          <p className="mt-1 text-xs text-stone-600 dark:text-slate-400">
            مرجع عربي مفتوح يوثق <span className="tabular-nums">{totalDistros}</span> توزيعة لينكس
            بمواصفاتها وروابط التثبيت الرسمية.
          </p>
        </div>

        <nav aria-label="روابط التذييل" className="flex flex-wrap items-center gap-6 text-xs font-medium text-stone-600 dark:text-slate-400">
          <button
            type="button"
            onClick={() => {
              onSelectTab('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-stone-900 hover:underline dark:hover:text-slate-100"
          >
            دليل التوزيعات
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectTab('encyclopedia');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-stone-900 hover:underline dark:hover:text-slate-100"
          >
            موسوعة لينكس
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectTab('terminal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-stone-900 hover:underline dark:hover:text-slate-100"
          >
            محاكي الطرفية
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectTab('finder');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-stone-900 hover:underline dark:hover:text-slate-100"
          >
            مستشار التوزيعات
          </button>
        </nav>
      </div>
    </footer>
  );
};
