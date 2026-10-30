# Backend deploy (isteğe bağlı)

Staj **frontend (Netlify)** teslimi için Express’i ayrı host etmek **zorunlu değil**. API, [`netlify/functions/expenses.js`](../netlify/functions/expenses.js) ile Netlify üzerinde çalışır.

Postman ödevin ve local geliştirme için Express (`npm start`) repoda durur.

Ayrı public Express URL istersen [Render](https://render.com) → Web Service → `npm install` / `npm start`, `CORS_ORIGIN` = Netlify URL, frontend’de `VITE_API_URL` = Render URL.
