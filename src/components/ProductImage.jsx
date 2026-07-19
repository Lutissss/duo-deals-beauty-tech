import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

const fallbackTone = {
  Beauty: 'from-rose-50 via-white to-orange-50 text-rose-900',
  Tech: 'from-sky-50 via-white to-slate-100 text-slate-900',
  Market: 'from-emerald-50 via-white to-amber-50 text-emerald-950',
};

export default function ProductImage({ product, className = '', loading = 'lazy' }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [product.image]);

  if (failed || !product.image) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br p-5 text-center ${fallbackTone[product.section] || fallbackTone.Tech} ${className}`}
        role="img"
        aria-label={`${product.name} 图片暂未加载`}
      >
        <div>
          <ImageOff className="mx-auto h-6 w-6 opacity-50" />
          <p className="mt-3 text-xs font-black uppercase">{product.brand}</p>
          <p className="mt-1 line-clamp-2 text-sm font-black leading-5">{product.name}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={product.image}
      alt={product.name}
      className={className}
      loading={loading}
      decoding="async"
      style={{ objectPosition: product.imagePosition || 'center' }}
      onError={() => setFailed(true)}
    />
  );
}
