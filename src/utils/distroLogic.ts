import type {
  Distro,
  DistroCategory,
  DistroFamily,
  FilterState,
  FinderAnswers,
  FinderRecommendation,
} from '../types/linux';

export const DEFAULT_FILTERS: FilterState = {
  query: '',
  family: 'الكل',
  category: 'الكل',
  difficulty: 'الكل',
  releaseModel: 'الكل',
  desktop: 'الكل',
  maxRamMb: null,
  sortBy: 'rank',
};

export function normalizeArabicSearch(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

export function filterDistros(distros: Distro[], filters: FilterState): Distro[] {
  const q = normalizeArabicSearch(filters.query);

  const filtered = distros.filter((d) => {
    if (filters.family !== 'الكل' && d.family !== filters.family) {
      return false;
    }
    if (filters.category !== 'الكل' && d.category !== filters.category) {
      return false;
    }
    if (filters.difficulty !== 'الكل' && d.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.releaseModel !== 'الكل' && d.releaseModel !== filters.releaseModel) {
      return false;
    }
    if (filters.desktop !== 'الكل') {
      const targetDe = filters.desktop.toLowerCase();
      const hasDe = d.desktopEnvironments.some((de) => de.toLowerCase().includes(targetDe));
      if (!hasDe) return false;
    }
    if (filters.maxRamMb !== null && d.minRamMb > filters.maxRamMb) {
      return false;
    }

    if (q.length > 0) {
      const haystack = normalizeArabicSearch(
        [
          d.name,
          d.tagline,
          d.family,
          d.basedOn,
          d.category,
          d.packageManager,
          d.origin,
          d.description,
          ...d.desktopEnvironments,
        ].join(' ')
      );
      if (!haystack.includes(q)) {
        return false;
      }
    }

    return true;
  });

  const sorted = [...filtered];
  switch (filters.sortBy) {
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'en'));
      break;
    case 'yearDesc':
      sorted.sort((a, b) => b.yearFounded - a.yearFounded || a.rank - b.rank);
      break;
    case 'ramAsc':
      sorted.sort((a, b) => a.minRamMb - b.minRamMb || a.rank - b.rank);
      break;
    case 'rank':
    default:
      sorted.sort((a, b) => a.rank - b.rank);
      break;
  }

  return sorted;
}

