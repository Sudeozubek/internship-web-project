# Spendly Frontend

React + Vite arayüzü; harcama verisi **Express REST API** üzerinden gelir (LocalStorage birincil depo değildir).

## Gereksinimler

- Node.js 18+
- Çalışan Spendly API (repo kökünde `npm start` → varsayılan `http://localhost:3000`)

## Kurulum

```bash
cd client
npm install
cp .env.example .env
```

`.env` içinde:

```env
VITE_API_URL=http://localhost:3000
```

API farklı porttaysa veya CORS kullanıyorsanız backend’de:

```bash
CORS_ORIGIN=http://localhost:5173 npm start
```

## Geliştirme

```bash
npm run dev
```

Tarayıcı: `http://localhost:5173`

## Production build

```bash
npm run build
npm run preview
```

Build çıktısı: `client/dist`

## Test

```bash
npm test
```

(Yalnızca saf JS yardımcı fonksiyonları — `helpers.test.js`.)

## Netlify deploy

Repo kökünde [`netlify.toml`](../netlify.toml) tanımlı:

| Ayar | Değer |
|------|--------|
| Base directory | `client` |
| Build command | `npm run build` |
| Publish directory | `dist` |
| SPA redirect | `/* → /index.html` (200) |

### GitHub → Netlify

1. Projeyi **public** GitHub repo’ya push edin (backend + `client/` birlikte).
2. [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project** → GitHub → repo seçin.
3. Ayarlar `netlify.toml` ile gelir; gerekirse Base directory = `client` doğrulayın.
4. **Site configuration → Environment variables** → **Add**:
   - Key: `VITE_API_URL`
   - Value: deploy edilmiş API URL (ör. `https://spendly-api.onrender.com`) — **localhost kullanmayın**
5. Deploy. Canlı site URL’ini kopyalayın (staj teslimi).
6. Backend host’ta `CORS_ORIGIN` = Netlify site URL (ör. `https://spendly-app.netlify.app`), ardından API’yi yeniden deploy edin.

Env değiştirdiğinizde **Deploys → Trigger deploy → Clear cache and deploy site**.

### Backend (Netlify dışında)

Netlify yalnızca statik frontend sunar. Express API’yi Render, Railway, Fly.io vb. üzerinde ayrı çalıştırın:

- `PORT` platform tarafından verilir
- Public HTTPS URL → frontend `VITE_API_URL`
- `CORS_ORIGIN` = Netlify origin (sondaki `/` olmadan)

## Deployment checklist

1. Public GitHub repo
2. `netlify.toml` commit edildi
3. `.env.example` var; `.env` commit edilmedi
4. Netlify’da `VITE_API_URL` = production API
5. Backend `CORS_ORIGIN` = Netlify URL
6. Netlify build başarılı
7. Canlı sitede dashboard ve harcamalar açılıyor
8. Canlı sitede CRUD çalışıyor
9. `/expenses/1` gibi URL’de F5 → 404 yok
10. En az bir ekran görüntüsü (`docs/screenshots/frontend/`)

## Troubleshooting

| Belirti | Olası neden | Çözüm |
|--------|-------------|--------|
| CORS / Network Error | Backend izin vermiyor | `CORS_ORIGIN` = Netlify URL |
| İstekler localhost’a gidiyor | Eski build | Netlify env + redeploy |
| Sayfa yenilemede 404 | SPA redirect yok | `netlify.toml` redirects |
| Liste boş | API bellekte; restart | Normal; yeni kayıt ekleyin |
| Mixed content | HTTP API + HTTPS site | API’yi HTTPS yapın |

## Ekran görüntüsü

Staj teslimi için uygulamadan en az bir görsel alın ve `docs/screenshots/frontend/` altına kaydedin (ör. `01-dashboard.png`).
