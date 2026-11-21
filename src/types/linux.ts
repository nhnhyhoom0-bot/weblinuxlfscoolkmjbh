export type DistroFamily =
  | 'Debian'
  | 'Ubuntu'
  | 'Arch'
  | 'Fedora / RHEL'
  | 'openSUSE'
  | 'Gentoo'
  | 'Slackware'
  | 'Immutable'
  | 'Independent';

export type DistroCategory =
  | 'استخدام يومي'
  | 'مطورين وبرمجة'
  | 'ألعاب ووسائط'
  | 'أمن سيبراني'
  | 'خوادم وسحابة'
  | 'أجهزة ضعيفة'
  | 'خصوصية وأمان'
  | 'أنظمة مدمجة وIoT'
  | 'تعليم وإبداع';

export type ReleaseModel = 'ثابت (Fixed)' | 'متدحرج (Rolling)' | 'غير قابل للتعديل (Immutable)' | 'شبه متدحرج (Semi-Rolling)';

export type DifficultyLevel = 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير';

export type VisualThemeKey = 'gnome' | 'kde' | 'tiling' | 'server' | 'security' | 'workstation';

export interface Distro {
  id: string;
  rank: number;
  name: string;
  tagline: string;
  family: DistroFamily;
  basedOn: string;
  category: DistroCategory;
  desktopEnvironments: string[];
  packageManager: string;
  initSystem: string;
  releaseModel: ReleaseModel;
  difficulty: DifficultyLevel;
  architecture: string[];
  minRamMb: number;
  minDiskGb: number;
  origin: string;
  yearFounded: number;
  status: 'نشطة' | 'مستقرة طويلة الأمد' | 'متخصصة';
  description: string;
  highlights: string[];
  idealFor: string;
  installCommand: string;
  updateCommand: string;
  installSteps: string[];
  officialUrl: string;
  downloadUrl: string;
  docsUrl: string;
  accentColor: string;
  visualTheme: VisualThemeKey;
}

export interface FilterState {
  query: string;
  family: DistroFamily | 'الكل';
  category: DistroCategory | 'الكل';
  difficulty: DifficultyLevel | 'الكل';
  releaseModel: ReleaseModel | 'الكل';
  desktop: string;
  maxRamMb: number | null;
  sortBy: 'rank' | 'name' | 'yearDesc' | 'ramAsc';
}

export interface FinderAnswers {
  experience: 'beginner' | 'intermediate' | 'advanced';
  useCase: 'daily' | 'gaming' | 'dev' | 'security' | 'server' | 'old_pc' | 'privacy';
  hardware: 'low' | 'mid' | 'high';
  updateStyle: 'stable' | 'rolling' | 'immutable';
  desktopStyle: 'modern' | 'familiar' | 'lightweight' | 'tiling';
}

export interface FinderRecommendation {
  distro: Distro;
  score: number;
  reasons: string[];
}

export interface EncyclopediaChapter {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  summary: string;
  image?: string;
  imageCaption?: string;
  sections: {
    heading: string;
    body: string;
    points?: string[];
    code?: string;
    table?: {
      headers: string[];
      rows: string[][];
    };
  }[];
}

export interface TerminalCommandItem {
  command: string;
  syntax: string;
  category: string;
  description: string;
  example: string;
}
