# Duo Deals｜美妆数码好价

美国本地美妆护肤与电子数码好价选品网站。

## 本地运行

```bash
npm install
npm run dev
```

## 部署

推荐使用 Vercel：

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

推送到 GitHub 后，在 Vercel 连接该仓库。之后每次修改商品数据并推送，网站会自动重新部署。

## 修改商品

- 美妆商品：`src/data/beautyProducts.js`
- 电子产品：`src/data/techProducts.js`
