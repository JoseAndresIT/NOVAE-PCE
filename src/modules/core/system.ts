import { invoke } from '@tauri-apps/api/core';

export type SystemInfo = {
  cpuUsage: number;
  ramUsage: number;
  batteryPercentage: number | null;
  uptimeSeconds: number;
  diskUsage: number;
  networkOnline: boolean;
};

export type QuickAction = 'vscode' | 'browser' | 'spotify' | 'terminal' | 'reload_hyprland';

export type QuickActionResponse = {
  action: QuickAction;
  started: boolean;
  message: string;
};

export const fallbackSystemInfo: SystemInfo = {
  cpuUsage: 0,
  ramUsage: 0,
  batteryPercentage: null,
  uptimeSeconds: 0,
  diskUsage: 0,
  networkOnline: false,
};

export const getSystemInfo = () => invoke<SystemInfo>('get_system_info');

export const runQuickAction = (action: QuickAction) =>
  invoke<QuickActionResponse>('run_quick_action', { action });

export const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

export const formatPercent = (value: number | null) => {
  if (value === null || Number.isNaN(value)) {
    return 'N/A';
  }

  return `${Math.round(value)}%`;
};
