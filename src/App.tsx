import { memo } from 'react';
import AmbientBackground from './components/AmbientBackground';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';

const App = memo(() => (
  <div className="min-h-screen overflow-hidden bg-matte font-display text-white antialiased">
    <AmbientBackground />
    <div className="relative flex min-h-screen">
      <Sidebar />
      <Dashboard />
    </div>
  </div>
));

App.displayName = 'App';

export default App;
