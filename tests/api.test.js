const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../src/app");

const validPayload = {
  title: "Kahve",
  amount: 45,
  category: "Food",
  description: "latte",
  date: "2026-10-14",
};

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: response.status, data };
}

async function requestRaw(method, path, bodyString, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${baseUrl}${path}`);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method,
        headers: {
          ...headers,
          ...(bodyString
            ? { "Content-Length": Buffer.byteLength(bodyString) }
            : {}),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        });
      },
    );
    req.on("error", reject);
    if (bodyString) {
      req.write(bodyString);
    }
    req.end();
  });
}

describe("Spendly API CRUD", () => {
  it("POST geçerli JSON + Content-Type → 201", async () => {
    const { status, data } = await request("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });
    assert.equal(status, 201);
    assert.equal(data.success, true);
    assert.equal(data.data.title, validPayload.title);
  });

  it("POST Content-Type olmadan ama JSON gövde → 201 (Postman senaryosu)", async () => {
    const bodyString = JSON.stringify({ ...validPayload, title: "Çay" });
    const { status, data } = await requestRaw("POST", "/api/expenses", bodyString);
    assert.equal(status, 201);
    assert.equal(data.success, true);
  });

  it("POST amount string → 201", async () => {
    const { status, data } = await request("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validPayload, title: "Simit", amount: "12" }),
    });
    assert.equal(status, 201);
    assert.equal(data.data.amount, 12);
  });

  it("POST gövde yok → 400", async () => {
    const { status, data } = await request("/api/expenses", { method: "POST" });
    assert.equal(status, 400);
    assert.equal(data.success, false);
  });

  it("POST eksik title → 400", async () => {
    const { status, data } = await request("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 10, category: "Food", date: "2026-10-14" }),
    });
    assert.equal(status, 400);
    assert.match(data.message, /title/i);
  });

  it("GET list → 200", async () => {
    const { status, data } = await request("/api/expenses");
    assert.equal(status, 200);
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.data));
  });

  it("GET by id → 200 ve 404", async () => {
    const created = await request("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validPayload, title: "Detay test" }),
    });
    const id = created.data.data.id;

    const ok = await request(`/api/expenses/${id}`);
    assert.equal(ok.status, 200);

    const missing = await request("/api/expenses/999999");
    assert.equal(missing.status, 404);
  });

  it("PUT tam güncelleme → 200", async () => {
    const created = await request("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });
    const id = created.data.data.id;

    const { status, data } = await request(`/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Kahve XL",
        amount: 55,
        category: "Food",
        description: "sütlü",
        date: "2026-10-15",
      }),
    });
    assert.equal(status, 200);
    assert.equal(data.data.title, "Kahve XL");
  });

  it("DELETE → 200", async () => {
    const created = await request("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validPayload, title: "Silinecek" }),
    });
    const id = created.data.data.id;

    const deleted = await request(`/api/expenses/${id}`, { method: "DELETE" });
    assert.equal(deleted.status, 200);

    const gone = await request(`/api/expenses/${id}`);
    assert.equal(gone.status, 404);
  });
});
