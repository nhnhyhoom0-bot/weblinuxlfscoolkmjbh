import React, { useEffect } from 'react';
import { ExternalLink, Trash2, X } from 'lucide-react';
import type { Distro } from '../types/linux';
import { DistroEmblem } from './DistroVisual';

interface CompareModalProps {
  isOpen: boolean;
  distros: Distro[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onSelectDistro: (distro: Distro) => void;
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  distros,
  onRemove,
  onClearAll,
  onSelectDistro,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-stone-200 bg-[#FAF9F6] p-6 shadow-2xl sm:p-8 dark:border-slate-700 dark:bg-[#0E1116]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-4 dark:border-slate-800">
          <div>
            <h2 id="compare-modal-title" className="font-display text-xl font-bold text-stone-900 dark:text-slate-50">
              المقارنة الجانبية للتوزيعات ({distros.length}/3)
            </h2>
            <p className="mt-1 text-xs text-stone-600 dark:text-slate-400">
              قارن المواصفات التقنية ومتطلبات العتاد ومديري الحزم قبل التثبيت.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {distros.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                مسح الكل
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق نافذة المقارنة"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {distros.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-stone-600 dark:text-slate-400">
              لم تختر أي توزيعات للمقارنة بعد. اضغط على زر المقارنة في أي بطاقة توزيعة لإضافتها هنا (حتى 3 توزيعات).
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-right text-sm">
              <thead>
                <tr className="border-b border-stone-200 dark:border-slate-800">
                  <th className="w-40 py-3 pl-4 text-xs font-semibold text-stone-500 dark:text-slate-400">
                    المعيار
                  </th>
                  {distros.map((d) => (
                    <th key={d.id} className="px-4 py-3 align-top">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <DistroEmblem distro={d} size="sm" />
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSelectDistro(d);
                            }}
                            className="font-display text-base font-bold text-stone-900 hover:text-blue-700 hover:underline dark:text-slate-100"
                          >
                            {d.name}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(d.id)}
                          aria-label={`إزالة ${d.name} من المقارنة`}
                          className="rounded p-1 text-stone-400 hover:bg-stone-200 hover:text-red-600 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70 text-xs dark:divide-slate-800">
                <tr>
                  <td className="py-3 pl-4 font-semibold text-stone-600 dark:text-slate-400">العائلة الأم</td>
                  {distros.map((d) => (
                    <td key={d.id} className="px-4 py-3 text-stone-900 dark:text-slate-100">{d.family}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pl-4 font-semibold text-stone-600 dark:text-slate-400">التصنيف</td>
                  {distros.map((d) => (
                    <td key={d.id} className="px-4 py-3 text-stone-900 dark:text-slate-100">{d.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pl-4 font-semibold text-stone-600 dark:text-slate-400">مستوى الخبرة</td>
                  {distros.map((d) => (
                    <td key={d.id} className="px-4 py-3 text-stone-900 dark:text-slate-100">{d.difficulty}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pl-4 font-semibold text-stone-600 dark:text-slate-400">مدير الحزم</td>
                  {distros.map((d) => (
                    <td key={d.id} className="px-4 py-3 font-mono text-stone-900 dark:text-slate-100">{d.packageManager}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pl-4 font-semibold text-stone-600 dark:text-slate-400">نظام التمهيد</td>
                  {distros.map((d) => (
                    <td key={d.id} className="px-4 py-3 font-mono text-stone-900 dark:text-slate-100">{d.initSystem}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pl-4 font-semibold text-stone-600 dark:text-slate-400">نموذج التحديث</td>
                  {distros.map((d) => (
                    <td key={d.id} className="px-4 py-3 text-stone-900 dark:text-slate-100">{d.releaseModel}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pl-4 font-semibold text-stone-600 dark:text-slate-400">الواجهات</td>
                  {distros.map((d) => (
                    <td key={d.id} className="px-4 py-3 text-stone-900 dark:text-slate-100">
                      {d.desktopEnvironments.join('، ')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pl-4 font-semibold text-stone-600 dark:text-slate-400">أدنى RAM</td>
                  {distros.map((d) => (
                    <td key={d.id} className="px-4 py-3 font-mono tabular-nums text-stone-900 dark:text-slate-100">
                      {d.minRamMb} MB
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pl-4 font-semibold text-stone-600 dark:text-slate-400">أدنى قرص</td>
                  {distros.map((d) => (
                    <td key={d.id} className="px-4 py-3 font-mono tabular-nums text-stone-900 dark:text-slate-100">
                      {d.minDiskGb} GB
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pl-4 font-semibold text-stone-600 dark:text-slate-400">أمر التثبيت</td>
                  {distros.map((d) => (
                    <td key={d.id} className="px-4 py-3 font-mono text-[11px] text-blue-700 dark:text-blue-400" dir="ltr">
                      {d.installCommand}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pl-4 font-semibold text-stone-600 dark:text-slate-400">التحميل الرسمي</td>
                  {distros.map((d) => (
                    <td key={d.id} className="px-4 py-3">
                      <a
                        href={d.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline dark:text-blue-400"
                      >
                        <span>رابط التحميل</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
