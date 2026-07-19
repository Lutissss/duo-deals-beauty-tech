import { useState } from 'react';
import { Minus, Plus, ShieldCheck, ShoppingBag, Zap } from 'lucide-react';
import ProductImage from './ProductImage.jsx';

const editionOptions = [
  {
    id: 'standard',
    name: '标准版',
    description: 'Nintendo Switch 2 主机套装',
    price: 449.99,
    inventory: 'In Stock',
  },
  {
    id: 'mario-kart',
    name: 'Mario Kart World 同捆版',
    description: '主机 + Mario Kart World 套装',
    price: 499.99,
    compareAt: 529.99,
    inventory: 'Low Stock',
  },
];

const accessories = [
  { id: 'pro-controller', name: 'Switch 2 Pro 手柄', price: 84.99, inventory: 'In Stock' },
  { id: 'joy-con-pair', name: 'Joy-Con 2 一对', price: 94.99, inventory: 'In Stock' },
  { id: 'charging-grip', name: 'Joy-Con 2 充电握把', price: 34.99, inventory: 'In Stock' },
  { id: 'camera', name: 'Switch 2 摄像头', price: 54.99, inventory: 'Out of Stock' },
  { id: 'case', name: '收纳包 + 屏幕保护膜', price: 39.99, inventory: 'In Stock' },
  { id: 'microsd-256', name: 'MicroSD Express 256GB', price: 59.99, inventory: 'In Stock' },
  { id: 'microsd-512', name: 'MicroSD Express 512GB', price: 99.99, inventory: 'Low Stock' },
];

const highlights = [
  '7.9 英寸屏幕',
  '掌机模式支持 1080p',
  '底座模式最高支持 4K 输出',
  '支持 HDR',
  '支持 120Hz 可变刷新率',
  '升级版 Joy-Con 2 手柄',
  '更快的内置存储',
  '兼容大多数 Nintendo Switch 游戏',
];

const formatUsd = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

const inventoryClass = {
  'In Stock': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Low Stock': 'bg-amber-50 text-amber-800 ring-amber-200',
  'Out of Stock': 'bg-slate-100 text-slate-500 ring-slate-200',
};

const inventoryLabel = {
  'In Stock': '有货',
  'Low Stock': '库存紧张',
  'Out of Stock': '暂时无货',
};

