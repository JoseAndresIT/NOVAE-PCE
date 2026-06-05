import { Brain, Code2, Cpu, RefreshCw, Workflow, type LucideIcon } from 'lucide-react';
import { memo } from 'react';

const navItems: Array<{ label: string; status: 'active' | 'soon'; Icon: LucideIcon }> = [
  { label: 'Core', status: 'active', Icon: Cpu },
  { label: 'AI', status: 'soon', Icon: Brain },
  { label: 'Flow', status: 'soon', Icon: Workflow },
  { label: 'Sync', status: 'soon', Icon: RefreshCw },
  { label: 'Dev', status: 'soon', Icon: Code2 },
];

const Sidebar = memo(() => (
  <aside className="flex h-full w-24 shrink-0 flex-col items-center border-r border-white/10 bg-black/40 py-6 md:w-28">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan/30 bg-cyan/[0.10] text-sm font-black tracking-widest text-cyan shadow-glow">
      NV
    </div>
    <p className="mt-3 rotate-0 text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-white/[0.45]">NOVAE</p>
    <nav className="mt-10 flex w-full flex-1 flex-col items-center gap-3 px-3">
      {SIDEBAR_NAV_ITEMS.map((item) => {
        const active = item.status === 'active';
        const { Icon } = item;

        return (
          <button
            key={item.label}
            disabled={!active}
            className={`group w-full rounded-2xl border px-2 py-3 text-xs font-semibold transition ${
              active
                ? 'border-cyan/[0.35] bg-cyan/[0.10] text-cyan shadow-glow hover:border-cyan/[0.50] hover:bg-cyan/[0.14] hover:shadow-[0_0_22px_rgba(34,211,238,0.22)]'
                : 'cursor-not-allowed border-white/5 bg-white/[0.02] text-white/[0.25]'
            }`}
            title={active ? 'Core active' : `${item.label} coming soon`}
          >
            <Icon className="mx-auto mb-2 h-5 w-5 text-current transition group-hover:drop-shadow-[0_0_8px_currentColor]" aria-hidden="true" strokeWidth={1.8} />
            <span className="block">{item.label}</span>
            {!active ? <span className="mt-1 block text-[0.55rem] uppercase tracking-widest">Soon</span> : null}
          </button>
        );
      })}
    </nav>
    <div className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_16px_rgba(34,211,238,0.8)]" />
  </aside>
));

Sidebar.displayName = 'Sidebar';

export default Sidebar;
