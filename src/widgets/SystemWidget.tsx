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

const panelAccentClasses = {
  cyan: '',
  violet: 'novae-panel-violet',
};

const SystemWidget = memo(({ label, value, detail, accent = 'cyan' }: SystemWidgetProps) => (
  <section className={`novae-panel novae-panel-hover novae-edge-light group rounded-2xl p-5 ${panelAccentClasses[accent]}`}>
    <div className="relative z-10">
      <div className={`mb-5 h-1 w-12 rounded-full bg-gradient-to-r ${accentClasses[accent]}`} />
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <p className={`text-3xl font-semibold ${textAccentClasses[accent]}`}>{value}</p>
        {detail ? <p className="pb-1 text-xs text-white/[0.38]">{detail}</p> : null}
      </div>
    </div>
  </section>
));

SystemWidget.displayName = 'SystemWidget';

export default SystemWidget;
