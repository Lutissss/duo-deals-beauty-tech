import { ArrowRight, BadgeCheck, MapPin, PackageCheck, Sparkles, Smartphone } from 'lucide-react';
import beautyHomeImage from '../assets/beauty-home.png';
import techHomeImage from '../assets/tech-home.png';

const serviceNotes = ['WashU 附近线下自提或送货上门', '微信确认价格', '现货优先，也支持预订', '商品价格随活动和库存变化'];

const entries = [
  {
    title: '美妆护肤',
    chineseTitle: '美妆护肤专区',
    description: '护肤、彩妆、香水、套装，美国本地好价精选',
    buttonText: '进入美妆专区',
    path: '/beauty',
    icon: Sparkles,
    image: beautyHomeImage,
  },
  {
    title: '电子数码',
    chineseTitle: '电子产品专区',
    description: 'Apple、Dyson、Switch、数码配件，本地好价先看这里',
    buttonText: '进入电子产品专区',
    path: '/electronics',
    icon: Smartphone,
    image: techHomeImage,
  },
];

export default function SiteGateway({ onNavigate }) {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-900">
      <section className="px-4 pb-5 pt-6 md:pt-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-slate-200 bg-white px-5 py-8 shadow-sm shadow-slate-200/70 md:px-10 md:py-12">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <BadgeCheck className="h-3.5 w-3.5" />
              美国本地华人 / 留学生好价选品
            </div>
            <h1 className="text-4xl font-black leading-tight text-slate-950 md:text-6xl">Duo Deals｜美妆数码好价</h1>
            <p className="mt-4 text-xl font-bold leading-8 text-slate-900">美国本地美妆护肤 & 电子数码好价精选</p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 md:text-base md:leading-7">
              美国本地好价选品站，美妆护肤和电子产品分区展示。支持 WashU 附近线下自提或送货上门，价格和库存请微信确认。
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-3">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
          {entries.map((entry) => {
            const Icon = entry.icon;

            return (
              <button
                key={entry.path}
                type="button"
                onClick={() => onNavigate(entry.path)}
                className="overflow-hidden rounded-[24px] border border-slate-200 bg-white text-left shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
              >
                <div className="relative h-44 md:h-56">
                  <img src={entry.image} alt={entry.chineseTitle} className="h-full w-full object-cover" />
                  <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 text-slate-950 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase text-emerald-700">{entry.title}</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">{entry.chineseTitle}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{entry.description}</p>
                  <div className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white">
                    {entry.buttonText}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-10 pt-4">
        <div className="mx-auto max-w-7xl rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
            <PackageCheck className="h-5 w-5 text-emerald-600" />
            统一服务说明
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {serviceNotes.map((note) => (
              <div key={note} className="flex items-center gap-2 rounded-xl bg-[#fbfaf7] px-3 py-2 text-sm text-slate-700">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
                {note}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
