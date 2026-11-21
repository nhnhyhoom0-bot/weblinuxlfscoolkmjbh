import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import { LINUX_IMAGES } from '../data/linuxAssets';
import type { Distro } from '../types/linux';

interface DistroVisualProps {
  distro: Distro;
  variant?: 'card' | 'hero';
}

export const DistroEmblem: React.FC<{ distro: Distro; size?: 'sm' | 'md' | 'lg' }> = ({
  distro,
  size = 'md',
}) => {
  const letters = distro.name
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 2)
    .toUpperCase() || 'LX';

  const dim =
    size === 'sm' ? 'h-9 w-9 text-xs' : size === 'lg' ? 'h-14 w-14 text-base' : 'h-11 w-11 text-sm';

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/10 font-mono font-bold text-white dark:border-white/15 ${dim}`}
      style={{ backgroundColor: distro.accentColor }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 40 40"
        className="absolute inset-0 h-full w-full opacity-20"
        fill="none"
      >
        <circle cx="32" cy="8" r="14" stroke="white" strokeWidth="2" />
        <path d="M0 32 L40 12" stroke="white" strokeWidth="1.5" />
      </svg>
      <span className="relative tracking-tight">{letters}</span>
    </div>
  );
};

export const DistroPreviewMedia: React.FC<DistroVisualProps> = ({ distro, variant = 'card' }) => {
  const [imgError, setImgError] = useState(false);
  const asset = LINUX_IMAGES[distro.visualTheme];
  const heightClass = variant === 'hero' ? 'h-60 sm:h-72' : 'h-36';

  return (
    <div
      className={`relative w-full overflow-hidden border-b border-stone-200 bg-stone-900 dark:border-slate-800 ${heightClass}`}
    >
      {!imgError ? (
        <img
          src={asset.src}
          alt={`معاينة ${distro.name} — ${asset.label}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-white"
          style={{
            background: `linear-gradient(135deg, ${distro.accentColor}, #0F172A)`,
          }}
        >
          <Terminal className="h-7 w-7 opacity-80" />
          <span className="font-mono text-xs opacity-90">{distro.name}</span>
        </div>
      )}

      {/* Measured contrast scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
      />

      {/* Minimal bottom caption inside frame */}
      <div className="absolute inset-x-3 bottom-2.5 flex items-center justify-between gap-2 text-xs text-white/95">
        <span className="truncate font-mono text-[11px] font-medium">
          {distro.desktopEnvironments[0]}
        </span>
        <span className="tabular-nums font-mono text-[11px] text-white/80">
          #{distro.rank}
        </span>
      </div>
    </div>
  );
};
