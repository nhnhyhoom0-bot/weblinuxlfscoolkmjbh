import type {
  DifficultyLevel,
  Distro,
  DistroCategory,
  DistroFamily,
  ReleaseModel,
  VisualThemeKey,
} from '../types/linux';

export interface CompactDistroSeed {
  id: string;
  name: string;
  tagline: string;
  family: DistroFamily;
  basedOn: string;
  category: DistroCategory;
  de: string[];
  pm: string;
  init: string;
  model: ReleaseModel;
  diff: DifficultyLevel;
  arch: string[];
  ram: number;
  disk: number;
  origin: string;
  year: number;
  status: 'نشطة' | 'مستقرة طويلة الأمد' | 'متخصصة';
  summary: string;
  url: string;
  color: string;
  theme: VisualThemeKey;
}

const FAMILY_COMMANDS: Record<DistroFamily, { install: string; update: string }> = {
  Debian: { install: 'sudo apt install <package>', update: 'sudo apt update && sudo apt upgrade -y' },
  Ubuntu: { install: 'sudo apt install <package>', update: 'sudo apt update && sudo apt upgrade -y' },
  Arch: { install: 'sudo pacman -S <package>', update: 'sudo pacman -Syu' },
  'Fedora / RHEL': { install: 'sudo dnf install <package>', update: 'sudo dnf upgrade --refresh' },
  openSUSE: { install: 'sudo zypper install <package>', update: 'sudo zypper dup' },
  Gentoo: { install: 'sudo emerge --ask <package>', update: 'sudo emerge --sync && sudo emerge -uDN @world' },
  Slackware: { install: 'sudo slackpkg install <package>', update: 'sudo slackpkg update && sudo slackpkg upgrade-all' },
  Immutable: { install: 'flatpak install flathub <app>', update: 'rpm-ostree upgrade || flatpak update' },
  Independent: { install: 'استخدم مدير حزم التوزيعة الرسمي', update: 'تحديث عبر مستودعات التوزيعة الرسمية' },
};

export function hydrateDistros(seeds: CompactDistroSeed[], startRank: number): Distro[] {
  return seeds.map((s, idx) => {
    const cmds = FAMILY_COMMANDS[s.family];
    const deList = s.de.join('، ');
    return {
      id: s.id,
      rank: startRank + idx,
      name: s.name,
      tagline: s.tagline,
      family: s.family,
      basedOn: s.basedOn,
      category: s.category,
      desktopEnvironments: s.de,
      packageManager: s.pm,
      initSystem: s.init,
      releaseModel: s.model,
      difficulty: s.diff,
      architecture: s.arch,
      minRamMb: s.ram,
      minDiskGb: s.disk,
      origin: s.origin,
      yearFounded: s.year,
      status: s.status,
      description: `${s.summary} تستند التوزيعة إلى ${s.basedOn} وتعتمد مدير الحزم ${s.pm} مع نظام الإقلاع ${s.init}، وتأتي مع دعم واجهات ${deList}.`,
      highlights: [
        `مبنية على ${s.basedOn} بنموذج تحديث ${s.model}`,
        `تعمل بسلاسة بذاكرة تبدأ من ${s.ram >= 1024 ? `${(s.ram / 1024).toFixed(s.ram % 1024 === 0 ? 0 : 1)} جيجابايت` : `${s.ram} ميجابايت`}`,
        `تستهدف فئة ${s.category} بمستوى مناسب لـ (${s.diff})`,
      ],
      idealFor: `المستخدمون المهتمون بفئة ${s.category} والراغبون في بيئة ${deList} على أساس ${s.family}.`,
      installCommand: s.pm.includes('apt')
        ? 'sudo apt install <package>'
        : s.pm.includes('pacman')
          ? 'sudo pacman -S <package>'
          : s.pm.includes('dnf')
            ? 'sudo dnf install <package>'
            : s.pm.includes('zypper')
              ? 'sudo zypper install <package>'
              : s.pm.includes('apk')
                ? 'apk add <package>'
                : s.pm.includes('xbps')
                  ? 'sudo xbps-install -S <package>'
                  : cmds.install,
      updateCommand: s.pm.includes('apt')
        ? 'sudo apt update && sudo apt upgrade -y'
        : s.pm.includes('pacman')
          ? 'sudo pacman -Syu'
          : s.pm.includes('dnf')
            ? 'sudo dnf upgrade -y'
            : s.pm.includes('zypper')
              ? 'sudo zypper dup'
              : s.pm.includes('apk')
                ? 'apk update && apk upgrade'
                : cmds.update,
      installSteps: [
        `زر الموقع الرسمي لـ ${s.name} وحمّل صورة ISO المتوافقة مع معمارية جهازك (${s.arch[0]}).`,
        'تحقق من تطابق بصمة التحقق SHA256 قبل نسخ الملف لضمان سلامة الصورة.',
        'اكتب الصورة على فلاشة USB عبر Ventoy أو BalenaEtcher ثم أقلع منها في وضع Live.',
        `اتبع معالج التثبيت وحدد تقسيم القرص (بحد أدنى ${s.disk} جيجابايت) ثم أجرِ أول تحديث للنظام.`,
      ],
      officialUrl: s.url,
      downloadUrl: s.url,
      docsUrl: s.url,
      accentColor: s.color,
      visualTheme: s.theme,
    };
  });
}
