import { memo, useCallback, useState } from 'react';
import { runQuickAction, type QuickAction } from '../modules/core/system';

const QUICK_ACTIONS: ReadonlyArray<{ label: string; action: QuickAction }> = [
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
    <section className="novae-panel novae-panel-violet novae-edge-light rounded-[2rem] p-6">
      <div className="relative z-10 mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-violet/[0.70]">Quick Actions</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Launch pad</h2>
        </div>
        <div className="h-2 w-2 rounded-full bg-violet shadow-[0_0_12px_rgba(139,92,246,0.55)]" />
      </div>
      <div className="relative z-10 grid gap-3">
        {actions.map((item) => (
          <button
            key={item.action}
            onClick={() => void handleAction(item.action)}
            disabled={pendingAction !== null}
            className="novae-panel-hover rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm font-semibold text-white/75 hover:bg-cyan/[0.10] hover:text-cyan disabled:cursor-wait disabled:opacity-55"
          >
            {pendingAction === item.action ? 'Starting…' : item.label}
          </button>
        ))}
      </div>
      <p className="relative z-10 mt-5 min-h-5 text-xs text-white/[0.42]">{message}</p>
    </section>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
