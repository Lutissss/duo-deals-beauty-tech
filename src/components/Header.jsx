import { ArrowLeft, ArrowRight, BadgeCheck, ShoppingBasket, Sparkles, Smartphone } from 'lucide-react';
import beautyHomeImage from '../assets/beauty-home.png';
import techHomeImage from '../assets/tech-home.png';

export default function Header({ site, onNavigate }) {
  const isBeauty = site.key === 'beauty';
  const isMarket = site.key === 'market';
  const SiteIcon = isBeauty ? Sparkles : isMarket ? ShoppingBasket : Smartphone;
  const heroImage = isBeauty
    ? beautyHomeImage
    : isMarket
      ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85'
      : techHomeImage;
  const heroLabel = isBeauty ? '美妆护肤' : isMarket ? '日用百货' : '电子产品';
  const heroSubtitle = isBeauty
    ? '护肤、彩妆、香水、套装，本地好价精选。'
    : isMarket
      ? '饮料、零食、个人护理和家庭清洁，WashU 附近顺手补货。'
      : 'Apple、Dyson、Switch 和日常数码配件。';

  return (
    <header className={isBeauty ? 'bg-[#fbfaf7]' : isMarket ? 'bg-[#fafbf7]' : 'bg-[#f7f8fa]'}>
      <div className="mx-auto max-w-7xl px-4 py-5 md:py-8">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          返回总入口
        </button>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
          <div className="grid min-h-[360px] items-center gap-4 md:grid-cols-[0.92fr_1.08fr]">
            <div className="px-6 py-8 md:px-12 md:py-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 ring-1 ring-slate-200">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                {site.eyebrow}
              </div>
              <h1 className="mt-8 text-5xl font-black leading-none tracking-normal text-slate-950 md:text-6xl">
                {heroLabel}
              </h1>
              <p className="mt-4 text-lg font-semibold leading-7 text-slate-700">{heroSubtitle}</p>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">{site.description}</p>
              <button
                type="button"
                onClick={() => document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition active:scale-[0.98]"
              >
                查看全部{heroLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div
              className={`relative min-h-[260px] self-stretch overflow-hidden ${
                isBeauty ? 'bg-[#f7e7e9]' : isMarket ? 'bg-[#f3f6ed]' : 'bg-[#eef5fa]'
              } md:min-h-[360px]`}
            >
              <img
                src={heroImage}
                alt={site.name}
                className={`absolute inset-0 h-full w-full object-cover ${
                  isBeauty ? 'object-[66%_center]' : isMarket ? 'object-center' : 'object-[62%_center]'
                }`}
              />
              <div className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/95 text-slate-950 shadow-sm">
                <SiteIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </header>
  );
}
