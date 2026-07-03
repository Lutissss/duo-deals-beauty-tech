import { useEffect, useMemo, useState } from 'react';
import BrandFilter from './components/BrandFilter.jsx';
import CategoryTabs from './components/CategoryTabs.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import InquiryCart from './components/InquiryCart.jsx';
import ProductCard from './components/ProductCard.jsx';
import ProductConfigurator from './components/ProductConfigurator.jsx';
import SiteGateway from './components/SiteGateway.jsx';
import Switch2Configurator from './components/Switch2Configurator.jsx';
import TopNav from './components/TopNav.jsx';
import { beautyProducts } from './data/beautyProducts.js';
import { techProducts } from './data/techProducts.js';
import { ArrowLeft, BadgeDollarSign, PackageCheck, ShieldCheck, Truck, WalletCards } from 'lucide-react';

const CART_STORAGE_KEY = 'duo-deals-inquiry-cart-v2';
const PICKUP_STORAGE_KEY = 'duo-deals-pickup-method-v1';
const LEGACY_CART_STORAGE_KEYS = ['duo-deals-inquiry-cart-v1', 'lewis-inquiry-cart-v1'];
const LEGACY_PICKUP_STORAGE_KEY = 'lewis-pickup-method-v1';
const LEGACY_INQUIRY_PRICE_LABEL = ['微信', '询价'].join('');
const LEGACY_WECHAT_CONFIRM_LABEL = ['微信', '确认'].join('');
const PICKUP_METHOD = 'WashU 附近线下自提或送货上门';
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '') === '' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '');

const normalizePickupMethod = (method) => {
  if (method === 'STL 本地送货') return PICKUP_METHOD;
  if (method === 'WashU 附近送货上门') return PICKUP_METHOD;
  if (method === 'Sikao 自提') return PICKUP_METHOD;
  if (method === 'Sikao life Chinese bbq 自提') return PICKUP_METHOD;
  return method;
};

const siteConfigs = {
  beauty: {
    key: 'beauty',
    path: '/beauty',
    name: '美妆护肤专区',
    shortName: '美妆护肤',
    section: 'Beauty',
    sectionLabel: '美妆护肤',
    eyebrow: '美妆护肤专区',
    heroTitle: '护肤 / 彩妆 / 香水 / 套装，美国本地好价精选',
    description: '本区专注美妆护肤、彩妆、香水和套装好价。页面标注官网价，免税购买，色号和容量可加入清单后确认。',
    categories: ['全部', '护肤', '彩妆', '香水', '套装', '现货', '预订'],
    products: beautyProducts,
    pageClass: 'bg-[#fbfaf7]',
  },
  electronics: {
    key: 'electronics',
    path: '/electronics',
    name: '电子产品专区',
    shortName: '电子产品',
    section: 'Tech',
    sectionLabel: '电子产品',
    eyebrow: '电子数码专区',
    heroTitle: 'Apple / Dyson / Switch / 数码配件，本地好价先看这里',
    description: '本区专注电子产品、数码配件和家用电器好价，商品主要通过美国本地渠道购入。页面标注官网价，免税购买，贵重商品建议当面验货。',
    categories: ['全部', 'Apple', 'Dyson', 'Switch', '数码配件', '家用电器', '现货', '预订'],
    products: techProducts,
    pageClass: 'bg-[#f7f8fa]',
  },
};

const getRouteFromLocation = () => {
  const hashRoute = window.location.hash.replace('#', '');
  let path = hashRoute || window.location.pathname;

  if (BASE_PATH && path.startsWith(BASE_PATH)) {
    path = path.slice(BASE_PATH.length) || '/';
  }

  if (path === '/beauty' || path === '/beauty/') return '/beauty';
  if (path === '/electronics' || path === '/electronics/') return '/electronics';
  const detailRoute = techProducts.find((product) => product.detailPath === path || `${product.detailPath}/` === path)?.detailPath;
  if (detailRoute) return detailRoute;
  return '/';
};

const getBrowserPath = (path) => {
  if (!BASE_PATH) return path;
  return `${BASE_PATH}${path === '/' ? '/' : path}`;
};

