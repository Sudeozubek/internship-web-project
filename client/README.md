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

Repo kökünde [`netlify.toml`](../netlify.toml):

- Frontend: `client/` → `dist`
- **API:** `netlify/functions/expenses.js` — canlı sitede `/api/expenses` (Render **gerekmez**)

### GitHub → Netlify

1. Repoyu GitHub’a push et.
2. Netlify → Import repo → deploy.
3. **`VITE_API_URL` ekleme** — boş bırak; frontend aynı domaindeki `/api` yolunu kullanır.
4. Kod güncellediysen: **Clear cache and deploy**.

Local `.env`: `VITE_API_URL=http://localhost:3000` (Express için).

## Deployment checklist

1. Public GitHub repo
2. `netlify.toml` + `netlify/functions/` commit edildi
3. Netlify build başarılı
4. Canlı sitede CRUD çalışıyor
5. `/expenses/...` sayfasında F5 → SPA 200
6. En az bir frontend screenshot

## Troubleshooting

| Belirti | Olası neden | Çözüm |
|--------|-------------|--------|
| CORS / Network Error | Backend izin vermiyor | `CORS_ORIGIN` = Netlify URL |
| İstekler localhost’a gidiyor | Eski build | Netlify env + redeploy |
| Sayfa yenilemede 404 | SPA redirect yok | `netlify.toml` redirects |
| Liste boş | API bellekte; restart | Normal; yeni kayıt ekleyin |
| Mixed content | HTTP API + HTTPS site | API’yi HTTPS yapın |

## Ekran görüntüleri

Başlığa tıklayarak tam boyutu açın (`docs/screenshots/frontend/`):

- [Dashboard](../docs/screenshots/frontend/01-dashboard.png)
- [Harcamalar listesi](../docs/screenshots/frontend/02-expenses-list.png)
- [Yeni harcama modalı](../docs/screenshots/frontend/03-add-expense-modal.png)

Netlify build sonrası aynı dosyalar `public/screenshots/` altından da `/screenshots/01-dashboard.png` ile erişilebilir.
