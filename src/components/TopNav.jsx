import { Home, MonitorSmartphone, ShoppingBag, Sparkles } from 'lucide-react';

const navItems = [
  { label: '首页', path: '/', icon: Home },
  { label: '美妆专区', path: '/beauty', icon: Sparkles },
  { label: '电子产品专区', path: '/electronics', icon: MonitorSmartphone },
];

export default function TopNav({ route, onNavigate, onOpenCart, cartCount }) {
  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200 bg-[#fbfaf7]/95 px-3 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-screen-sm items-center gap-2 overflow-x-auto scrollbar-none">
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = route === path;

          return (
            <button
              key={path}
              type="button"
              onClick={() => onNavigate(path)}
              className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold ${
                isActive ? 'bg-slate-950 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onOpenCart}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-white px-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
        >
          <ShoppingBag className="h-4 w-4" />
          询价清单
          {cartCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-xs text-white">
              {cartCount}
            </span>
          ) : null}
        </button>
      </div>
    </nav>
  );
}
