// Express paketini projeme dahil ediyorum.
// CommonJS'de dış paketleri require ile çağırırım.
const express = require("express");
const logger = require("./middleware/logger");
const expenseRoutes = require("./routes/expenseRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

// Uygulama nesnesi: route'ları ve middleware'leri buraya bağlayacağım.
// Henüz sunucu dinlemiyor; sadece "nasıl cevap vereceğim" planı burada.
const app = express();

// Logger'ı route'lardan önce tutuyorum; mümkün olduğunca erken koyarak
// bozuk JSON gibi durumlarda da isteğin method ve path'ini görebilirim.
app.use(logger);

// React (Netlify/Vite) farklı porttan istek atınca tarayıcı CORS ister; CRUD mantığına dokunmuyorum.
app.use((req, res, next) => {
  const allowedOrigin = process.env.CORS_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// express.json() bir middleware'dir.
// İstemci POST/PUT ile JSON gönderdiğinde gövdeyi okuyup req.body'ye yazması için bunu eklemem gerekir.
app.use(express.json());

// Harcama API'si: router içindeki path'ler "/" ile başlar, burada önek "/api/expenses" eklenir.
// Örnek: router.post("/") → dışarıdan POST /api/expenses
app.use("/api/expenses", expenseRoutes);

// Geçici test route: sunucunun ayakta olduğunu kontrol etmek için.
// Tarayıcı veya Postman ile GET http://localhost:3000/ yapılabilir.
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Spendly API çalışıyor.",
  });
});

// Eşleşmeyen path'ler için 404 — route'lardan sonra olmalı.
app.use(notFound);

// Hata yakalama en sonda; bozuk JSON ve beklenmeyen 500'ler burada.
app.use(errorHandler);

// Bu dosyayı başka dosyalarda (server.js) kullanmak için dışa aktarıyorum.
module.exports = app;
