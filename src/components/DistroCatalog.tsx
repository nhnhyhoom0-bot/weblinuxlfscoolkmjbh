import React from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GitCompareArrows,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
} from 'lucide-react';
import type {
  DifficultyLevel,
  Distro,
  DistroCategory,
  DistroFamily,
  FilterState,
  ReleaseModel,
} from '../types/linux';
import { DistroEmblem, DistroPreviewMedia } from './DistroVisual';

interface DistroCatalogProps {
  distros: Distro[];
  totalCount: number;
  filters: FilterState;
  onChangeFilters: (next: FilterState) => void;
  onResetFilters: () => void;
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  viewMode: 'grid' | 'table';
  onChangeViewMode: (mode: 'grid' | 'table') => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onSelectDistro: (distro: Distro) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

const FAMILIES: (DistroFamily | 'الكل')[] = [
  'الكل',
  'Ubuntu',
  'Debian',
  'Arch',
  'Fedora / RHEL',
  'openSUSE',
  'Immutable',
  'Gentoo',
  'Slackware',
  'Independent',
];

const CATEGORIES: (DistroCategory | 'الكل')[] = [
  'الكل',
  'استخدام يومي',
  'مطورين وبرمجة',
  'ألعاب ووسائط',
  'أمن سيبراني',
  'خوادم وسحابة',
  'أجهزة ضعيفة',
  'خصوصية وأمان',
  'أنظمة مدمجة وIoT',
  'تعليم وإبداع',
];

const DIFFICULTIES: (DifficultyLevel | 'الكل')[] = ['الكل', 'مبتدئ', 'متوسط', 'متقدم', 'خبير'];

const RELEASE_MODELS: (ReleaseModel | 'الكل')[] = [
  'الكل',
  'ثابت (Fixed)',
  'متدحرج (Rolling)',
  'غير قابل للتعديل (Immutable)',
  'شبه متدحرج (Semi-Rolling)',
];

const DESKTOPS = ['الكل', 'GNOME', 'KDE Plasma', 'XFCE', 'Cinnamon', 'MATE', 'LXQt', 'Hyprland', 'Sway', 'Openbox', 'CLI'];

export const DistroCatalog: React.FC<DistroCatalogProps> = ({
  distros,
  totalCount,
  filters,
  onChangeFilters,
  onResetFilters,
  page,
  totalPages,
  onChangePage,
  viewMode,
  onChangeViewMode,
  compareIds,
  onToggleCompare,
  onSelectDistro,
  searchInputRef,
}) => {
  const hasActiveFilters =
    filters.query !== '' ||
    filters.family !== 'الكل' ||
    filters.category !== 'الكل' ||
    filters.difficulty !== 'الكل' ||
    filters.releaseModel !== 'الكل' ||
    filters.desktop !== 'الكل' ||
    filters.maxRamMb !== null;

  return (
    <section id="catalog" aria-label="أطلس توزيعات لينكس" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-10 sm:px-6 lg:px-8">
      {/* Section Header & Search */}
      <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-6 md:flex-row md:items-end dark:border-slate-800">
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl dark:text-slate-50">
            أطلس توزيعات لينكس
          </h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-slate-400">
            النتائج المطابقة:{' '}
            <span className="tabular-nums font-semibold text-stone-900 dark:text-slate-100">
              {totalCount}
            </span>{' '}
            توزيعة · الصفحة{' '}
            <span className="tabular-nums font-semibold text-stone-900 dark:text-slate-100">
              {page}
            </span>{' '}
            من <span className="tabular-nums">{totalPages}</span>
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
          <div className="relative flex-1 sm:w-96">
            <label htmlFor="distro-search" className="sr-only">
              ابحث في 300 توزيعة لينكس
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-slate-500"
            />
            <input
              ref={searchInputRef}
              id="distro-search"
              type="search"
              value={filters.query}
              onChange={(e) => onChangeFilters({ ...filters, query: e.target.value })}
              placeholder="ابحث عن توزيعة أو عائلة أو مدير حزم..."
              className="w-full rounded-lg border border-stone-300 bg-white py-2.5 pl-4 pr-10 text-sm text-stone-900 placeholder:text-stone-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-lg border border-stone-200 bg-stone-100 p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => onChangeViewMode('grid')}
              aria-label="عرض شبكي"
              aria-pressed={viewMode === 'grid'}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-sm dark:bg-slate-800 dark:text-slate-50'
                  : 'text-stone-600 hover:text-stone-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>بطاقات</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('table')}
              aria-label="عرض جدولي"
              aria-pressed={viewMode === 'table'}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-sm dark:bg-slate-800 dark:text-slate-50'
                  : 'text-stone-600 hover:text-stone-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>جدول</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Family Segmented Tabs */}
      <div className="mt-5 flex flex-wrap items-center gap-1.5" role="group" aria-label="تصفية حسب العائلة الأم">
        {FAMILIES.map((family) => {
          const active = filters.family === family;
          return (
            <button
              key={family}
              type="button"
              onClick={() => onChangeFilters({ ...filters, family })}
              aria-pressed={active}
              className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'bg-stone-900 text-white dark:bg-blue-600 dark:text-white'
                  : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {family === 'الكل' ? 'كل العائلات' : family}
            </button>
          );
        })}
      </div>

      {/* Secondary Facet Selects */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div>
          <label htmlFor="filter-category" className="mb-1 block text-xs font-medium text-stone-600 dark:text-slate-400">
            التصنيف الوظيفي
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => onChangeFilters({ ...filters, category: e.target.value as DistroCategory | 'الكل' })}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'الكل' ? 'جميع التصنيفات' : c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-difficulty" className="mb-1 block text-xs font-medium text-stone-600 dark:text-slate-400">
            مستوى الخبرة
          </label>
          <select
            id="filter-difficulty"
            value={filters.difficulty}
            onChange={(e) => onChangeFilters({ ...filters, difficulty: e.target.value as DifficultyLevel | 'الكل' })}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d === 'الكل' ? 'كل المستويات' : d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-release" className="mb-1 block text-xs font-medium text-stone-600 dark:text-slate-400">
            نموذج التحديث
          </label>
          <select
            id="filter-release"
            value={filters.releaseModel}
            onChange={(e) => onChangeFilters({ ...filters, releaseModel: e.target.value as ReleaseModel | 'الكل' })}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {RELEASE_MODELS.map((m) => (
              <option key={m} value={m}>
                {m === 'الكل' ? 'جميع النماذج' : m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-desktop" className="mb-1 block text-xs font-medium text-stone-600 dark:text-slate-400">
            بيئة سطح المكتب
          </label>
          <select
            id="filter-desktop"
            value={filters.desktop}
            onChange={(e) => onChangeFilters({ ...filters, desktop: e.target.value })}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {DESKTOPS.map((de) => (
              <option key={de} value={de}>
                {de === 'الكل' ? 'كل الواجهات' : de}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-ram" className="mb-1 block text-xs font-medium text-stone-600 dark:text-slate-400">
            الذاكرة العشوائية (RAM)
          </label>
          <select
            id="filter-ram"
            value={filters.maxRamMb ?? ''}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                maxRamMb: e.target.value === '' ? null : Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">أي سعة ذاكرة</option>
            <option value="512">حتى 512 MB (قديمة جداً)</option>
            <option value="1024">حتى 1 GB RAM</option>
            <option value="2048">حتى 2 GB RAM</option>
            <option value="4096">حتى 4 GB RAM</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-sort" className="mb-1 block text-xs font-medium text-stone-600 dark:text-slate-400">
            الترتيب
          </label>
          <select
            id="filter-sort"
            value={filters.sortBy}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                sortBy: e.target.value as FilterState['sortBy'],
              })
            }
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="rank">الأشهر والأبرز أولاً</option>
            <option value="name">أبجدياً (A–Z)</option>
            <option value="yearDesc">الأحدث تأسيساً</option>
            <option value="ramAsc">الأخف في استهلاك الذاكرة</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between border-t border-stone-200/70 pt-3 text-xs dark:border-slate-800/80">
          <span className="text-stone-600 dark:text-slate-400">
            يتم عرض التوزيعات المطابقة للتصفية الحالية
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 font-medium text-blue-700 hover:underline dark:text-blue-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>إعادة ضبط الفلاتر</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {distros.length === 0 ? (
        <div className="mt-10 rounded-xl border border-stone-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-lg font-bold text-stone-900 dark:text-slate-100">
            لم يتم العثور على توزيعات مطابقة
          </h3>
          <p className="mt-2 text-sm text-stone-600 dark:text-slate-400">
            جرّب تغيير كلمات البحث أو تخفيف قيود الذاكرة والتصنيف لعرض المزيد من التوزيعات الـ 300.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <RotateCcw className="h-4 w-4" />
            <span>عرض جميع التوزيعات</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div
          data-testid="distro-grid"
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {distros.map((distro) => {
            const isCompared = compareIds.includes(distro.id);
            const ramLabel =
              distro.minRamMb >= 1024
                ? `${(distro.minRamMb / 1024).toFixed(distro.minRamMb % 1024 === 0 ? 0 : 1)}GB RAM`
                : `${distro.minRamMb}MB RAM`;

            return (
              <article
                key={distro.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition-colors duration-150 hover:border-stone-300 dark:border-slate-800 dark:bg-[#141922] dark:hover:border-slate-700"
              >
                <DistroPreviewMedia distro={distro} />

                <div className="flex flex-1 flex-col p-5">
                  {/* Header Row: Emblem + Title + Unboxed Metadata */}
                  <div className="flex items-start gap-3">
                    <DistroEmblem distro={distro} size="md" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display truncate text-lg font-bold text-stone-900 dark:text-slate-50">
                        {distro.name}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-stone-500 dark:text-slate-400">
                        <span>{distro.family}</span>
                        <span aria-hidden="true">{' · '}</span>
                        <span>{distro.difficulty}</span>
                        <span aria-hidden="true">{' · '}</span>
                        <span className="tabular-nums font-mono">{ramLabel}</span>
                      </p>
                    </div>
                  </div>

                  {/* Arabic Tagline */}
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-stone-700 dark:text-slate-300">
                    {distro.tagline}
                  </p>

                  {/* Clean Technical Line */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-stone-100 pt-3 text-xs text-stone-500 dark:border-slate-800 dark:text-slate-400">
                    <span>{distro.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px]">{distro.packageManager.split('/')[0].trim()}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{distro.yearFounded}</span>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectDistro(distro)}
                      aria-label={`عرض تفاصيل وتثبيت ${distro.name}`}
                      className="flex-1 whitespace-nowrap rounded-lg bg-stone-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-slate-800 dark:hover:bg-blue-600"
                    >
                      الشرح وروابط التثبيت
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleCompare(distro.id)}
                      aria-label={isCompared ? `إزالة ${distro.name} من المقارنة` : `إضافة ${distro.name} للمقارنة`}
                      aria-pressed={isCompared}
                      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        isCompared
                          ? 'border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      {isCompared ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
                    </button>

                    <a
                      href={distro.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`رابط التحميل الرسمي لتوزيعة ${distro.name}`}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* High-Density Table View */
        <div className="mt-8 overflow-x-auto rounded-xl border border-stone-200 bg-white dark:border-slate-800 dark:bg-[#141922]">
          <table className="w-full min-w-[820px] border-collapse text-right text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold text-stone-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                <th className="px-4 py-3 tabular-nums">#</th>
                <th className="px-4 py-3">التوزيعة</th>
                <th className="px-4 py-3">العائلة</th>
                <th className="px-4 py-3">التصنيف</th>
                <th className="px-4 py-3">الواجهة</th>
                <th className="px-4 py-3">مدير الحزم</th>
                <th className="px-4 py-3">أدنى RAM</th>
                <th className="px-4 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
              {distros.map((distro) => {
                const isCompared = compareIds.includes(distro.id);
                return (
                  <tr
                    key={distro.id}
                    className="transition-colors hover:bg-stone-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-4 py-3 font-mono text-xs tabular-nums text-stone-500">
                      {distro.rank}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <DistroEmblem distro={distro} size="sm" />
                        <div>
                          <button
                            type="button"
                            onClick={() => onSelectDistro(distro)}
                            className="font-display font-bold text-stone-900 hover:text-blue-700 hover:underline dark:text-slate-100 dark:hover:text-blue-400"
                          >
                            {distro.name}
                          </button>
                          <div className="max-w-xs truncate text-xs text-stone-500 dark:text-slate-400">
                            {distro.tagline}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-700 dark:text-slate-300">{distro.family}</td>
                    <td className="px-4 py-3 text-xs text-stone-700 dark:text-slate-300">{distro.category}</td>
                    <td className="px-4 py-3 text-xs text-stone-600 dark:text-slate-400">
                      {distro.desktopEnvironments[0]}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-700 dark:text-slate-300">
                      {distro.packageManager}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs tabular-nums text-stone-700 dark:text-slate-300">
                      {distro.minRamMb} MB
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectDistro(distro)}
                          className="whitespace-nowrap rounded-md bg-stone-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 dark:bg-slate-800 dark:hover:bg-blue-600"
                        >
                          تفاصيل
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleCompare(distro.id)}
                          aria-label={`مقارنة ${distro.name}`}
                          className={`rounded-md border px-2 py-1.5 text-xs ${
                            isCompared
                              ? 'border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300'
                              : 'border-stone-200 text-stone-600 hover:bg-stone-100 dark:border-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isCompared ? 'مختارة' : 'قارن'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          aria-label="ترقيم صفحات التوزيعات"
          className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-6 dark:border-slate-800"
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onChangePage(page - 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-800 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <ChevronRight className="h-4 w-4" />
            <span>السابق</span>
          </button>

          <div className="flex flex-wrap items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const active = p === page;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onChangePage(p)}
                  aria-current={active ? 'page' : undefined}
                  aria-label={`صفحة ${p}`}
                  className={`h-9 min-w-9 rounded-lg px-2.5 font-mono text-xs tabular-nums transition-colors ${
                    active
                      ? 'bg-blue-700 font-bold text-white dark:bg-blue-600'
                      : 'text-stone-600 hover:bg-stone-200/70 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onChangePage(page + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-800 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <span>التالي</span>
            <ChevronLeft className="h-4 w-4" />
          </button>
        </nav>
      )}
    </section>
  );
};
