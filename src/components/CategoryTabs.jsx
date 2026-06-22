export default function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="bg-[#fbfaf7] px-4 pb-3">
      <div className="mx-auto max-w-screen-sm overflow-x-auto scrollbar-none">
        <div className="flex min-w-max gap-2">
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => onChange(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
