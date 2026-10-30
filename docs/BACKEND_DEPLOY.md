# Backend deploy (isteğe bağlı)

Staj **frontend (Netlify)** teslimi için Express’i ayrı host etmek **zorunlu değil**. Netlify’da [`client/netlify/functions/expenses.js`](../client/netlify/functions/expenses.js) ayrı bir in-memory API sağlar; **`src/` backend koduna bağlı değildir**. Frontend ayrıca `VITE_API_URL` yoksa localStorage demo moduna düşebilir.

Postman ödevin ve local geliştirme için Express (`npm start`) repoda durur.

Ayrı public Express URL istersen [Render](https://render.com) → Web Service → `npm install` / `npm start`, `CORS_ORIGIN` = Netlify URL, frontend’de `VITE_API_URL` = Render URL.
