import { useEffect, useMemo, useRef, useState } from 'react';
import { CompareModal } from './components/CompareModal';
import { DistroCatalog } from './components/DistroCatalog';
import { DistroDetailModal } from './components/DistroDetailModal';
import { DistroFinderWizard } from './components/DistroFinderWizard';
import { Footer } from './components/Footer';
import { Header, type ActiveTab } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LinuxEncyclopedia } from './components/LinuxEncyclopedia';
import { TerminalLab } from './components/TerminalLab';
import { DISTROS } from './data/distros';
import type { Distro, FilterState } from './types/linux';
import {
  DEFAULT_FILTERS,
  computeCatalogStats,
  filterDistros,
  paginateDistros,
} from './utils/distroLogic';

const PAGE_SIZE = 24;

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedDistro, setSelectedDistro] = useState<Distro | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>(['ubuntu', 'arch-linux']);
  const [compareOpen, setCompareOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const stats = useMemo(() => computeCatalogStats(DISTROS), []);

  const filteredDistros = useMemo(
    () => filterDistros(DISTROS, filters),
    [filters]
  );

  const pagination = useMemo(
    () => paginateDistros(filteredDistros, page, PAGE_SIZE),
    [filteredDistros, page]
  );

  const compareDistros = useMemo(
    () =>
      compareIds
        .map((id) => DISTROS.find((d) => d.id === id))
        .filter((d): d is Distro => Boolean(d)),
    [compareIds]
  );

  const handleChangeFilters = (next: FilterState) => {
    setFilters(next);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleFocusSearch = () => {
    setActiveTab('catalog');
    setTimeout(() => {
      searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInputRef.current?.focus();
    }, 60);
  };

  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#141619] dark:bg-[#0E1116] dark:text-[#ECEFF4]">
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        compareCount={compareDistros.length}
        onOpenCompare={() => setCompareOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'catalog' && (
          <>
            <HeroSection
              totalDistros={stats.total}
              familiesCount={Object.keys(stats.families).length}
              isDark={isDark}
              onToggleTheme={() => setIsDark((prev) => !prev)}
              onSelectTab={handleSelectTab}
              onFocusSearch={handleFocusSearch}
            />

            <DistroCatalog
              distros={pagination.items}
              totalCount={filteredDistros.length}
              filters={filters}
              onChangeFilters={handleChangeFilters}
              onResetFilters={handleResetFilters}
              page={pagination.currentPage}
              totalPages={pagination.totalPages}
              onChangePage={(p) => {
                setPage(p);
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              compareIds={compareIds}
              onToggleCompare={handleToggleCompare}
              onSelectDistro={setSelectedDistro}
              searchInputRef={searchInputRef}
            />
          </>
        )}

        {activeTab === 'encyclopedia' && <LinuxEncyclopedia />}

        {activeTab === 'terminal' && <TerminalLab distros={DISTROS} />}

        {activeTab === 'finder' && (
          <DistroFinderWizard
            distros={DISTROS}
            onSelectDistro={setSelectedDistro}
          />
        )}
      </main>

      <Footer totalDistros={stats.total} onSelectTab={handleSelectTab} />

      <DistroDetailModal
        distro={selectedDistro}
        isCompared={selectedDistro ? compareIds.includes(selectedDistro.id) : false}
        onToggleCompare={handleToggleCompare}
        onClose={() => setSelectedDistro(null)}
      />

      <CompareModal
        isOpen={compareOpen}
        distros={compareDistros}
        onRemove={(id) => setCompareIds((prev) => prev.filter((item) => item !== id))}
        onClearAll={() => setCompareIds([])}
        onSelectDistro={setSelectedDistro}
        onClose={() => setCompareOpen(false)}
      />
    </div>
  );
}
