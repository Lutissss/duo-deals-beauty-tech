import { Home, MonitorSmartphone, Search, ShoppingBag, Sparkles, UserRound, X } from 'lucide-react';

const navItems = [
  { label: '首页', path: '/', icon: Home },
  { label: '美妆专区', path: '/beauty', icon: Sparkles },
  { label: '电子产品专区', path: '/electronics', icon: MonitorSmartphone },
];

export default function TopNav({ route, onNavigate, onOpenCart, cartCount, searchTerm = '', onSearchChange }) {
  const showSearch = route === '/beauty' || route === '/electronics' || route.startsWith('/electronics/');

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 px-3 py-2 shadow-sm shadow-slate-200/40 backdrop-blur">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-white px-1 text-slate-950"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <span className="max-w-[140px] truncate text-lg font-black tracking-tight text-slate-950 sm:max-w-none sm:text-xl">
              Duo Deals
            </span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map(({ label, path }) => {
              const isActive = route === path || (path !== '/' && route.startsWith(`${path}/`));

              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => onNavigate(path)}
                  className={`h-10 rounded-full px-4 text-sm font-bold transition ${
                    isActive ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {showSearch ? (
            <label className="ml-auto hidden h-12 min-w-0 max-w-md flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 shadow-inner shadow-slate-200/40 focus-within:border-slate-400 md:flex">
              <Search className="h-5 w-5 shrink-0 text-slate-500" />
              <input
                value={searchTerm}
                onChange={(event) => onSearchChange?.(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-500"
                placeholder="Search products, brands..."
                type="search"
                inputMode="search"
              />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => onSearchChange?.('')}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200"
                  aria-label="清空搜索"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </label>
          ) : (
            <div className="ml-auto" />
          )}

          <button
            type="button"
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm md:flex"
            aria-label="账号"
          >
            <UserRound className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm"
            aria-label="询价清单"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 md:hidden scrollbar-none">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = route === path || (path !== '/' && route.startsWith(`${path}/`));

            return (
            <button
              key={path}
              type="button"
              onClick={() => onNavigate(path)}
              className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-bold ${
                isActive ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
            );
          })}
        </div>

        {showSearch ? (
          <label className="mt-2 flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 focus-within:border-slate-400 md:hidden">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange?.(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-500"
              placeholder="搜索商品、品牌、分类"
              type="search"
              inputMode="search"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => onSearchChange?.('')}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200"
                aria-label="清空搜索"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </label>
        ) : null}
      </div>
    </nav>
  );
}
