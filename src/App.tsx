import { memo, useCallback, useState } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import StartupSequence from './components/StartupSequence';

const App = memo(() => {
  const [booted, setBooted] = useState(false);
  const handleStartupComplete = useCallback(() => setBooted(true), []);

  return (
    <div className="min-h-screen overflow-hidden bg-matte font-display text-white antialiased">
      {!booted && <StartupSequence onComplete={handleStartupComplete} />}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.13),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_28%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:52px_52px] opacity-35" />
      <div
        className={`relative flex min-h-screen transform-gpu transition-all duration-700 ease-out motion-reduce:transition-none ${
          booted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <Sidebar />
        <Dashboard />
      </div>
    </div>
  );
});

App.displayName = 'App';

export default App;
