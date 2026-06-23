import { useMemo, useState } from 'react';
import { MessageCircle, Plus } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onInquiry }) {
  const defaultOptions = useMemo(
    () =>
      Object.fromEntries(
        (product.optionGroups || []).map((group) => [group.name, group.values[0]]),
      ),
    [product.optionGroups],
  );
  const [selectedOptions, setSelectedOptions] = useState(defaultOptions);
  const statusClass =
    product.status === '现货'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : 'bg-[#fff7e6] text-amber-800 ring-amber-200';
  const optionSpec = Object.values(selectedOptions).filter(Boolean).join(' / ');
  const selectedProduct = {
    ...product,
    cartId: optionSpec ? `${product.id}-${optionSpec}` : product.id,
    selectedOptions,
    spec: optionSpec ? `${product.spec} / ${optionSpec}` : product.spec,
  };

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="relative bg-[#f5f1ea]">
        <img src={product.image} alt={product.name} className="aspect-[1.9/1] w-full object-cover" loading="lazy" />
        <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-slate-900 shadow-sm">
          {product.section}
        </span>
      </div>

      <div className="space-y-1 p-1.5">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate rounded-full bg-[#f3efe8] px-2 py-0.5 text-[10px] font-medium text-slate-700">{product.category}</span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${statusClass}`}>{product.status}</span>
        </div>

        <div>
          <p className="truncate text-[10px] font-semibold uppercase text-slate-400">{product.brand}</p>
          <h2 className="mt-0.5 line-clamp-1 text-[13px] font-semibold leading-4 text-slate-950">{product.name}</h2>
          <p className="mt-1 line-clamp-1 rounded-lg bg-[#fbfaf7] px-2 py-0.5 text-[10px] leading-4 text-slate-600">
            {selectedProduct.spec}
          </p>
        </div>

        {product.optionGroups?.length ? (
          <div className="space-y-1 rounded-lg bg-[#fbfaf7] p-1 ring-1 ring-slate-100">
            {product.optionGroups.map((group) => (
              <div key={group.name}>
                <p className="mb-1 text-[10px] font-semibold text-slate-500">{group.name}</p>
                <div className="flex flex-wrap gap-1">
                  {group.values.map((value) => {
                    const isActive = selectedOptions[group.name] === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedOptions((options) => ({ ...options, [group.name]: value }))}
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                          isActive
                            ? 'bg-slate-950 text-white'
                            : 'bg-white text-slate-600 ring-1 ring-slate-200'
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between rounded-lg bg-[#fbfaf7] px-2 py-1 text-[11px] ring-1 ring-slate-100">
          <span className="text-slate-500">价格</span>
          <strong className="text-xs text-slate-950">{product.price}</strong>
        </div>

        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => onAddToCart(selectedProduct)}
            className="inline-flex h-8 items-center justify-center gap-0.5 rounded-lg border border-slate-200 bg-white text-[10px] font-semibold text-slate-700"
          >
            <Plus className="h-3 w-3" />
            加入
          </button>
          <button
            type="button"
            onClick={() => onInquiry(selectedProduct)}
            className="inline-flex h-8 items-center justify-center gap-0.5 rounded-lg bg-slate-950 text-[10px] font-semibold text-white shadow-sm active:bg-slate-800"
          >
            <MessageCircle className="h-3 w-3" />
            询价
          </button>
        </div>
      </div>
    </article>
  );
}
