import { memo, useEffect } from 'react';

type StartupSequenceProps = {
  onComplete: () => void;
};

const BOOT_DURATION_MS = 2_800;
const REDUCED_MOTION_DURATION_MS = 250;

const StartupSequence = memo(({ onComplete }: StartupSequenceProps) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeout = window.setTimeout(
      onComplete,
      prefersReducedMotion ? REDUCED_MOTION_DURATION_MS : BOOT_DURATION_MS,
    );

    return () => window.clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div
      aria-label="NOVAE boot sequence"
      aria-live="polite"
      className="novae-startup fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black text-white"
      role="status"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2),transparent_34%),radial-gradient(circle_at_center,rgba(14,165,233,0.12),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:44px_44px] opacity-25" />
      <div className="novae-startup__panel relative flex flex-col items-center gap-5 px-6 text-center">
        <div className="novae-startup__mark grid h-28 w-28 place-items-center rounded-[2rem] border border-cyan-200/25 bg-cyan-300/5 shadow-[0_0_42px_rgba(34,211,238,0.34)] backdrop-blur-sm">
          <span className="font-display text-5xl font-semibold tracking-[0.18em] text-cyan-100 drop-shadow-[0_0_22px_rgba(103,232,249,0.75)]">
            NV
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-semibold tracking-[0.42em] text-cyan-50 drop-shadow-[0_0_20px_rgba(103,232,249,0.65)] md:text-4xl">
            NOVAE
          </p>
          <p className="novae-startup__text text-xs uppercase tracking-[0.28em] text-cyan-100/70">
            booting environment...
          </p>
        </div>
      </div>
    </div>
  );
});

StartupSequence.displayName = 'StartupSequence';

export default StartupSequence;
