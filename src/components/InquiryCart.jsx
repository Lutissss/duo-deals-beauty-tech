import { Clipboard, Copy, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';

export default function InquiryCart({
  items,
  pickupMethod,
  onPickupChange,
  onIncrement,
  onDecrement,
  onRemove,
  inquiryText,
  copied,
  onGenerate,
  onCopy,
  isOpen,
  onToggle,
}) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] right-4 z-30 flex h-14 items-center gap-2 rounded-full bg-slate-950 px-5 font-semibold text-white shadow-xl shadow-slate-300"
      >
        <ShoppingBag className="h-5 w-5" />
        询价清单
        {totalQuantity > 0 ? (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-500 px-2 text-xs">{totalQuantity}</span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-950/40">
          <div className="absolute inset-x-0 bottom-0 mx-auto max-h-[88vh] max-w-screen-sm overflow-hidden rounded-t-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <p className="text-xs text-slate-500">微信询价</p>
                <h2 className="text-lg font-bold text-slate-950">已选择商品</h2>
              </div>
              <button
                type="button"
                onClick={onToggle}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
                aria-label="关闭询价清单"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(88vh-76px)] overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+18px)] pt-4">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                  <Clipboard className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-3 font-semibold text-slate-800">询价清单还是空的</p>
                  <p className="mt-1 text-sm text-slate-500">把感兴趣的商品加入清单后，可一键生成微信询价内容。</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                      <img src={item.image} alt={item.name} className="h-20 w-20 shrink-0 rounded-xl bg-slate-100 object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="mb-1 flex items-center gap-1.5">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                  item.section === 'Beauty' ? 'bg-rose-50 text-rose-700' : 'bg-sky-50 text-sky-700'
                                }`}
                              >
                                {item.section} / {item.sectionLabel}
                              </span>
                              <p className="truncate text-xs font-medium text-slate-500">{item.brand}</p>
                            </div>
                            <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-950">{item.name}</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemove(item.id)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-500"
                            aria-label={`删除 ${item.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{item.spec}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">{item.price}</span>
                          <div className="flex items-center rounded-full border border-slate-200">
                            <button
                              type="button"
                              onClick={() => onDecrement(item.id)}
                              className="flex h-8 w-8 items-center justify-center text-slate-600"
                              aria-label={`减少 ${item.name} 数量`}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => onIncrement(item.id)}
                              className="flex h-8 w-8 items-center justify-center text-slate-600"
                              aria-label={`增加 ${item.name} 数量`}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">取货方式</p>
                <div className="mt-3 grid gap-2">
                  {['WashU 附近线下自提或送货上门'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => onPickupChange(method)}
                      className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
                        pickupMethod === method
                          ? 'bg-slate-950 text-white'
                          : 'border border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3">
                  <p className="font-semibold text-slate-950">微信询价内容</p>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <button
                      type="button"
                      onClick={onGenerate}
                      disabled={items.length === 0}
                      className="h-10 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white disabled:bg-slate-300"
                    >
                      生成微信询价内容
                    </button>
                    <button
                      type="button"
                      onClick={onCopy}
                      disabled={items.length === 0}
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white disabled:bg-slate-300"
                    >
                      <Copy className="h-4 w-4" />
                      {copied ? '已复制' : '复制询价内容'}
                    </button>
                  </div>
                </div>
                <textarea
                  readOnly
                  value={inquiryText}
                  className="mt-3 h-44 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
