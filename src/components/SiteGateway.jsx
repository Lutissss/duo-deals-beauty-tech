import { ArrowRight, BadgeCheck, MapPin, PackageCheck, ShoppingBasket, Sparkles, Smartphone } from 'lucide-react';
import beautyHomeImage from '../assets/beauty-home.png';
import techHomeImage from '../assets/tech-home.png';

const serviceNotes = ['WashU 附近线下自提或送货上门', '官网价免税', '标多少按多少结算', '复制清单微信发送 Lutissss'];

const entries = [
  {
    title: 'Beauty & Skincare',
    chineseTitle: '美妆护肤专区',
    description: '护肤、彩妆、香水与美发护理，美国热门好物精选',
    buttonText: '进入美妆专区',
    path: '/beauty',
    icon: Sparkles,
    image: beautyHomeImage,
    tone: 'bg-[#f7e9ea]',
  },
  {
    title: 'Tech & Accessories',
    chineseTitle: '电子产品专区',
    description: 'Apple、Dyson、Switch、数码配件，本地好价先看这里',
    buttonText: '进入电子产品专区',
    path: '/electronics',
    icon: Smartphone,
    image: techHomeImage,
    tone: 'bg-[#eaf2f7]',
  },
  {
    title: 'Daily Essentials',
    chineseTitle: '日用百货专区',
    description: '饮料、零食、个护、纸品和家庭清洁，日常顺手补货',
    buttonText: '进入日用百货',
    path: '/market',
    icon: ShoppingBasket,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85',
    tone: 'bg-[#eef4e8]',
  },
];

export default function SiteGateway({ onNavigate }) {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-slate-900">
      <section className="px-4 pb-5 pt-6 md:pt-10">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
            <div className="grid gap-0 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="px-5 py-8 md:px-10 md:py-12">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  美国本地华人 / 留学生好价选品
                </div>
                <h1 className="text-4xl font-black leading-tight text-slate-950 md:text-6xl">Duo Deals｜美妆数码百货好价</h1>
                <p className="mt-4 text-xl font-bold leading-8 text-slate-900">美国本地美妆护肤、电子数码 & 日用百货好价精选</p>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 md:text-base md:leading-7">
                  美国本地好价选品站，美妆护肤、电子产品和日用百货分区展示。页面标注官网价或常见门店价，选好商品后复制清单微信发送 Lutissss，由我们汇总购买和配送。
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['美国本地渠道', '官网价免税', 'WashU 附近取送'].map((item) => (
                    <span key={item} className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-700 ring-1 ring-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 border-t border-slate-200 bg-slate-950 text-white lg:grid-cols-1 lg:border-l lg:border-t-0">
                {[
                  ['3', '精选分区'],
                  ['80+', '在售商品'],
                  ['1份', '统一购买清单'],
                ].map(([value, label]) => (
                  <div key={label} className="flex min-h-24 flex-col justify-center border-r border-white/10 px-4 last:border-r-0 lg:border-b lg:border-r-0 lg:last:border-b-0">
                    <strong className="text-2xl font-black md:text-3xl">{value}</strong>
                    <span className="mt-1 text-xs font-bold text-slate-300">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-3">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {entries.map((entry) => {
            const Icon = entry.icon;

            return (
              <button
                key={entry.path}
                type="button"
                onClick={() => onNavigate(entry.path)}
                className="group overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:scale-[0.99]"
              >
                <div className={`relative h-44 overflow-hidden md:h-52 ${entry.tone}`}>
                  <img src={entry.image} alt={entry.chineseTitle} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
                  <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white/95 text-slate-950 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-emerald-700">{entry.title}</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">{entry.chineseTitle}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{entry.description}</p>
                  <div className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white">
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
        <div className="mx-auto max-w-7xl rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
            <PackageCheck className="h-5 w-5 text-emerald-600" />
            统一服务说明
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {serviceNotes.map((note) => (
              <div key={note} className="flex items-center gap-2 rounded-lg bg-[#fbfaf7] px-3 py-2 text-sm text-slate-700">
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
