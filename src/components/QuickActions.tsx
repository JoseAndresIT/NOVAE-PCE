import { memo, useCallback, useState } from 'react';
import { runQuickAction, type QuickAction } from '../modules/core/system';

const actions: Array<{ label: string; action: QuickAction }> = [
  { label: 'Open VSCode', action: 'vscode' },
  { label: 'Open Browser', action: 'browser' },
  { label: 'Open Spotify', action: 'spotify' },
  { label: 'Open Terminal', action: 'terminal' },
  { label: 'Reload Hyprland', action: 'reload_hyprland' },
];

const QuickActions = memo(() => {
  const [pendingAction, setPendingAction] = useState<QuickAction | null>(null);
  const [message, setMessage] = useState('Ready for dispatch.');

  const handleAction = useCallback(async (action: QuickAction) => {
    setPendingAction(action);

    try {
      const response = await runQuickAction(action);
      setMessage(response.message);
    } catch (error) {
      const fallback =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
            ? String(error.message)
            : 'Action failed.';
      setMessage(fallback);
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
        <div className="h-2 w-2 rounded-full bg-violet shadow-[0_0_14px_rgba(139,92,246,0.9)]" />
      </div>
      <div className="grid gap-3">
        {actions.map((item) => (
          <button
            key={item.action}
            onClick={() => void handleAction(item.action)}
            disabled={pendingAction !== null}
            className="surface-transition rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm font-semibold text-white/75 hover:-translate-y-0.5 hover:scale-[1.005] hover:border-cyan/[0.45] hover:bg-cyan/[0.10] hover:text-cyan hover:shadow-[0_0_24px_rgba(34,211,238,0.18)] disabled:cursor-wait disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:border-white/10 disabled:hover:bg-white/[0.03] disabled:hover:text-white/75 disabled:hover:shadow-none"
          >
            {pendingAction === item.action ? 'Starting…' : item.label}
          </button>
        ))}
      </div>
      <p className="mt-5 min-h-5 text-xs text-white/[0.42]">{message}</p>
    </section>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
