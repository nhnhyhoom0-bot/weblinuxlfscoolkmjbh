import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, Play, Terminal as TerminalIcon } from 'lucide-react';
import { LINUX_COMMANDS } from '../data/commands';
import type { Distro } from '../types/linux';
import { PACKAGE_TRANSLATIONS } from '../utils/distroLogic';
import { executeTerminalCommand } from '../utils/terminalEngine';

interface TerminalLabProps {
  distros: Distro[];
}

interface HistoryEntry {
  cwd: string;
  command: string;
  output: string[];
}

const PRESET_COMMANDS = [
  'fastfetch',
  'uname -a',
  'ls',
  'cat /etc/os-release',
  'free -h',
  'distro ubuntu',
  'help',
];

export const TerminalLab: React.FC<TerminalLabProps> = ({ distros }) => {
  const [cwd, setCwd] = useState('/home/linux');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      cwd: '/home/linux',
      command: 'fastfetch',
      output: executeTerminalCommand('fastfetch', '/home/linux', distros).output,
    },
  ]);
  const [cmdFilter, setCmdFilter] = useState('الكل');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const categories = ['الكل', ...Array.from(new Set(LINUX_COMMANDS.map((c) => c.category)))];
  const visibleCommands =
    cmdFilter === 'الكل'
      ? LINUX_COMMANDS
      : LINUX_COMMANDS.filter((c) => c.category === cmdFilter);

  const runCommand = (raw: string) => {
    const res = executeTerminalCommand(raw, cwd, distros);
    if (res.clear) {
      setHistory([]);
      setInput('');
      return;
    }
    const nextCwd = res.newCwd ?? cwd;
    setHistory((prev) => [...prev, { cwd, command: raw, output: res.output }]);
    setCwd(nextCwd);
    setInput('');
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCmd(text);
      setTimeout(() => setCopiedCmd(null), 1500);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <section aria-label="الطرفية التفاعلية وأهم أوامر لينكس" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-stone-200 pb-6 dark:border-slate-800">
        <p className="text-xs font-semibold tracking-wide text-stone-500 dark:text-slate-400">
          التطبيق العملي · سطر الأوامر ومقارنة مديري الحزم
        </p>
        <h2 className="font-display mt-2 text-2xl font-extrabold text-stone-900 sm:text-3xl dark:text-slate-50">
          الطرفية التفاعلية ومرجع أوامر لينكس
        </h2>
        <p className="mt-1 text-sm text-stone-600 dark:text-slate-400">
          جرّب أوامر لينكس مباشرة في المحاكي الآمن، أو استكشف كيف يتغير أمر تثبيت البرامج بين APT وPacman وDNF وZypper.
        </p>
      </div>

      {/* Interactive Simulated Terminal */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-300 bg-[#11151C] text-slate-100 shadow-lg dark:border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-[#171C26] px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <TerminalIcon className="h-4 w-4 text-blue-400" />
            <span className="font-mono">atlas-user@linux-atlas: {cwd}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESET_COMMANDS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => runCommand(preset)}
                className="rounded-md border border-slate-700 bg-slate-800/90 px-2.5 py-1 font-mono text-[11px] text-slate-200 transition-colors hover:border-blue-500 hover:text-white"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={outputRef}
          dir="ltr"
          className="max-h-96 min-h-[240px] space-y-3 overflow-y-auto p-5 font-mono text-xs leading-relaxed"
          data-testid="terminal-output"
        >
          {history.map((entry, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400">
                <span>atlas-user@linux:{entry.cwd}$</span>
                <span className="text-white">{entry.command}</span>
              </div>
              {entry.output.map((line, lIdx) => {
                const isArabicStart = /^[\u0600-\u06FF]/.test(line.trim());
                return (
                  <div
                    key={lIdx}
                    dir={isArabicStart ? 'rtl' : 'ltr'}
                    className={`whitespace-pre-wrap text-slate-300 ${isArabicStart ? 'text-right font-sans' : ''}`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) runCommand(input);
          }}
          className="flex items-center gap-2 border-t border-slate-800 bg-[#161B24] px-4 py-3"
          dir="ltr"
        >
          <label htmlFor="terminal-input" className="font-mono text-xs text-emerald-400">
            $
          </label>
          <input
            id="terminal-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب أمراً مثل: uname -a أو distro fedora أو help..."
            className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
          >
            <Play className="h-3 w-3" />
            <span>تنفيذ</span>
          </button>
        </form>
      </div>

      {/* Package Manager Side-by-Side Translator */}
      <div className="mt-12">
        <h3 className="font-display text-xl font-bold text-stone-900 dark:text-slate-100">
          مترجم أوامر مديري الحزم بين التوزيعات
        </h3>
        <p className="mt-1 text-sm text-stone-600 dark:text-slate-400">
          انتقلت من Ubuntu إلى Arch أو Fedora؟ هذا الجدول يلخص الأوامر المتكافئة عبر 6 أنظمة حزم شهيرة.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-white dark:border-slate-800 dark:bg-[#141922]">
          <table className="w-full min-w-[900px] border-collapse text-right text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                <th className="px-4 py-3 font-semibold">العملية</th>
                <th className="px-4 py-3 font-mono">APT (Debian/Ubuntu)</th>
                <th className="px-4 py-3 font-mono">Pacman (Arch)</th>
                <th className="px-4 py-3 font-mono">DNF (Fedora/RHEL)</th>
                <th className="px-4 py-3 font-mono">Zypper (openSUSE)</th>
                <th className="px-4 py-3 font-mono">APK (Alpine)</th>
                <th className="px-4 py-3 font-mono">Nix (NixOS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
              {PACKAGE_TRANSLATIONS.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/70 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-semibold text-stone-900 dark:text-slate-100">{row.action}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-blue-700 dark:text-blue-400" dir="ltr">{row.apt}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-stone-800 dark:text-slate-200" dir="ltr">{row.pacman}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-stone-800 dark:text-slate-200" dir="ltr">{row.dnf}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-stone-800 dark:text-slate-200" dir="ltr">{row.zypper}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-stone-800 dark:text-slate-200" dir="ltr">{row.apk}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-stone-800 dark:text-slate-200" dir="ltr">{row.nix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Essential Commands Reference */}
      <div className="mt-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h3 className="font-display text-xl font-bold text-stone-900 dark:text-slate-100">
            أهم أوامر لينكس اليومية
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCmdFilter(cat)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  cmdFilter === cat
                    ? 'bg-stone-900 text-white dark:bg-blue-600'
                    : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleCommands.map((item) => (
            <div
              key={item.command}
              className="rounded-xl border border-stone-200 bg-white p-5 dark:border-slate-800 dark:bg-[#141922]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-medium text-stone-500 dark:text-slate-400">
                    {item.category}
                  </span>
                  <h4 className="mt-0.5 font-mono text-base font-bold text-blue-700 dark:text-blue-400" dir="ltr">
                    {item.command}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(item.example)}
                  aria-label={`نسخ مثال ${item.command}`}
                  className="inline-flex items-center gap-1 rounded-md border border-stone-200 px-2.5 py-1 text-[11px] font-medium text-stone-600 hover:bg-stone-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {copiedCmd === item.example ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedCmd === item.example ? 'تم' : 'نسخ'}</span>
                </button>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-slate-300">
                {item.description}
              </p>
              <div
                dir="ltr"
                className="mt-3 rounded-lg bg-stone-100 px-3 py-2 font-mono text-xs text-stone-800 dark:bg-slate-900 dark:text-slate-200"
              >
                $ {item.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
