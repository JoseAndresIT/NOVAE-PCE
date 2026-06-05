import { memo, type ComponentType } from 'react';

type SystemWidgetProps = {
  label: string;
  value: string;
  detail?: string;
  accent?: 'cyan' | 'violet';
  icon?: ComponentType<{ className?: string }>;
  tone?: 'calm' | 'active' | 'warn';
  live?: boolean;
};

const accentClasses = {
  cyan: 'from-cyan/[0.20] to-cyan/[0]',
  violet: 'from-violet/[0.20] to-violet/[0]',
};

const textAccentClasses = {
  cyan: 'text-cyan-soft',
  violet: 'text-violet-soft',
};

const liveDotClasses = {
  cyan: 'bg-cyan shadow-[0_0_12px_rgba(34,211,238,0.9)]',
  violet: 'bg-violet shadow-[0_0_12px_rgba(139,92,246,0.9)]',
};

const toneClasses = {
  calm: {
    section: 'hover:border-white/20',
    icon: 'text-white/45',
    value: '',
  },
  active: {
    section: 'hover:border-cyan/[0.30]',
    icon: '',
    value: '',
  },
  warn: {
    section: 'border-amber-300/20 hover:border-amber-300/40',
    icon: 'text-amber-200/80',
    value: 'text-amber-200',
  },
};

const warnAccentClass = 'from-amber-300/[0.24] to-amber-300/[0]';
const warnLiveDotClass = 'bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.9)]';

const SystemWidget = memo(
  ({ label, value, detail, accent = 'cyan', icon: Icon, tone = 'calm', live = false }: SystemWidgetProps) => {
    const isWarn = tone === 'warn';
    const valueClass = isWarn ? toneClasses.warn.value : textAccentClasses[accent];
    const iconClass = isWarn ? toneClasses.warn.icon : toneClasses[tone].icon || textAccentClasses[accent];

    return (
      <section
        className={`group rounded-2xl border border-white/10 bg-panel p-5 shadow-glow transition duration-200 ${toneClasses[tone].section}`}
      >
        <div className={`mb-5 h-1 w-12 rounded-full bg-gradient-to-r ${isWarn ? warnAccentClass : accentClasses[accent]}`} />
        <div className="flex items-center gap-2">
          {Icon ? <Icon className={`h-3.5 w-3.5 ${iconClass}`} /> : null}
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">{label}</p>
          {live ? (
            <span
              className={`h-1.5 w-1.5 rounded-full transition-opacity ${isWarn ? warnLiveDotClass : liveDotClasses[accent]}`}
              aria-label={`${label} live`}
            />
          ) : null}
        </div>
        <div className="mt-3 flex items-end justify-between gap-4">
          <p
            className={`text-3xl font-semibold transition-colors transition-opacity transition-transform group-hover:-translate-y-0.5 ${valueClass}`}
          >
            {value}
          </p>
          {detail ? <p className="pb-1 text-xs text-white/[0.38]">{detail}</p> : null}
        </div>
      </section>
    );
  },
);

SystemWidget.displayName = 'SystemWidget';

export default SystemWidget;
