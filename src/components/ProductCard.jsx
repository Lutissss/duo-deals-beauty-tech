import { useMemo, useState } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import ProductImage from './ProductImage.jsx';

export default function ProductCard({ product, showSection = false, onAddToCart, onInquiry, onViewDetails }) {
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

  const hasDetailPage = Boolean(product.detailPath && onViewDetails);
  const displaySpec = hasDetailPage ? product.spec : selectedProduct.spec;
  const badges = product.badges || (product.priority ? ['热门'] : []);
  const imageTone =
    product.section === 'Beauty'
      ? 'from-[#fff8f8] to-[#f8efec]'
      : product.section === 'Market'
        ? 'from-[#f8fbf3] to-[#edf5e8]'
        : 'from-white to-[#eef3f7]';
  const sectionClass =
    product.section === 'Beauty'
      ? 'bg-rose-50 text-rose-700'
      : product.section === 'Market'
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-sky-50 text-sky-700';
  const imageContent = (
    <>
      <ProductImage
        product={product}
        className="aspect-square w-full rounded-md object-contain"
      />
      <div className="absolute left-2 top-2 flex gap-1">
        {badges.slice(0, 2).map((badge, index) => (
          <span
            key={badge}
            className={`rounded-md px-2 py-1 text-[10px] font-black text-white shadow-sm ${index === 0 ? 'bg-slate-950' : 'bg-rose-600'}`}
          >
            {badge}
          </span>
        ))}
      </div>
    </>
  );

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-sm shadow-slate-200/60 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      {hasDetailPage ? (
        <button
          type="button"
          onClick={() => onViewDetails(product.detailPath)}
          className={`relative block w-full cursor-pointer bg-gradient-to-br p-2 text-left ${imageTone}`}
        >
          {imageContent}
        </button>
      ) : (
        <div className={`relative bg-gradient-to-br p-2 ${imageTone}`}>{imageContent}</div>
      )}

      <div className="flex flex-1 flex-col space-y-2 p-3">
        <div className="flex items-center justify-between gap-1">
          <div className="flex min-w-0 items-center gap-1">
            {showSection ? (
              <span className={`shrink-0 rounded-md px-1.5 py-1 text-[9px] font-black ${sectionClass}`}>
                {product.sectionLabel}
              </span>
            ) : null}
            <span className="truncate rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">{product.brand}</span>
          </div>
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
            {displaySpec}
          </p>
        </div>

        {product.optionGroups?.length && !hasDetailPage ? (
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

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <p className="text-[10px] font-bold text-slate-400">{product.category}</p>
            <strong className="line-clamp-1 text-sm font-black text-slate-950 sm:text-base">{product.price}</strong>
          </div>
          <button
            type="button"
            onClick={() => (hasDetailPage ? onViewDetails(product.detailPath) : onAddToCart(selectedProduct))}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm transition active:scale-95"
            aria-label={hasDetailPage ? '查看配置' : '加入购买清单'}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1">
          <button
            type="button"
            onClick={() => (hasDetailPage ? onViewDetails(product.detailPath) : onInquiry(selectedProduct))}
            className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-slate-950 px-2 text-xs font-bold text-white shadow-sm active:bg-slate-800"
          >
            {hasDetailPage ? <ArrowRight className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
            {hasDetailPage ? '查看配置' : '加入购买清单'}
          </button>
        </div>
      </div>
    </article>
  );
}