export function paginateDistros(
  distros: Distro[],
  page: number,
  pageSize: number
): { items: Distro[]; currentPage: number; totalPages: number } {
  const safeSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(distros.length / safeSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * safeSize;
  return {
    items: distros.slice(start, start + safeSize),
    currentPage,
    totalPages,
  };
}

export function computeCatalogStats(distros: Distro[]): {
  total: number;
  families: Record<DistroFamily, number>;
  categories: Record<DistroCategory, number>;
} {
  const families = {} as Record<DistroFamily, number>;
  const categories = {} as Record<DistroCategory, number>;

  for (const d of distros) {
    families[d.family] = (families[d.family] ?? 0) + 1;
    categories[d.category] = (categories[d.category] ?? 0) + 1;
  }

  return {
    total: distros.length,
    families,
    categories,
  };
}

export function recommendDistros(
  distros: Distro[],
  answers: FinderAnswers,
  limit = 6
): FinderRecommendation[] {
  const scored: FinderRecommendation[] = distros.map((d) => {
    let score = 0;
    const reasons: string[] = [];

    // Experience matching
    if (answers.experience === 'beginner') {
      if (d.difficulty === 'مبتدئ') {
        score += 30;
        reasons.push('سهلة التثبيت والاستخدام للمبتدئين');
      } else if (d.difficulty === 'متوسط') {
        score += 10;
      } else {
        score -= 15;
      }
    } else if (answers.experience === 'intermediate') {
      if (d.difficulty === 'متوسط' || d.difficulty === 'مبتدئ') {
        score += 22;
        reasons.push('توازن ممتاز بين السهولة والمرونة');
      } else if (d.difficulty === 'متقدم') {
        score += 12;
      }
    } else {
      if (d.difficulty === 'متقدم' || d.difficulty === 'خبير') {
        score += 28;
        reasons.push('توفر تحكماً عميقاً ومزايا للمحترفين');
      }
    }

    // Use case matching
    const useCaseCategoryMap: Record<FinderAnswers['useCase'], DistroCategory> = {
      daily: 'استخدام يومي',
      gaming: 'ألعاب ووسائط',
      dev: 'مطورين وبرمجة',
      security: 'أمن سيبراني',
      server: 'خوادم وسحابة',
      old_pc: 'أجهزة ضعيفة',
      privacy: 'خصوصية وأمان',
    };
    const targetCategory = useCaseCategoryMap[answers.useCase];
    if (d.category === targetCategory) {
      score += 35;
      reasons.push(`مصممة خصيصاً لفئة ${targetCategory}`);
    }

    // Hardware RAM matching
    if (answers.hardware === 'low') {
      if (d.minRamMb <= 1024) {
        score += 25;
        reasons.push(`متطلبات ذاكرة منخفضة (${d.minRamMb} MB)`);
      } else if (d.minRamMb > 2048) {
        score -= 20;
      }
    } else if (answers.hardware === 'mid') {
      if (d.minRamMb <= 4096) {
        score += 15;
      }
    } else {
      score += 10;
    }

    // Update style matching
    if (answers.updateStyle === 'stable' && d.releaseModel === 'ثابت (Fixed)') {
      score += 18;
      reasons.push('تحديثات مستقرة ومختبرة');
    } else if (answers.updateStyle === 'rolling' && d.releaseModel === 'متدحرج (Rolling)') {
      score += 18;
      reasons.push('نموذج متدحرج يوفر أحدث الحزم دائماً');
    } else if (answers.updateStyle === 'immutable' && d.releaseModel === 'غير قابل للتعديل (Immutable)') {
      score += 22;
      reasons.push('بنية غير قابلة للتعديل مقاومة للأعطال');
    }

    // Desktop taste matching
    const deJoined = d.desktopEnvironments.join(' ').toLowerCase();
    if (answers.desktopStyle === 'modern' && deJoined.includes('gnome')) {
      score += 14;
      reasons.push('واجهة GNOME حديثة وانسيابية');
    } else if (
      answers.desktopStyle === 'familiar' &&
      (deJoined.includes('kde') || deJoined.includes('cinnamon') || deJoined.includes('budgie'))
    ) {
      score += 14;
      reasons.push('واجهة مألوفة قريبة من تجربة سطح المكتب التقليدية');
    } else if (
      answers.desktopStyle === 'lightweight' &&
      (deJoined.includes('xfce') || deJoined.includes('lxqt') || deJoined.includes('mate') || deJoined.includes('openbox'))
    ) {
      score += 14;
      reasons.push('بيئة خفيفة وسريعة الاستجابة');
    } else if (
      answers.desktopStyle === 'tiling' &&
      (deJoined.includes('hyprland') || deJoined.includes('sway') || deJoined.includes('i3'))
    ) {
      score += 18;
      reasons.push('تدعم التبليط التلقائي للعمل بلوحة المفاتيح');
    }

    // Slight boost for top flagship reliability
    if (d.rank <= 40) {
      score += 8;
    }

    return {
      distro: d,
      score: Math.max(0, Math.min(100, score)),
      reasons: reasons.length > 0 ? reasons : [`خيار موثوق من عائلة ${d.family}`],
    };
  });

  return scored
    .sort((a, b) => b.score - a.score || a.distro.rank - b.distro.rank)
    .slice(0, limit);
}

export interface PackageTranslationRow {
  action: string;
  apt: string;
  pacman: string;
  dnf: string;
  zypper: string;
  apk: string;
  nix: string;
}

export const PACKAGE_TRANSLATIONS: PackageTranslationRow[] = [
  {
    action: 'تحديث قائمة المستودعات والنظام',
    apt: 'sudo apt update && sudo apt upgrade',
    pacman: 'sudo pacman -Syu',
    dnf: 'sudo dnf upgrade --refresh',
    zypper: 'sudo zypper dup',
    apk: 'apk update && apk upgrade',
    nix: 'sudo nixos-rebuild switch --upgrade',
  },
  {
    action: 'تثبيت حزمة جديدة',
    apt: 'sudo apt install <pkg>',
    pacman: 'sudo pacman -S <pkg>',
    dnf: 'sudo dnf install <pkg>',
    zypper: 'sudo zypper install <pkg>',
    apk: 'apk add <pkg>',
    nix: 'nix-shell -p <pkg>',
  },
  {
    action: 'حذف حزمة',
    apt: 'sudo apt remove <pkg>',
    pacman: 'sudo pacman -Rns <pkg>',
    dnf: 'sudo dnf remove <pkg>',
    zypper: 'sudo zypper remove <pkg>',
    apk: 'apk del <pkg>',
    nix: 'nix-env -e <pkg>',
  },
  {
    action: 'البحث عن حزمة',
    apt: 'apt search <term>',
    pacman: 'pacman -Ss <term>',
    dnf: 'dnf search <term>',
    zypper: 'zypper search <term>',
    apk: 'apk search <term>',
    nix: 'nix search nixpkgs <term>',
  },
  {
    action: 'تنظيف الحزم غير المستخدمة',
    apt: 'sudo apt autoremove',
    pacman: 'sudo pacman -Rns $(pacman -Qdtq)',
    dnf: 'sudo dnf autoremove',
    zypper: 'sudo zypper rm -u',
    apk: 'apk cache clean',
    nix: 'nix-collect-garbage -d',
  },
];
