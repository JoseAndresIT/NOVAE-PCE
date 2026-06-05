import { memo, useEffect, useState } from 'react';
import { getTimeSnapshot, type TimeSnapshot } from '../modules/core/time';
import { fallbackSystemInfo, getSystemInfo, type SystemInfo } from '../modules/core/system';
import ClockPanel from './ClockPanel';
import QuickActions from './QuickActions';
import SystemGrid from '../widgets/SystemGrid';

const SYSTEM_POLL_MS = 4_000;
const CLOCK_POLL_MS = 1_000;

const Dashboard = memo(() => {
  const [timeSnapshot, setTimeSnapshot] = useState<TimeSnapshot>(() => getTimeSnapshot());
  const [systemInfo, setSystemInfo] = useState<SystemInfo>(fallbackSystemInfo);
  const [isSystemLoading, setIsSystemLoading] = useState(true);
  const [systemError, setSystemError] = useState<string | null>(null);

  useEffect(() => {
    const clockInterval = window.setInterval(() => {
      setTimeSnapshot(getTimeSnapshot());
    }, CLOCK_POLL_MS);

    return () => window.clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const refreshSystemInfo = async () => {
      try {
        const nextInfo = await getSystemInfo();

        if (!isMounted) {
          return;
        }

        setSystemInfo(nextInfo);
        setSystemError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Unable to read system telemetry.';
        setSystemError(message);
      } finally {
        if (isMounted) {
          setIsSystemLoading(false);
        }
      }
    };

    void refreshSystemInfo();
    const systemInterval = window.setInterval(() => void refreshSystemInfo(), SYSTEM_POLL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(systemInterval);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-1 flex-col gap-6 overflow-hidden p-5 md:p-8">
      <ClockPanel snapshot={timeSnapshot} />
      <div className="grid flex-1 gap-6 xl:grid-cols-[1fr_22rem]">
        <SystemGrid systemInfo={systemInfo} isLoading={isSystemLoading} error={systemError} />
        <QuickActions />
      </div>
    </main>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
