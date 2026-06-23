import { useEffect, useMemo, useState } from 'react';
import BrandFilter from './components/BrandFilter.jsx';
import CategoryTabs from './components/CategoryTabs.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import InquiryCart from './components/InquiryCart.jsx';
import ProductCard from './components/ProductCard.jsx';
import SearchBar from './components/SearchBar.jsx';
import SiteGateway from './components/SiteGateway.jsx';
import TopNav from './components/TopNav.jsx';
import { beautyProducts } from './data/beautyProducts.js';
import { techProducts } from './data/techProducts.js';

const CART_STORAGE_KEY = 'duo-deals-inquiry-cart-v2';
const PICKUP_STORAGE_KEY = 'duo-deals-pickup-method-v1';
const LEGACY_CART_STORAGE_KEYS = ['duo-deals-inquiry-cart-v1', 'lewis-inquiry-cart-v1'];
const LEGACY_PICKUP_STORAGE_KEY = 'lewis-pickup-method-v1';
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
    eyebrow: 'Beauty & Skincare',
    heroTitle: '护肤 / 彩妆 / 香水 / 套装，美国本地好价精选',
    description: '本区专注美妆护肤、彩妆、香水和套装好价。色号、容量和库存以微信确认为准。',
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
    eyebrow: 'Tech & Accessories',
    heroTitle: 'Apple / Dyson / Switch / 数码配件，本地好价先看这里',
    description: '本区专注电子产品、数码配件和家用电器好价，商品主要通过美国本地渠道购入。贵重商品建议当面验货，价格和库存以微信确认为准。',
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
  return '/';
};

const getBrowserPath = (path) => {
  if (!BASE_PATH) return path;
  return `${BASE_PATH}${path === '/' ? '/' : path}`;
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
      price: '微信询价',
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

  const currentSite = route === '/beauty' ? siteConfigs.beauty : route === '/electronics' ? siteConfigs.electronics : null;
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

    return currentSite.products.filter((product) => {
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
    });
  }, [activeBrand, activeCategory, currentSite, searchTerm]);

  const inquiryDraft = useMemo(() => {
    if (cartItems.length === 0) return '';

    const sections = [
      { section: 'Beauty', title: '【Beauty 美妆护肤】' },
      { section: 'Tech', title: '【Tech 电子产品】' },
    ];

    const groupedText = sections
      .map(({ section, title }) => {
        const items = cartItems.filter((item) => item.section === section);
        if (items.length === 0) return '';

        const lines = items
          .map((item, index) => `${index + 1}. ${item.brand} ${item.name}\n规格：${item.spec}\n数量：${item.quantity}`)
          .join('\n\n');

        return `${title}\n${lines}`;
      })
      .filter(Boolean)
      .join('\n\n');

    return `你好，我想询价以下商品：\n\n${groupedText}\n\n取货方式：${pickupMethod}\n\n请问现在价格和库存是多少？`;
  }, [cartItems, pickupMethod]);

  const inquiryText =
    generatedInquiryText ||
    (cartItems.length === 0
      ? '请先把想询价的商品加入清单，系统会在这里生成微信询价内容。'
      : '点击“生成微信询价内容”后，这里会整理好可复制发送给微信的中文询价内容。');

  const addToCart = (product, openCart = false) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);

      if (existing) {
        return items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }

      return [...items, { ...product, quantity: 1 }];
    });

    if (openCart) {
      setIsCartOpen(true);
    }
  };

  const incrementItem = (id) => {
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const decrementItem = (id) => {
    setCartItems((items) =>
      items
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
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
      <TopNav route={route} onNavigate={navigate} onOpenCart={() => setIsCartOpen(true)} cartCount={cartCount} />

      {!currentSite ? (
        <SiteGateway onNavigate={navigate} />
      ) : (
        <div className={`min-h-screen ${currentSite.pageClass}`}>
          <Header site={currentSite} onNavigate={navigate} />
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryTabs categories={currentSite.categories} activeCategory={activeCategory} onChange={setActiveCategory} />
          <BrandFilter brands={availableBrands} activeBrand={activeBrand} onChange={setActiveBrand} />

          <main className={`${currentSite.pageClass} px-3 py-4`}>
            <section className="mx-auto max-w-screen-sm">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-emerald-700">商品列表</p>
                  <h2 className="text-xl font-bold leading-tight text-slate-950">
                    {currentSite.shortName}｜{activeCategory}
                  </h2>
                </div>
                <p className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-500 ring-1 ring-slate-200">
                  {filteredProducts.length} 件
                </p>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-1">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(item) => addToCart(item)}
                      onInquiry={(item) => addToCart(item, true)}
                    />
                  ))}
                </div>
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