const hasUploadedImage = (product) => !String(product.image).includes('placehold.co');
const getCartItemKey = (item) => item.cartId || item.id;
const serviceBenefits = [
  { title: '本地取货', description: 'WashU 附近线下自提', icon: PackageCheck },
  { title: '送货上门', description: 'WashU 附近可送货', icon: Truck },
  { title: '正品渠道', description: '美国本地渠道购入', icon: ShieldCheck },
  { title: '免税到手', description: '标多少按多少结算', icon: WalletCards },
  { title: '官网价格', description: '按官网价整理购买', icon: BadgeDollarSign },
];
const switch2Schema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Nintendo Switch 2',
  description: 'Nintendo Switch 2 本地官网价免税购买，支持标准版和 Mario Kart World 同捆版。',
  brand: {
    '@type': 'Brand',
    name: 'Nintendo',
  },
  category: 'Video Game Console',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '449.99',
    highPrice: '499.99',
    availability: 'https://schema.org/InStock',
    url: 'https://lutissss.github.io/duo-deals-beauty-tech/electronics/switch-2',
  },
};

const allProducts = [...beautyProducts, ...techProducts];

const getCurrentProductPrice = (item) =>
  allProducts.find((product) => product.id === item.id)?.price;

const normalizeCartPrice = (item) => {
  const currentPrice = getCurrentProductPrice(item);
  if (!item.price || item.price.includes(LEGACY_INQUIRY_PRICE_LABEL)) return currentPrice || '官网价';
  return item.price.replace(` / ${LEGACY_WECHAT_CONFIRM_LABEL}`, '').replace('预估 ', '免税价 ');
};

const getStoredCart = () => {
  try {
    const stored =
      localStorage.getItem(CART_STORAGE_KEY) ||
      LEGACY_CART_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);

    if (!stored) return [];

    return JSON.parse(stored).map((item) => ({
      ...item,
      section: item.section || (['美妆护肤', '香水', '彩妆', '套装'].includes(item.category) ? 'Beauty' : 'Tech'),
      sectionLabel: item.sectionLabel || (['美妆护肤', '香水', '彩妆', '套装'].includes(item.category) ? '美妆护肤' : '电子产品'),
      price: normalizeCartPrice(item),
    }));
  } catch {
    return [];
  }
};

