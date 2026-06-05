import { Code2, Globe, Music2, RefreshCw, Terminal, type LucideIcon } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { runQuickAction, type QuickAction } from '../modules/core/system';

const actions: Array<{ label: string; action: QuickAction; Icon: LucideIcon }> = [
  { label: 'Open VSCode', action: 'vscode', Icon: Code2 },
  { label: 'Open Browser', action: 'browser', Icon: Globe },
  { label: 'Open Spotify', action: 'spotify', Icon: Music2 },
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
    <section className="surface-transition rounded-[2rem] border border-white/10 bg-panel p-6 shadow-violetGlow hover:-translate-y-0.5 hover:scale-[1.005] hover:border-violet/[0.35] hover:shadow-[0_0_38px_rgba(139,92,246,0.24)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-violet/[0.70]">Quick Actions</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Launch pad</h2>
        </div>
        <div className="h-2 w-2 rounded-full bg-violet shadow-[0_0_12px_rgba(139,92,246,0.55)]" />
      </div>
      <div className="grid gap-3">
        {actions.map((item) => {
          const { Icon } = item;

          return (
            <button
              key={item.action}
              onClick={() => void handleAction(item.action)}
              disabled={pendingAction !== null}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm font-semibold text-white/75 transition hover:border-cyan/[0.40] hover:bg-cyan/[0.10] hover:text-cyan hover:shadow-[0_0_20px_rgba(34,211,238,0.16)] disabled:cursor-wait disabled:opacity-55"
            >
              <Icon className="h-5 w-5 shrink-0 text-current transition group-hover:drop-shadow-[0_0_8px_currentColor]" aria-hidden="true" strokeWidth={1.8} />
              <span>{pendingAction === item.action ? 'Starting…' : item.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
