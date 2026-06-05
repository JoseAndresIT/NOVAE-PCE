import { memo } from 'react';

const AmbientBackground = memo(() => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
    <div className="novae-ambient-glow absolute inset-[-12%] bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.13),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_28%)]" />
    <div className="novae-ambient-grid absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:52px_52px] opacity-35" />
  </div>
));

AmbientBackground.displayName = 'AmbientBackground';

export default AmbientBackground;
