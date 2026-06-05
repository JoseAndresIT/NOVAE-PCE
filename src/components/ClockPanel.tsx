import { memo } from 'react';
import type { TimeSnapshot } from '../modules/core/time';

type ClockPanelProps = {
  snapshot: TimeSnapshot;
};

const ClockPanel = memo(({ snapshot }: ClockPanelProps) => (
  <section className="novae-panel novae-edge-light rounded-[2rem] p-8 md:p-10">
    <div className="relative z-10">
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
