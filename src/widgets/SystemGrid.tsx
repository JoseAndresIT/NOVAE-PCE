import { memo } from 'react';
import { formatPercent, formatUptime, type SystemInfo } from '../modules/core/system';
import SystemWidget from './SystemWidget';

type SystemGridProps = {
  systemInfo: SystemInfo;
  isLoading: boolean;
  error: string | null;
};

type TelemetryWidgetDefinition = {
  label: string;
  detail: string;
  accent?: 'cyan' | 'violet';
  getValue: (systemInfo: SystemInfo) => string;
};

const TELEMETRY_WIDGETS: ReadonlyArray<TelemetryWidgetDefinition> = [
  { label: 'CPU', detail: '/proc/stat', getValue: (systemInfo) => formatPercent(systemInfo.cpuUsage) },
  {
    label: 'RAM',
    detail: '/proc/meminfo',
    accent: 'violet',
    getValue: (systemInfo) => formatPercent(systemInfo.ramUsage),
  },
  { label: 'Battery', detail: 'power_supply', getValue: (systemInfo) => formatPercent(systemInfo.batteryPercentage) },
  {
    label: 'Uptime',
    detail: '/proc/uptime',
    accent: 'violet',
    getValue: (systemInfo) => formatUptime(systemInfo.uptimeSeconds),
  },
  { label: 'Disk', detail: 'root volume', getValue: (systemInfo) => formatPercent(systemInfo.diskUsage) },
  {
    label: 'Network',
    detail: 'net state',
    accent: 'violet',
    getValue: (systemInfo) => (systemInfo.networkOnline ? 'Online' : 'Offline'),
  },
];

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
      {TELEMETRY_WIDGETS.map((widget) => (
        <SystemWidget
          key={widget.label}
          label={widget.label}
          value={widget.getValue(systemInfo)}
          detail={widget.detail}
          accent={widget.accent}
        />
      ))}
    </div>
  </div>
));

SystemGrid.displayName = 'SystemGrid';

export default SystemGrid;
