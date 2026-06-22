import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="sticky top-0 z-20 bg-[#fbfaf7]/95 px-4 py-3 backdrop-blur">
      <label className="mx-auto flex max-w-screen-sm items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100">
        <Search className="h-5 w-5 shrink-0 text-slate-400" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
          placeholder="搜索商品、品牌、分类或描述"
          type="search"
          inputMode="search"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200"
            aria-label="清空搜索"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </label>
    </div>
  );
}
