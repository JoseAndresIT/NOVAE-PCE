import { memo } from 'react';
import type { TimeSnapshot } from '../modules/core/time';

type ClockPanelProps = {
  snapshot: TimeSnapshot;
};

const ClockPanel = memo(({ snapshot }: ClockPanelProps) => (
  <section className="surface-transition relative overflow-hidden rounded-[2rem] border border-white/10 bg-panel p-8 shadow-glow hover:-translate-y-0.5 hover:scale-[1.005] hover:border-cyan/[0.35] hover:shadow-[0_0_42px_rgba(34,211,238,0.22)] md:p-10">
    <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-cyan/[0.10] blur-3xl" />
    <div className="absolute bottom-0 left-16 h-32 w-32 rounded-full bg-violet/[0.10] blur-3xl" />
    <div className="relative">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="clock-label-glow text-sm font-semibold uppercase tracking-[0.32em] text-cyan/[0.72]">NOVAE Core v0.1</p>
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.30em] text-white/[0.36]">personal environment online</p>
      </div>
      <h1 className="clock-text-glow mt-6 whitespace-nowrap text-[clamp(4.5rem,18vw,7rem)] font-semibold leading-none tracking-[-0.07em] text-white sm:text-[clamp(5.5rem,15vw,7.5rem)] md:text-[clamp(6rem,10vw,8rem)]">
        {snapshot.clock}
      </h1>
      <div className="mt-5 flex flex-col gap-2 text-white/65 md:flex-row md:items-end md:justify-between">
        <p className="text-xl font-medium text-white/[0.76] sm:text-2xl">{snapshot.greeting}</p>
        <p className="text-sm text-white/[0.50] sm:text-base">{snapshot.date}</p>
      </div>
    </div>
  </section>
));

ClockPanel.displayName = 'ClockPanel';

export default ClockPanel;
