import { memo } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';

const App = memo(() => (
  <div className="min-h-screen overflow-hidden bg-matte font-display text-white antialiased">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.13),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_28%)]" />
    <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:52px_52px] opacity-35" />
    <div className="relative flex min-h-screen">
      <Sidebar />
      <Dashboard />
    </div>
  </div>
));

App.displayName = 'App';

export default App;
