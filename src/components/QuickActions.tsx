import { memo, useCallback, useMemo, useState } from 'react';
import { Code2, Globe, Music, RefreshCw, Terminal, type LucideIcon } from 'lucide-react';
import { runQuickAction, type QuickAction } from '../modules/core/system';

type QuickActionItem = {
  label: string;
  action: QuickAction;
  Icon: LucideIcon;
};

type StatusState = 'ready' | 'starting' | 'started' | 'error';

const actions: QuickActionItem[] = [
  { label: 'Open VSCode', action: 'vscode', Icon: Code2 },
  { label: 'Open Browser', action: 'browser', Icon: Globe },
  { label: 'Open Spotify', action: 'spotify', Icon: Music },
  { label: 'Open Terminal', action: 'terminal', Icon: Terminal },
  { label: 'Reload Hyprland', action: 'reload_hyprland', Icon: RefreshCw },
];

const actionLabels = actions.reduce(
  (labels, item) => ({ ...labels, [item.action]: item.label }),
  {} as Record<QuickAction, string>,
);

const QuickActions = memo(() => {
  const [pendingAction, setPendingAction] = useState<QuickAction | null>(null);
  const [lastAction, setLastAction] = useState<QuickAction | null>(null);
  const [status, setStatus] = useState<StatusState>('ready');

  const statusText = useMemo(() => {
    if (status === 'starting') {
      return 'Starting…';
    }

    if (status === 'started') {
      return lastAction ? `Started · ${actionLabels[lastAction]}` : 'Started';
    }

    if (status === 'error') {
      return 'Error · Try again';
    }

    return lastAction ? `Ready · Last ${actionLabels[lastAction]}` : 'Ready';
  }, [lastAction, status]);

  const handleAction = useCallback(async (action: QuickAction) => {
    setPendingAction(action);
    setStatus('starting');

    try {
      const response = await runQuickAction(action);
      if (response.started) {
        setLastAction(response.action);
        setStatus('started');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setPendingAction(null);
    }
  }, []);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-panel p-6 shadow-violetGlow">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-violet/[0.70]">Quick Actions</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Launch pad</h2>
        </div>
        <div className="h-2 w-2 rounded-full bg-violet shadow-[0_0_14px_rgba(139,92,246,0.9)]" />
      </div>
      <div className="grid gap-3">
        {actions.map(({ action, Icon, label }) => {
          const isPending = pendingAction === action;

          return (
            <button
              key={action}
              onClick={() => void handleAction(action)}
              disabled={pendingAction !== null}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm font-semibold text-white/75 shadow-[0_0_0_rgba(34,211,238,0)] transition duration-200 hover:border-cyan/[0.55] hover:bg-cyan/[0.10] hover:text-cyan hover:shadow-[0_0_22px_rgba(34,211,238,0.18)] active:scale-[0.99] disabled:cursor-wait disabled:opacity-50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/55 transition group-hover:border-cyan/[0.45] group-hover:text-cyan">
                <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
              </span>
              <span>{isPending ? 'Starting…' : label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex min-h-8 items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/[0.48]">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            status === 'error'
              ? 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.75)]'
              : status === 'starting'
                ? 'bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.75)]'
                : 'bg-cyan shadow-[0_0_10px_rgba(34,211,238,0.75)]'
          }`}
        />
        <span>{statusText}</span>
      </div>
    </section>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
