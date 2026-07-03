import { AlertCircle } from 'lucide-react';

const serviceNotes = ['WashU 附近线下自提或送货上门', '官网价免税', '标多少按多少结算', '选好后复制清单微信发送 Lutissss'];

export default function Footer({ site }) {
  return (
    <footer className="bg-[#fbfaf7] px-4 pb-28 pt-8">
      <div className="mx-auto max-w-screen-sm rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
          <AlertCircle className="h-5 w-5 text-emerald-600" />
          交易说明
        </div>
        <ul className="space-y-2 text-sm leading-6 text-slate-600">
          {serviceNotes.map((note) => (
            <li key={note} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200">
          Duo Deals｜{site?.shortName || '美妆数码百货'}联系方式：请添加微信：Lutissss
        </p>
      </div>
    </footer>
  );
}
