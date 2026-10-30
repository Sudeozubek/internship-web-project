const serverless = require("serverless-http");
const app = require("../../src/app");

// Netlify'da aynı Express uygulamasını çalıştırıyorum (local Postman ile aynı davranış).
module.exports.handler = serverless(app);
