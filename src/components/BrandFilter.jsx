export default function BrandFilter({ brands, activeBrand, onChange }) {
  if (brands.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#fbfaf7] px-4 pb-3">
      <div className="mx-auto max-w-screen-sm overflow-x-auto scrollbar-none">
        <div className="flex min-w-max gap-2">
          {['全部品牌', ...brands].map((brand) => {
            const isActive = activeBrand === brand;

            return (
              <button
                key={brand}
                type="button"
                onClick={() => onChange(brand)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600'
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
