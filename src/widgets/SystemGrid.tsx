import { Battery, Clock3, Cpu, HardDrive, MemoryStick, Wifi } from 'lucide-react';
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
      <SystemWidget label="CPU" value={formatPercent(systemInfo.cpuUsage)} detail="/proc/stat" Icon={Cpu} />
      <SystemWidget label="RAM" value={formatPercent(systemInfo.ramUsage)} detail="/proc/meminfo" accent="violet" Icon={MemoryStick} />
      <SystemWidget label="Battery" value={formatPercent(systemInfo.batteryPercentage)} detail="power_supply" Icon={Battery} />
      <SystemWidget label="Uptime" value={formatUptime(systemInfo.uptimeSeconds)} detail="/proc/uptime" accent="violet" Icon={Clock3} />
      <SystemWidget label="Disk" value={formatPercent(systemInfo.diskUsage)} detail="root volume" Icon={HardDrive} />
      <SystemWidget label="Network" value={systemInfo.networkOnline ? 'Online' : 'Offline'} detail="net state" accent="violet" Icon={Wifi} />
    </div>
  </div>
));

SystemGrid.displayName = 'SystemGrid';

export default SystemGrid;
