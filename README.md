# Spendly API

Basit harcama takip **REST API** — Node.js, Express.js ve bellek içi depolama ile staj bitirme projesi.

## Özellikler

- Harcama CRUD (oluştur, listele, detay, tam güncelleme, sil)
- Custom logger middleware (method, endpoint, zaman damgası)
- Tutarlı JSON yanıtlar ve temel hata yönetimi (400, 404, 500)

## Teknoloji

- Node.js
- Express.js 5.x
- JavaScript (CommonJS)
- In-memory array (veritabanı yok)

## Klasör yapısı

```text
spendly-api/
├── client/                   ← React frontend (Vite + Tailwind)
├── netlify.toml              ← Netlify build (base: client)
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/
│   │   └── expenseRoutes.js
│   ├── controllers/
│   │   └── expenseController.js
│   ├── middleware/
│   │   ├── logger.js
│   │   ├── notFound.js
│   │   └── errorHandler.js
│   └── data/
│       └── expenses.js
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   ├── DATA_MODEL.md
│   ├── API_DESIGN.md
│   ├── POSTMAN_TESTING.md
│   └── screenshots/          ← Postman + frontend görselleri
├── postman/
│   └── Spendly.postman_collection.json
├── package.json
└── README.md
```

## Frontend (`client/`)

React dashboard; tüm CRUD işlemleri bu API üzerinden yapılır.

```bash
# Terminal 1 — API
npm start

# Terminal 2 — arayüz
cd client
cp .env.example .env
npm install
npm run dev
```

Tarayıcı CORS için (Vite varsayılan portu):

```bash
CORS_ORIGIN=http://localhost:5173 npm start
```

Detaylı kurulum, Netlify deploy ve checklist: [client/README.md](client/README.md)

## API ekran görüntüleri (Postman CRUD)

Başlığa tıklayın; GitHub veya editörde tam boyut açılır. Test rehberi: [docs/POSTMAN_TESTING.md](docs/POSTMAN_TESTING.md)

1. [POST — harcama oluştur (201)](docs/screenshots/backend/01-post-create.png)
2. [GET — tüm harcamalar (200)](docs/screenshots/backend/02-get-list.png)
3. [GET — id ile detay (200)](docs/screenshots/backend/03-get-by-id.png)
4. [PUT — tam güncelleme (200)](docs/screenshots/backend/04-put-update.png)
5. [DELETE — sil (200)](docs/screenshots/backend/05-delete.png)
6. [GET — silinen kayıt (404)](docs/screenshots/backend/06-get-not-found.png)

## Arayüz ekran görüntüleri (frontend)

Başlığa tıklayın; GitHub veya editörde tam boyut açılır.

- [Dashboard — özet, kategoriler, son harcamalar](docs/screenshots/frontend/01-dashboard.png)
- [Harcamalar — liste, arama ve filtre](docs/screenshots/frontend/02-expenses-list.png)
- [Yeni harcama — ekleme formu (modal)](docs/screenshots/frontend/03-add-expense-modal.png)

## Kurulum ve çalıştırma (API)

```bash
git clone <repo-url>
cd spendly-backend-project
npm install
npm start
```

Sunucu varsayılan olarak **http://localhost:3000** adresinde dinler.

Farklı port:

```bash
PORT=4000 npm start
```

## Endpoint özetı

| Method | URL | Açıklama |
|--------|-----|----------|
| GET | `/` | API çalışıyor mesajı |
| POST | `/api/expenses` | Harcama oluştur |
| GET | `/api/expenses` | Liste |
| GET | `/api/expenses/:id` | Detay |
| PUT | `/api/expenses/:id` | Tam güncelleme |
| DELETE | `/api/expenses/:id` | Sil |

Detaylı istek/yanıt örnekleri: [docs/API_DESIGN.md](docs/API_DESIGN.md)

### Örnek oluşturma (POST)

```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"title":"Kahve","amount":45,"category":"Food","date":"2026-10-14"}'
```

## Postman

1. `npm start` açık olsun.
2. Postman → Import → `postman/Spendly.postman_collection.json`
3. Adım adım test: [docs/POSTMAN_TESTING.md](docs/POSTMAN_TESTING.md)

## Bilinen sınırlamalar

- Veriler **yalnızca RAM**'de; sunucu yeniden başladığında silinir.
- Kimlik doğrulama yok.
- Sunucu tarafında filtreleme / sayfalama / raporlama yok (frontend istemci tarafında arama/filtre yapar).

## CORS (frontend / Netlify)

Tarayıcıdan farklı origin ile istek için `src/app.js` içinde minimal CORS vardır.

- Geliştirme: `CORS_ORIGIN=http://localhost:5173`
- Production: `CORS_ORIGIN=https://SIZIN-SITE.netlify.app`

## GitHub'a yayınlama

1. GitHub'da **public** boş repo oluşturun.
2. Proje klasöründe:

```bash
git init
git add .
git commit -m "Spendly REST API bitirme projesi"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/spendly-api.git
git push -u origin main
```

3. `.env` veya şifre dosyası **commit etmeyin** (`node_modules` zaten `.gitignore` içinde).
4. Teslim için `docs/PROJECT_OVERVIEW.md`, bu README ve `docs/screenshots/` içindeki Postman görsellerinin repoda olduğundan emin olun.

## Dokümantasyon

- [Proje tanıtımı](docs/PROJECT_OVERVIEW.md)
- [Veri modeli](docs/DATA_MODEL.md)
- [API tasarımı](docs/API_DESIGN.md)
