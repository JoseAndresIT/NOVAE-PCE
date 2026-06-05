import { memo } from 'react';
import { formatPercent, formatUptime, type SystemInfo } from '../modules/core/system';
import SystemWidget from './SystemWidget';

type SystemGridProps = {
  systemInfo: SystemInfo;
  isLoading: boolean;
  error: string | null;
};

const HIGH_USAGE_THRESHOLD = 85;

const getUsageTone = (value: number | null) => (value !== null && value >= HIGH_USAGE_THRESHOLD ? 'warn' : 'active');

const SystemGrid = memo(({ systemInfo, isLoading, error }: SystemGridProps) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.32em] text-cyan/[0.70]">System Telemetry</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Core status</h2>
      </div>
      <p className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/[0.45]">
        {isLoading ? 'Syncing' : error ? 'Degraded' : 'Live'}
      </p>
    </div>
    {error ? (
      <p className="rounded-xl border border-violet/[0.30] bg-violet/[0.10] px-4 py-3 text-sm text-violet-soft">{error}</p>
    ) : null}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <SystemWidget label="CPU" value={formatPercent(systemInfo.cpuUsage)} detail="/proc/stat" tone={getUsageTone(systemInfo.cpuUsage)} live />
      <SystemWidget
        label="RAM"
        value={formatPercent(systemInfo.ramUsage)}
        detail="/proc/meminfo"
        accent="violet"
        tone={getUsageTone(systemInfo.ramUsage)}
        live
      />
      <SystemWidget label="Battery" value={formatPercent(systemInfo.batteryPercentage)} detail="power_supply" tone="calm" live />
      <SystemWidget
        label="Uptime"
        value={formatUptime(systemInfo.uptimeSeconds)}
        detail="/proc/uptime"
        accent="violet"
        tone="calm"
        live
      />
      <SystemWidget label="Disk" value={formatPercent(systemInfo.diskUsage)} detail="root volume" tone={getUsageTone(systemInfo.diskUsage)} live />
      <SystemWidget
        label="Network"
        value={systemInfo.networkOnline ? 'Online' : 'Offline'}
        detail="net state"
        accent="violet"
        tone={systemInfo.networkOnline ? 'active' : 'calm'}
        live
      />
    </div>
  </div>
));

SystemGrid.displayName = 'SystemGrid';

export default SystemGrid;
