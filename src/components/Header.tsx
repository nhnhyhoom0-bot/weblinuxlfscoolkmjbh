import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type ActiveTab = 'catalog' | 'encyclopedia' | 'terminal' | 'finder';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  compareCount: number;
  onOpenCompare: () => void;
}

const NAV_ITEMS: { id: ActiveTab; label: string }[] = [
  { id: 'catalog', label: 'التوزيعات (300)' },
  { id: 'encyclopedia', label: 'موسوعة لينكس' },
  { id: 'terminal', label: 'الطرفية والأوامر' },
  { id: 'finder', label: 'اختر توزيعتك' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  compareCount,
  onOpenCompare,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#FAF9F6]/95 backdrop-blur-sm dark:border-slate-800 dark:bg-[#0E1116]/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNav('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display shrink-0 whitespace-nowrap text-xl font-bold tracking-tight text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 dark:text-slate-50"
        >
          أطلس لينكس
        </a>

        {/* Zone 2: 4 Single-line Navigation Links */}
        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative shrink-0 whitespace-nowrap py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${
                  isActive
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-stone-600 hover:text-stone-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-700 dark:bg-blue-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenCompare}
            className="shrink-0 whitespace-nowrap rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            مقارنة التوزيعات (<span className="tabular-nums">{compareCount}</span>)
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-700 md:hidden dark:border-slate-700 dark:text-slate-200"
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="قائمة الجوال"
          className="border-t border-stone-200 bg-[#FAF9F6] px-4 py-3 md:hidden dark:border-slate-800 dark:bg-[#0E1116]"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full rounded-lg px-3 py-2.5 text-right text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'text-stone-700 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};