export default function App() {
  const [route, setRoute] = useState(getRouteFromLocation);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeBrand, setActiveBrand] = useState('全部品牌');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedInquiryText, setGeneratedInquiryText] = useState('');
  const [pickupMethod, setPickupMethod] = useState(
    () => normalizePickupMethod(localStorage.getItem(PICKUP_STORAGE_KEY) || localStorage.getItem(LEGACY_PICKUP_STORAGE_KEY) || PICKUP_METHOD),
  );
  const [cartItems, setCartItems] = useState(getStoredCart);

  const isSwitch2Detail = route === '/electronics/switch-2';
  const currentSite = route === '/beauty' ? siteConfigs.beauty : route === '/electronics' ? siteConfigs.electronics : null;
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const switch2Product = siteConfigs.electronics.products.find((product) => product.id === 'tech-switch-oled');
  const detailProduct = siteConfigs.electronics.products.find((product) => product.detailPath === route);

  const navigate = (path) => {
    window.history.pushState({}, '', getBrowserPath(path));
    setRoute(path);
    setActiveCategory('全部');
    setActiveBrand('全部品牌');
    setSearchTerm('');
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getRouteFromLocation());
      setActiveCategory('全部');
      setActiveBrand('全部品牌');
      setSearchTerm('');
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(PICKUP_STORAGE_KEY, pickupMethod);
  }, [pickupMethod]);

  useEffect(() => {
    setGeneratedInquiryText('');
    setCopied(false);
  }, [cartItems, pickupMethod]);

  useEffect(() => {
    if (!copied) return undefined;

    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const availableBrands = useMemo(() => {
    if (!currentSite) return [];
    return [...new Set(currentSite.products.map((product) => product.brand))].sort((a, b) => a.localeCompare(b));
  }, [currentSite]);

  const filteredProducts = useMemo(() => {
    if (!currentSite) return [];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return currentSite.products
      .map((product, originalIndex) => ({ product, originalIndex }))
      .filter(({ product }) => {
        const searchableText = [
          product.name,
          product.brand,
          product.category,
          product.status,
          product.price,
          product.spec,
          product.shortDescription,
          product.description,
        ]
          .join(' ')
          .toLowerCase();

        const matchesCategory =
          activeCategory === '全部' ||
          product.category === activeCategory ||
          (activeCategory === '现货' && product.status === '现货') ||
          (activeCategory === '预订' && product.status === '预订');
        const matchesBrand = activeBrand === '全部品牌' || product.brand === activeBrand;
        const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);

        return matchesCategory && matchesBrand && matchesSearch;
      })
      .sort((a, b) => {
        const imageRank = Number(hasUploadedImage(b.product)) - Number(hasUploadedImage(a.product));
        return imageRank || a.originalIndex - b.originalIndex;
      })
      .map(({ product }) => product);
  }, [activeBrand, activeCategory, currentSite, searchTerm]);

  const displayProducts = useMemo(
    () => filteredProducts,
    [filteredProducts],
  );
  const displayedProductCount = displayProducts.length;

  useEffect(() => {
    const description = 'Nintendo Switch 2 本地官网价免税购买，支持标准版和 Mario Kart World 同捆版。';
    const metaDescription = document.querySelector('meta[name="description"]');
    const existingSchema = document.getElementById('switch-2-product-schema');

    if (!isSwitch2Detail) {
      document.title = detailProduct ? `${detailProduct.name}｜Duo Deals 美妆数码好价` : 'Duo Deals｜美妆数码好价';
      metaDescription?.setAttribute(
        'content',
        detailProduct?.shortDescription || 'Duo Deals｜美妆数码好价，美国本地美妆护肤、香水、电子产品和数码配件挑选，官网价免税购买。',
      );
      existingSchema?.remove();
      return;
    }

    document.title = 'Nintendo Switch 2｜Duo Deals 美妆数码好价';
    metaDescription?.setAttribute('content', description);

    const schemaScript = existingSchema || document.createElement('script');
    schemaScript.id = 'switch-2-product-schema';
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify(switch2Schema);
    if (!existingSchema) {
      document.head.appendChild(schemaScript);
    }
  }, [detailProduct, isSwitch2Detail]);

  const inquiryDraft = useMemo(() => {
    if (cartItems.length === 0) return '';

    const sections = [
      { section: 'Beauty', title: '【美妆护肤】' },
      { section: 'Tech', title: '【电子产品】' },
    ];

    const groupedText = sections
      .map(({ section, title }) => {
        const items = cartItems.filter((item) => item.section === section);
        if (items.length === 0) return '';

        const lines = items
          .map((item, index) => `${index + 1}. ${item.brand} ${item.name}\n规格：${item.spec}\n官网免税价：${item.price}\n数量：${item.quantity}`)
          .join('\n\n');

        return `${title}\n${lines}`;
      })
      .filter(Boolean)
      .join('\n\n');

    return `你好，我想购买以下商品，请帮我汇总购买和配送：\n\n${groupedText}\n\n取货方式：${pickupMethod}\n\n说明：网站标注的是官网价免税价，标多少按多少结算。\n\n我的微信：Lutissss`;
  }, [cartItems, pickupMethod]);

  const inquiryText =
    generatedInquiryText ||
    (cartItems.length === 0
      ? '请先把想买的商品加入购买清单，系统会在这里生成微信购买信息。'
      : '点击“生成购买信息”后，这里会整理好可复制发送给 Lutissss 的中文购买清单。');

  const addToCart = (product, openCart = false) => {
    setCartItems((items) => {
      const productKey = getCartItemKey(product);
      const existing = items.find((item) => getCartItemKey(item) === productKey);
      const quantityToAdd = product.quantity || 1;

      if (existing) {
        return items.map((item) => (getCartItemKey(item) === productKey ? { ...item, quantity: item.quantity + quantityToAdd } : item));
      }

      return [...items, { ...product, quantity: quantityToAdd }];
    });

    if (openCart) {
      setIsCartOpen(true);
    }
  };

  const incrementItem = (id) => {
    setCartItems((items) => items.map((item) => (getCartItemKey(item) === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const decrementItem = (id) => {
    setCartItems((items) =>
      items
        .map((item) => (getCartItemKey(item) === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => getCartItemKey(item) !== id));
  };

  const generateInquiryText = () => {
    if (cartItems.length === 0) return;
    setGeneratedInquiryText(inquiryDraft);
    setCopied(false);
  };

  const copyInquiryText = async () => {
    if (cartItems.length === 0) return;
    const textToCopy = generatedInquiryText || inquiryDraft;

    if (!generatedInquiryText) {
      setGeneratedInquiryText(inquiryDraft);
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-900">
      <TopNav
        route={route}
        onNavigate={navigate}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {isSwitch2Detail ? (
        <div className="min-h-screen bg-[#f7f8fa]">
          <main className="mx-auto max-w-7xl px-4 py-5 md:py-8">
            <button
              type="button"
              onClick={() => navigate('/electronics')}
              className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-950"
            >
              <ArrowLeft className="h-4 w-4" />
              返回电子产品专区
            </button>

            <section className="mb-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
              <div className="grid items-center gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="px-6 py-8 md:px-10 md:py-12">
                  <p className="text-sm font-black uppercase tracking-normal text-slate-500">Nintendo</p>
                  <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 md:text-6xl">Nintendo Switch 2</h1>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 md:text-base md:leading-7">
                    选择版本、配件和数量后加入购买清单。页面小计按官网价免税汇总，标多少按多少结算。
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {['全新现货 / 可预订', '官网价免税', 'WashU 附近线下自提或送货上门'].map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-100 p-6 md:p-10">
                  <img
                    src={switch2Product.image}
                    alt="Nintendo Switch 2"
                    className="mx-auto aspect-[1.2/1] w-full max-w-xl object-contain"
                  />
                </div>
              </div>
            </section>

            <Switch2Configurator
              product={switch2Product}
              onAddToCart={(item) => addToCart(item)}
              onBuyNow={(item) => addToCart(item, true)}
            />
          </main>
          <Footer site={siteConfigs.electronics} />
        </div>
      ) : detailProduct ? (
        <div className="min-h-screen bg-[#f7f8fa]">
          <main className="mx-auto max-w-7xl px-4 py-5 md:py-8">
            <button
              type="button"
              onClick={() => navigate('/electronics')}
              className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-950"
            >
              <ArrowLeft className="h-4 w-4" />
              返回电子产品专区
            </button>

            <section className="mb-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm shadow-slate-200/70">
              <div className="grid items-center gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="px-6 py-8 md:px-10 md:py-12">
                  <p className="text-sm font-black uppercase tracking-normal text-slate-500">{detailProduct.brand}</p>
                  <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 md:text-6xl">{detailProduct.name}</h1>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 md:text-base md:leading-7">
                    {detailProduct.shortDescription}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {['全新商品', '官网价免税', 'WashU 附近线下自提或送货上门'].map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-100 p-6 md:p-10">
                  <img
                    src={detailProduct.image}
                    alt={detailProduct.name}
                    className="mx-auto aspect-[1.2/1] w-full max-w-xl object-contain"
                  />
                </div>
              </div>
            </section>

            <ProductConfigurator
              product={detailProduct}
              onAddToCart={(item) => addToCart(item)}
              onBuyNow={(item) => addToCart(item, true)}
            />
          </main>
          <Footer site={siteConfigs.electronics} />
        </div>
      ) : !currentSite ? (
        <SiteGateway onNavigate={navigate} />
      ) : (
        <div className={`min-h-screen ${currentSite.pageClass}`}>
          <CategoryTabs categories={currentSite.categories} activeCategory={activeCategory} onChange={setActiveCategory} />
          <Header site={currentSite} onNavigate={navigate} />
          <BrandFilter brands={availableBrands} activeBrand={activeBrand} onChange={setActiveBrand} />

          <main className={`${currentSite.pageClass} px-4 py-5 md:py-8`}>
            <section id="product-section" className="mx-auto max-w-7xl">
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-500">热门商品</p>
                  <h2 className="text-2xl font-black leading-tight text-slate-950">
                    热门{currentSite.shortName}
                  </h2>
                </div>
                <p className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-600 ring-1 ring-slate-200">
                  共 {displayedProductCount} 件
                </p>
              </div>

              {displayedProductCount > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:gap-4">
                    {displayProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(item) => addToCart(item)}
                      onInquiry={(item) => addToCart(item, true)}
                      onViewDetails={navigate}
                    />
                    ))}
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {serviceBenefits.map(({ title, description, icon: Icon }) => (
                      <div key={title} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-950 ring-1 ring-slate-200">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-sm font-black text-slate-950">{title}</span>
                          <span className="mt-0.5 block text-xs font-medium text-slate-500">{description}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
                  <p className="font-semibold text-slate-900">暂时没有匹配的商品</p>
                  <p className="mt-2 text-sm text-slate-500">可以换个关键词，或选择“全部”再看看。</p>
                </div>
              )}
            </section>
          </main>

          <Footer site={currentSite} />
        </div>
      )}

      <InquiryCart
        items={cartItems}
        pickupMethod={pickupMethod}
        onPickupChange={setPickupMethod}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onRemove={removeItem}
        inquiryText={inquiryText}
        copied={copied}
        onGenerate={generateInquiryText}
        onCopy={copyInquiryText}
        isOpen={isCartOpen}
        onToggle={() => setIsCartOpen((open) => !open)}
      />
    </div>
  );
}
