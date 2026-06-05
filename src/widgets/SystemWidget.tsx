import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';

type SystemWidgetProps = {
  label: string;
  value: string;
  detail?: string;
  accent?: 'cyan' | 'violet';
  Icon: LucideIcon;
};

const accentClasses = {
  cyan: 'from-cyan/[0.20] to-cyan/[0]',
  violet: 'from-violet/[0.20] to-violet/[0]',
};

const textAccentClasses = {
  cyan: 'text-cyan-soft',
  violet: 'text-violet-soft',
};

const iconAccentClasses = {
  cyan: 'border-cyan/[0.20] bg-cyan/[0.08] text-cyan-soft group-hover:border-cyan/[0.45] group-hover:shadow-[0_0_18px_rgba(34,211,238,0.22)]',
  violet:
    'border-violet/[0.20] bg-violet/[0.08] text-violet-soft group-hover:border-violet/[0.45] group-hover:shadow-[0_0_18px_rgba(139,92,246,0.22)]',
};

const SystemWidget = memo(({ label, value, detail, accent = 'cyan', Icon }: SystemWidgetProps) => (
  <section className="group rounded-2xl border border-white/10 bg-panel p-5 shadow-glow transition duration-200 hover:border-cyan/[0.30]">
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${accentClasses[accent]}`} />
      <div className={`rounded-xl border p-2 transition ${iconAccentClasses[accent]}`}>
        <Icon className="h-5 w-5 transition group-hover:drop-shadow-[0_0_8px_currentColor]" aria-hidden="true" strokeWidth={1.8} />
      </div>
    </div>
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">{label}</p>
    <div className="mt-3 flex items-end justify-between gap-4">
      <p className={`text-3xl font-semibold ${textAccentClasses[accent]}`}>{value}</p>
      {detail ? <p className="pb-1 text-xs text-white/[0.38]">{detail}</p> : null}
    </div>
  </section>
));

SystemWidget.displayName = 'SystemWidget';

export default SystemWidget;
