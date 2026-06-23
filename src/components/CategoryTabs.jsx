import {
  Apple,
  Boxes,
  Brush,
  Flower2,
  Headphones,
  Home,
  Package,
  PackageCheck,
  Sparkles,
  SprayCan,
  Wind,
} from 'lucide-react';

const categoryIcons = {
  全部: Boxes,
  护肤: Sparkles,
  彩妆: Brush,
  香水: SprayCan,
  套装: Package,
  现货: PackageCheck,
  预订: Flower2,
  Apple,
  Dyson: Wind,
  Switch: Headphones,
  数码配件: Headphones,
  家用电器: Home,
};

export default function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="border-b border-slate-200/80 bg-white px-4 py-5">
      <div className="mx-auto max-w-7xl overflow-x-auto scrollbar-none">
        <div className="flex min-w-max justify-between gap-5 md:gap-9">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const Icon = categoryIcons[category] || Boxes;

            return (
              <button
                key={category}
                type="button"
                onClick={() => onChange(category)}
                className="group flex w-20 shrink-0 flex-col items-center gap-2 text-center"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full border text-slate-950 shadow-sm transition ${
                    isActive
                      ? 'border-slate-950 bg-slate-950 text-white shadow-slate-300'
                      : 'border-slate-200 bg-slate-50 group-hover:border-slate-300 group-hover:bg-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className={`text-xs font-bold leading-4 ${isActive ? 'text-slate-950' : 'text-slate-600'}`}>
                  {category}
                </span>
                <span className={`h-0.5 w-9 rounded-full ${isActive ? 'bg-slate-950' : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
