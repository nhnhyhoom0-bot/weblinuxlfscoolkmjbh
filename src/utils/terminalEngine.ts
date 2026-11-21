import type { Distro } from '../types/linux';

export interface TerminalResult {
  output: string[];
  clear?: boolean;
  newCwd?: string;
}

const VIRTUAL_FS: Record<string, string[]> = {
  '/home/linux': ['Desktop/', 'Documents/', 'Downloads/', 'distros-notes.txt', 'install-guide.md'],
  '/etc': ['os-release', 'fstab', 'hosts', 'resolv.conf'],
  '/': ['bin/', 'boot/', 'dev/', 'etc/', 'home/', 'lib/', 'mnt/', 'proc/', 'root/', 'tmp/', 'usr/', 'var/'],
};

export function executeTerminalCommand(
  rawInput: string,
  cwd: string,
  distros: Distro[]
): TerminalResult {
  const input = rawInput.trim();
  if (!input) {
    return { output: [] };
  }

  const parts = input.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ');

  switch (cmd) {
    case 'clear':
      return { output: [], clear: true };

    case 'help':
      return {
        output: [
          'الأوامر المتاحة في المحاكي:',
          '  help                    عرض قائمة الأوامر المتاحة',
          '  uname -a                عرض معلومات نواة لينكس والمعمارية',
          '  neofetch / fastfetch    عرض بطاقة مواصفات النظام',
          '  ls                      استعراض محتويات المجلد الحالي',
          '  pwd                     عرض المسار الحالي',
          '  cd <path>               تغيير المجلد (مثل cd /etc أو cd ~)',
          '  cat /etc/os-release     قراءة ملف تعريف التوزيعة',
          '  free -h                 عرض حالة الذاكرة العشوائية RAM',
          '  df -h                   عرض المساحات التخزينية',
          '  whoami                  عرض اسم المستخدم الحالي',
          '  distro <name>           البحث السريع عن توزيعة في قاعدة الـ 300 توزيعة',
          '  clear                   مسح شاشة الطرفية',
        ],
      };

    case 'whoami':
      return { output: ['atlas-user'] };

    case 'pwd':
      return { output: [cwd] };

    case 'uname':
      return {
        output: [
          arg.includes('-a')
            ? 'Linux atlas-workstation 6.12.4-generic #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux'
            : 'Linux',
        ],
      };

    case 'ls': {
      const target = arg && VIRTUAL_FS[arg] ? arg : cwd;
      const items = VIRTUAL_FS[target];
      if (!items) {
        return { output: [`ls: cannot access '${arg}': No such file or directory`] };
      }
      return { output: [items.join('   ')] };
    }

    case 'cd': {
      if (!arg || arg === '~') {
        return { output: [], newCwd: '/home/linux' };
      }
      if (VIRTUAL_FS[arg]) {
        return { output: [], newCwd: arg };
      }
      return { output: [`bash: cd: ${arg}: No such file or directory`] };
    }

    case 'cat': {
      if (arg === '/etc/os-release') {
        return {
          output: [
            'NAME="Atlas Linux Reference"',
            'VERSION="2026 LTS"',
            'ID=linux-atlas',
            'PRETTY_NAME="Atlas Linux Encyclopedia (300 Distros)"',
            'HOME_URL="https://kernel.org/"',
          ],
        };
      }
      if (arg === 'distros-notes.txt') {
        return {
          output: [
            `إجمالي التوزيعات الموثقة في هذا الأطلس: ${distros.length} توزيعة لينكس.`,
            'استخدم الأمر: distro ubuntu أو distro arch للبحث الفوري.',
          ],
        };
      }
      return { output: [`cat: ${arg || '<file>'}: No such file or directory`] };
    }

    case 'free':
      return {
        output: [
          '               total        used        free      shared  buff/cache   available',
          'Mem:            16Gi       2.1Gi      10.4Gi       280Mi       3.5Gi      13.6Gi',
          'Swap:          4.0Gi          0B       4.0Gi',
        ],
      };

    case 'df':
      return {
        output: [
          'Filesystem      Size  Used Avail Use% Mounted on',
          '/dev/nvme0n1p2  476G   42G  410G  10% /',
          '/dev/nvme0n1p1  512M   48M  464M  10% /boot/efi',
        ],
      };

    case 'neofetch':
    case 'fastfetch':
      return {
        output: [
          '        .--.          atlas-user@linux-atlas',
          '       |o_o |         ----------------------',
          '       |:_/ |         Kernel: Linux 6.12.4 x86_64',
          '      //   \\ \\        Shell: bash 5.2.32',
          '     (|     | )       DE: GNOME / KDE / Hyprland',
          `    /'\\_   _/'\\       Catalog: ${distros.length} Distributions`,
          '    \\___)=(___/       License: GNU GPLv2 / Open Source',
        ],
      };

    case 'distro': {
      if (!arg) {
        return { output: ['الاستخدام: distro <اسم التوزيعة> (مثال: distro fedora)'] };
      }
      const match = distros.find((d) =>
        d.name.toLowerCase().includes(arg.toLowerCase()) ||
        d.id.toLowerCase().includes(arg.toLowerCase())
      );
      if (!match) {
        return { output: [`لم يتم العثور على توزيعة تطابق "${arg}". جرّب البحث من شريط التوزيعات.`] };
      }
      return {
        output: [
          `[${match.rank}] ${match.name} (${match.family}) — ${match.tagline}`,
          `  مدير الحزم: ${match.packageManager} | التحديث: ${match.releaseModel} | الصعوبة: ${match.difficulty}`,
          `  أمر التثبيت: ${match.installCommand}`,
          `  الموقع الرسمي: ${match.officialUrl}`,
        ],
      };
    }

    default:
      return {
        output: [`bash: ${cmd}: command not found — اكتب "help" لاستعراض الأوامر المدعومة.`],
      };
  }
}
