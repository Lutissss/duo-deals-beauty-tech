import { ArrowLeft, BadgeCheck, Sparkles, Smartphone } from 'lucide-react';
import beautyHomeImage from '../assets/beauty-home.png';
import techHomeImage from '../assets/tech-home.png';

export default function Header({ site, onNavigate }) {
  const isBeauty = site.key === 'beauty';
  const SiteIcon = isBeauty ? Sparkles : Smartphone;
  const heroImage = isBeauty ? beautyHomeImage : techHomeImage;

  return (
    <header className={isBeauty ? 'bg-[#fbfaf7]' : 'bg-[#f7f8fa]'}>
      <div className="mx-auto max-w-screen-sm px-4 pb-4 pt-4">
        <button type="button" onClick={() => onNavigate('/')} className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600">
          <ArrowLeft className="h-4 w-4" />
          返回总入口
        </button>

        <section className="relative min-h-[390px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <img
            src={heroImage}
            alt={site.name}
            className={`absolute inset-0 h-full w-full object-cover ${isBeauty ? 'object-[62%_center]' : 'object-[58%_center]'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/72 to-white/12" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/95 to-transparent" />

          <div className="relative flex min-h-[390px] flex-col justify-between p-5 text-slate-950">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                {site.eyebrow}
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-slate-950 shadow-sm">
                <SiteIcon className="h-5 w-5" />
              </div>
            </div>

            <div className="max-w-[360px] rounded-2xl bg-white/88 p-4 shadow-sm ring-1 ring-white/80 backdrop-blur">
              <p className="text-sm font-semibold text-slate-500">Duo Deals｜美妆数码好价</p>
              <p className="mt-1 text-sm font-semibold text-emerald-700">{site.name}</p>
              <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-950">{site.heroTitle}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">{site.description}</p>
            </div>
          </div>
        </section>
      </div>
    </header>
  );
}
