import { useMemo, useState } from 'react';
import { Minus, Plus, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function ProductConfigurator({ product, onAddToCart, onBuyNow }) {
  const defaultOptions = useMemo(
    () =>
      Object.fromEntries(
        (product.optionGroups || []).map((group) => [group.name, group.values[0]]),
      ),
    [product.optionGroups],
  );
  const [selectedOptions, setSelectedOptions] = useState(defaultOptions);
  const [quantity, setQuantity] = useState(1);

  const optionSpec = Object.values(selectedOptions).filter(Boolean).join(' / ');
  const configuredProduct = {
    ...product,
    cartId: optionSpec ? `${product.id}-${optionSpec}` : product.id,
    selectedOptions,
    spec: optionSpec ? `${product.spec} / ${optionSpec}` : product.spec,
    quantity,
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
      <div className="grid gap-6 p-4 md:grid-cols-[1fr_0.9fr] md:p-6">
        <div className="rounded-[24px] bg-gradient-to-br from-white to-slate-50 p-5 ring-1 ring-slate-100">
          <img src={product.image} alt={product.name} className="mx-auto aspect-square w-full max-w-lg object-contain" />
        </div>

        <aside className="md:sticky md:top-24 md:self-start">
          <div className="space-y-5 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-sm font-black uppercase tracking-normal text-slate-500">{product.brand}</p>
              <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950">{product.name}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
            </div>

            <div className="space-y-4">
              {(product.optionGroups || []).map((group, index) => (
                <div key={group.name}>
                  <p className="text-sm font-black text-slate-950">
                    {index + 1}. {group.name}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {group.values.map((value) => {
                      const isActive = selectedOptions[group.name] === value;

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setSelectedOptions((options) => ({ ...options, [group.name]: value }))}
                          className={`min-h-12 rounded-2xl border px-3 py-2 text-left text-sm font-black transition active:scale-[0.99] ${
                            isActive
                              ? 'border-slate-950 bg-slate-950 text-white shadow-md shadow-slate-200'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400'
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

            <div>
              <p className="text-sm font-black text-slate-950">数量</p>
              <div className="mt-2 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
                  aria-label="减少数量"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  aria-label="数量"
                  value={quantity}
                  onChange={(event) => {
                    const value = Number(event.target.value.replace(/\D/g, ''));
                    setQuantity(Math.min(99, Math.max(1, value || 1)));
                  }}
                  className="h-9 w-14 bg-transparent text-center text-sm font-black text-slate-950 outline-none"
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
                  aria-label="增加数量"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <div className="flex gap-2 text-sm font-bold text-slate-700">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <p>{product.reminder}</p>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                <span className="text-sm font-bold text-slate-500">价格</span>
                <strong className="text-lg font-black text-slate-950">{product.price}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onAddToCart(configuredProduct)}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-950 shadow-sm"
              >
                <ShoppingBag className="h-4 w-4" />
                加入清单
              </button>
              <button
                type="button"
                onClick={() => onBuyNow(configuredProduct)}
                className="h-12 rounded-xl bg-slate-950 text-sm font-black text-white shadow-sm active:bg-slate-800"
              >
                微信询价
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
