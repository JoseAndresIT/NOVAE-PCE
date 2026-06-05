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

const SystemWidget = memo(({ label, value, detail, accent = 'cyan' }: SystemWidgetProps) => (
  <section className="group rounded-2xl border border-white/10 bg-panel p-5 shadow-glow transition duration-200 hover:border-cyan/[0.30]">
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
