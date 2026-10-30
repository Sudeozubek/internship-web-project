import axios from "axios";

// Local: .env içinde VITE_API_URL=http://localhost:3000
// Netlify: boş bırak → aynı sitedeki /api/expenses (Functions) kullanılır
function resolveBaseURL() {
  const fromEnv = import.meta.env.VITE_API_URL;
  if (typeof fromEnv === "string" && fromEnv.trim() !== "") {
    return fromEnv.trim().replace(/\/$/, "");
  }
  return "";
}

const baseURL = resolveBaseURL();

const api = axios.create({
  baseURL: baseURL || undefined,
  headers: { "Content-Type": "application/json" },
});

function unwrapSuccess(response) {
  const body = response.data;
  if (body?.success === false) {
    throw new Error(body.message || "İstek başarısız.");
  }
  return body;
}

export function getErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "Beklenmeyen bir hata oluştu.";
}

export async function fetchExpenses() {
  const response = await api.get("/api/expenses");
  const body = unwrapSuccess(response);
  return body.data ?? [];
}

export async function fetchExpenseById(id) {
  const response = await api.get(`/api/expenses/${id}`);
  const body = unwrapSuccess(response);
  return body.data;
}

export async function createExpense(payload) {
  const response = await api.post("/api/expenses", payload);
  const body = unwrapSuccess(response);
  return body.data;
}

export async function updateExpense(id, payload) {
  const response = await api.put(`/api/expenses/${id}`, payload);
  const body = unwrapSuccess(response);
  return body.data;
}

export async function deleteExpense(id) {
  const response = await api.delete(`/api/expenses/${id}`);
  unwrapSuccess(response);
}