function OptionCard({ title, description, price, isActive, inventory, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${
        isActive
          ? 'border-slate-950 bg-slate-950 text-white shadow-md shadow-slate-200'
          : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold leading-5">{title}</p>
          {description ? <p className={`mt-1 text-xs leading-5 ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>{description}</p> : null}
        </div>
        {price ? <p className="shrink-0 text-sm font-bold">{price}</p> : null}
      </div>
      {inventory ? (
        <span className={`mt-3 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${inventoryClass[inventory]}`}>
          {inventoryLabel[inventory]}
        </span>
      ) : null}
    </button>
  );
}

export default function Switch2Configurator({ product, onAddToCart, onBuyNow }) {
  const [editionId, setEditionId] = useState('standard');
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const selectedEdition = editionOptions.find((option) => option.id === editionId) || editionOptions[0];
  const selectedAccessoryItems = accessories.filter((item) => selectedAccessories.includes(item.id));
  const accessoriesTotal = selectedAccessoryItems.reduce((sum, item) => sum + item.price, 0);
  const bundleSavings = Math.max(0, (selectedEdition.compareAt || selectedEdition.price) - selectedEdition.price);
  const addonSavings = selectedAccessoryItems.length >= 3 ? accessoriesTotal * 0.08 : 0;
  const unitSubtotal = selectedEdition.price + accessoriesTotal - addonSavings;
  const subtotal = unitSubtotal * quantity;
  const isOutOfStock = selectedEdition.inventory === 'Out of Stock';
  const accessoryText = selectedAccessoryItems.length ? selectedAccessoryItems.map((item) => item.name).join('，') : '不加配件';
  const spec = [
    `版本：${selectedEdition.name}`,
    '状态：全新',
    '存储：256GB 内置存储',
    '颜色：Nintendo 标准配色',
    `可选配件：${accessoryText}`,
  ].join(' / ');

  const configuredProduct = {
    ...product,
    cartId: [
      product.id,
      selectedEdition.id,
      selectedAccessories.join('-') || 'no-accessories',
    ].join('-'),
    name: 'Nintendo Switch 2',
    spec,
    price: `免税价 ${formatUsd(subtotal)}`,
    quantity,
    selectedOptions: {
      版本: selectedEdition.name,
      状态: '全新',
      存储: '256GB 内置存储',
      颜色: 'Nintendo 标准配色',
      可选配件: accessoryText,
    },
  };

  const toggleAccessory = (id) => {
    const item = accessories.find((accessory) => accessory.id === id);
    if (item?.inventory === 'Out of Stock') return;

    setSelectedAccessories((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
    );
  };

  return (
    <section className="mb-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-5 p-4 lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
        <div>
          <div className="rounded-[24px] bg-gradient-to-br from-slate-50 to-white p-4 ring-1 ring-slate-100">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                <Zap className="h-3.5 w-3.5" />
                Switch 2 配置购买
              </span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${inventoryClass[selectedEdition.inventory]}`}>
                {inventoryLabel[selectedEdition.inventory]}
              </span>
            </div>
            <ProductImage
              product={product}
              className="aspect-[1.5/1] w-full rounded-2xl bg-white object-contain"
              loading="eager"
            />
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Nintendo</p>
            <h2 className="mt-1 text-3xl font-bold leading-tight text-slate-950">Nintendo Switch 2</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              选择版本、配件和数量后加入购买清单。页面小计按官网价免税汇总，标多少按多少结算。
            </p>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="mb-3 text-sm font-bold text-slate-950">产品亮点</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-2 text-sm text-slate-700">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                  {highlight}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-sm font-bold text-slate-950">1. 选择版本</p>
              <div className="mt-2 grid gap-2">
                {editionOptions.map((option) => (
                  <OptionCard
                    key={option.id}
                    title={option.name}
                    description={option.description}
                    price={formatUsd(option.price)}
                    inventory={option.inventory}
                    isActive={editionId === option.id}
                    disabled={option.inventory === 'Out of Stock'}
                    onClick={() => setEditionId(option.id)}
                  />
                ))}
              </div>
              {bundleSavings > 0 ? (
                <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  同捆优惠：{formatUsd(bundleSavings)}
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">2. 状态</p>
                <p className="mt-1 text-sm font-bold text-slate-950">全新</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">3. 存储</p>
                <p className="mt-1 text-sm font-bold text-slate-950">256GB 内置存储</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 sm:col-span-2">
                <p className="text-xs font-semibold text-slate-500">4. 颜色</p>
                <p className="mt-1 text-sm font-bold text-slate-950">Nintendo 标准配色</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-950">5. 可选配件 <span className="font-medium text-slate-500">可不选</span></p>
              <div className="mt-2 grid gap-2">
                {accessories.map((item) => {
                  const isActive = selectedAccessories.includes(item.id);

                  return (
                    <OptionCard
                      key={item.id}
                      title={item.name}
                      price={formatUsd(item.price)}
                      inventory={item.inventory}
                      isActive={isActive}
                      disabled={item.inventory === 'Out of Stock'}
                      onClick={() => toggleAccessory(item.id)}
                    />
                  );
                })}
              </div>
              {addonSavings > 0 ? (
                <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  配件组合优惠：{formatUsd(addonSavings)}
                </p>
              ) : null}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-950">6. 数量</p>
              <div className="mt-2 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
                  aria-label="减少数量"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  aria-label="数量"
                  value={quantity}
                  onChange={(event) => {
                    const value = Number(event.target.value.replace(/\D/g, ''));
                    setQuantity(Math.min(99, Math.max(1, value || 1)));
                  }}
                  className="h-9 w-14 bg-transparent text-center text-sm font-bold text-slate-950 outline-none"
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
                  aria-label="增加数量"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950 p-4 text-white">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-300">预估小计</p>
                  <p className="mt-1 text-3xl font-bold">{formatUsd(subtotal)}</p>
                </div>
                <p className="text-right text-xs leading-5 text-slate-300">
                  官网价免税
                  <br />
                  标多少卖多少
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => onAddToCart(configuredProduct)}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-white text-sm font-bold text-slate-950 disabled:bg-slate-600 disabled:text-slate-300"
                >
                  <ShoppingBag className="h-4 w-4" />
                  加入清单
                </button>
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => onBuyNow(configuredProduct)}
                  className="h-11 rounded-xl bg-emerald-500 text-sm font-bold text-white disabled:bg-slate-600 disabled:text-slate-300"
                >
                  加入并打开清单
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
