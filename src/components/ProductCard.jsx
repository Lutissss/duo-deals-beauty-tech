import { useMemo, useState } from 'react';
import { ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onInquiry, onViewDetails }) {
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

  const isUploadedImage = !String(product.image).includes('placehold.co');
  const numericPrice = product.price?.startsWith('$') ? product.price : null;
  const hasDetailPage = Boolean(product.detailPath && onViewDetails);
  const imageContent = (
    <>
      <img
        src={product.image}
        alt={product.name}
        className={`aspect-square w-full rounded-xl object-contain ${isUploadedImage ? 'mix-blend-normal' : ''}`}
        loading="lazy"
      />
      <div className="absolute left-3 top-3 flex gap-1">
        {isUploadedImage ? (
          <span className="rounded-md bg-slate-950 px-2 py-1 text-[10px] font-black uppercase text-white">New</span>
        ) : null}
        {product.status === '现货' ? (
          <span className="rounded-md bg-red-600 px-2 py-1 text-[10px] font-black uppercase text-white">Hot</span>
        ) : null}
      </div>
    </>
  );

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60 transition hover:-translate-y-0.5 hover:shadow-md">
      {hasDetailPage ? (
        <button
          type="button"
          onClick={() => onViewDetails(product.detailPath)}
          className="relative block w-full cursor-pointer bg-gradient-to-br from-white to-slate-50 p-3 text-left"
        >
          {imageContent}
        </button>
      ) : (
        <div className="relative bg-gradient-to-br from-white to-slate-50 p-3">{imageContent}</div>
      )}

      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{product.brand}</span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${statusClass}`}>{product.status}</span>
        </div>

        <div>
          {hasDetailPage ? (
            <button
              type="button"
              onClick={() => onViewDetails(product.detailPath)}
              className="line-clamp-1 text-left text-sm font-black leading-5 text-slate-950 underline-offset-4 hover:underline"
            >
              {product.name}
            </button>
          ) : (
            <h2 className="line-clamp-1 text-sm font-black leading-5 text-slate-950">{product.name}</h2>
          )}
          <p className="mt-1 line-clamp-1 text-xs font-semibold leading-5 text-slate-500">
            {selectedProduct.spec}
          </p>
        </div>

        {product.optionGroups?.length ? (
          <div className="space-y-1.5 rounded-xl bg-slate-50 p-2 ring-1 ring-slate-100">
            {product.optionGroups.map((group) => (
              <div key={group.name}>
                <p className="mb-1 text-[10px] font-bold text-slate-500">{group.name}</p>
                <div className="flex flex-wrap gap-1">
                  {group.values.map((value) => {
                    const isActive = selectedOptions[group.name] === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedOptions((options) => ({ ...options, [group.name]: value }))}
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
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

        <div className="flex items-end justify-between gap-2 pt-1">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">{product.category}</p>
            <strong className="text-base font-black text-slate-950">{numericPrice || product.price}</strong>
          </div>
          <button
            type="button"
            onClick={() => onAddToCart(selectedProduct)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm transition active:scale-95"
            aria-label="加入询价清单"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1">
          <button
            type="button"
            onClick={() => (hasDetailPage ? onViewDetails(product.detailPath) : onInquiry(selectedProduct))}
            className="inline-flex h-9 items-center justify-center gap-1 rounded-xl bg-slate-950 text-xs font-bold text-white shadow-sm active:bg-slate-800"
          >
            {hasDetailPage ? <ArrowRight className="h-3.5 w-3.5" /> : <MessageCircle className="h-3.5 w-3.5" />}
            {hasDetailPage ? '查看配置' : '微信询价'}
          </button>
        </div>
      </div>
    </article>
  );
}
