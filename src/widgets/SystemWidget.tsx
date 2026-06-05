import { memo } from 'react';

type SystemWidgetProps = {
  label: string;
  value: string;
  detail?: string;
  accent?: 'cyan' | 'violet';
};

const accentClasses = {
  cyan: 'from-cyan/[0.20] to-cyan/[0]',
  violet: 'from-violet/[0.20] to-violet/[0]',
};

const textAccentClasses = {
  cyan: 'text-cyan-soft',
  violet: 'text-violet-soft',
};

const hoverAccentClasses = {
  cyan: 'hover:border-cyan/[0.38] hover:shadow-[0_0_38px_rgba(34,211,238,0.22)]',
  violet: 'hover:border-violet/[0.38] hover:shadow-[0_0_38px_rgba(139,92,246,0.22)]',
};

const SystemWidget = memo(({ label, value, detail, accent = 'cyan' }: SystemWidgetProps) => (
  <section
    className={`group surface-transition rounded-2xl border border-white/10 bg-panel p-5 shadow-glow hover:-translate-y-0.5 hover:scale-[1.005] ${hoverAccentClasses[accent]}`}
  >
    <div className={`mb-5 h-1 w-12 rounded-full bg-gradient-to-r ${accentClasses[accent]}`} />
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">{label}</p>
    <div className="mt-3 flex items-end justify-between gap-4">
      <p className={`text-3xl font-semibold ${textAccentClasses[accent]}`}>{value}</p>
      {detail ? <p className="pb-1 text-xs text-white/[0.38]">{detail}</p> : null}
    </div>
  </section>
));

SystemWidget.displayName = 'SystemWidget';

export default SystemWidget;
