# Spendly — Postman Test Rehberi

## Hazırlık

1. Proje klasöründe `npm install` (ilk kez).
2. `npm start` — terminalde `Spendly API dinleniyor: http://localhost:3000` görünmeli.
3. Postman'de koleksiyon import — aşağıdaki **Import** bölümüne bakın.
4. Koleksiyon değişkeni `baseUrl` = `http://localhost:3000` (varsayılan)

## Postman — koleksiyonu içe aktarma

### macOS (en hızlı)

Terminalde proje klasöründen:

```bash
open -a Postman postman/Spendly.postman_collection.json
```

Postman açılır; **Import** penceresinde dosyayı onaylayın.

### Elle import

1. Postman → sol üst **Import**
2. **Upload Files** → `postman/Spendly.postman_collection.json` seçin
3. **Import** — sol panelde **Spendly API** koleksiyonu görünür
4. Koleksiyona tıklayın → **Variables** → `baseUrl` = `http://localhost:3000`

Eski koleksiyon varsa: **Spendly API** → sağ tık **Delete**, sonra yeniden import.

### Terminalden tüm istekleri çalıştırma (Postman yerine)

API ayaktayken (`npm start`):

```bash
npm install
npm run test:postman
```

Bu, koleksiyondaki istekleri Newman ile sırayla gönderir (Postman import etmeden doğrulama).

## Önerilen test sırası (CRUD)

Sunucu her restart'ta bellek sıfırlanır; sırayı tek oturumda uygulayın.

| Sıra | İstek | Beklenen kod | Not |
|------|--------|--------------|-----|
| 1 | POST Create Expense | 201 | `data.id` değerini not alın |
| 2 | GET List Expenses | 200 | `data` içinde en az 1 kayıt |
| 3 | GET Expense by ID | 200 | URL'deki id = POST'tan gelen id |
| 4 | PUT Update Expense (full) | 200 | Tüm zorunlu alanlar body'de |
| 5 | DELETE Expense | 200 | `message` ile silindi |
| 6 | GET Expense by ID (aynı id) | 404 | Silindikten sonra |

## Örnek POST body

```json
{
  "title": "Kahve",
  "amount": 45,
  "category": "Food",
  "description": "latte",
  "date": "2026-10-14"
}
```

## Örnek PUT body (tam güncelleme)

```json
{
  "title": "Kahve XL",
  "amount": 55,
  "category": "Food",
  "description": "sütlü",
  "date": "2026-10-15"
}
```

## Olmayan ID testi

- `GET http://localhost:3000/api/expenses/99999` → **404**
- Mesaj: `id 99999 ile harcama bulunamadı.`

## Bozuk JSON testi

- POST `/api/expenses`
- Header: `Content-Type: application/json`
- Body (raw): `{"title":`  (kasıtlı hatalı)
- Beklenen: **400**, `Geçersiz JSON gövdesi...`

## Logger kontrolü

`npm start` çalışan terminalde her istekten sonra şuna benzer satır:

```text
[2026-10-14T18:14:55.760Z] POST /api/expenses
```

Method, endpoint ve ISO zaman damgası görünmeli.

## Ekran görüntüleri (teslim)

Postman **CRUD** ekran görüntüleri repoda: `docs/screenshots/backend/` (01–06). Dosya adları:

- `01-post-create.png` … `05-delete.png` (zorunlu 5 adım)
- `06-get-not-found.png` (silme sonrası 404 — önerilir)

PDF teslim formu için status + body görünsün. Frontend görselleri: `docs/screenshots/frontend/`.
