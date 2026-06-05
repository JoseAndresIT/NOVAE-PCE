import { memo } from 'react';

const AmbientBackground = memo(() => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
    <div className="absolute inset-0 ambient-lighting" />
    <div className="absolute inset-0 ambient-grid" />
    <div className="absolute inset-0 ambient-vignette" />
  </div>
));

AmbientBackground.displayName = 'AmbientBackground';

export default AmbientBackground;
