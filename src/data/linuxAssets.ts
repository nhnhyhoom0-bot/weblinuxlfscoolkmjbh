import type { VisualThemeKey } from '../types/linux';

export const LINUX_IMAGES: Record<VisualThemeKey, { src: string; alt: string; label: string }> = {
  workstation: {
    src: '/src/assets/images/linux_hero_workstation_1795259492397.jpg',
    alt: 'محطة عمل لينكس حديثة مع نوافذ طرفية ومحرر أكواد',
    label: 'محطة عمل متكاملة',
  },
  gnome: {
    src: '/src/assets/images/desktop_gnome_modern_1795259493484.jpg',
    alt: 'معاينة بيئة سطح المكتب GNOME الحديثة على نظام لينكس',
    label: 'بيئة GNOME الحديثة',
  },
  kde: {
    src: '/src/assets/images/desktop_kde_plasma_1795259495477.jpg',
    alt: 'معاينة بيئة سطح المكتب KDE Plasma مع مراقب الموارد ومحرر الشيفرة',
    label: 'بيئة KDE Plasma',
  },
  tiling: {
    src: '/src/assets/images/desktop_tiling_arch_1795259494824.jpg',
    alt: 'واجهة مدير النوافذ المتجانب Hyprland / Sway مع نوافذ الطرفية',
    label: 'مدير نوافذ متجانب (Tiling WM)',
  },
  server: {
    src: '/src/assets/images/linux_server_infrastructure_1795259494767.jpg',
    alt: 'خوادم لينكس وعنقود حوسبة ARM مفتوح المصدر',
    label: 'خوادم وبنية سحابية',
  },
  security: {
    src: '/src/assets/images/linux_security_terminal_1795259509760.jpg',
    alt: 'بيئة لينكس للأمن السيبراني واختبار الاختراق وتحليل الشبكات',
    label: 'أمن سيبراني وتحليل شبكات',
  },
};
