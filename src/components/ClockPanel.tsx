import { memo } from 'react';
import type { TimeSnapshot } from '../modules/core/time';

type ClockPanelProps = {
  snapshot: TimeSnapshot;
};

const ClockPanel = memo(({ snapshot }: ClockPanelProps) => (
  <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-panel p-8 shadow-glow md:p-10">
    <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-cyan/[0.10] blur-3xl" />
    <div className="absolute bottom-0 left-16 h-32 w-32 rounded-full bg-violet/[0.10] blur-3xl" />
    <div className="relative">
      <p className="text-sm uppercase tracking-[0.38em] text-cyan/[0.70]">NOVAE Core v0.1</p>
      <h1 className="mt-6 text-7xl font-semibold leading-none tracking-[-0.06em] text-white md:text-8xl">{snapshot.clock}</h1>
      <div className="mt-6 flex flex-col gap-2 text-white/70 md:flex-row md:items-end md:justify-between">
        <p className="text-2xl font-medium text-white/[0.85]">{snapshot.greeting}</p>
        <p className="text-base text-white/[0.45]">{snapshot.date}</p>
      </div>
    </div>
  </section>
));

ClockPanel.displayName = 'ClockPanel';

export default ClockPanel;
