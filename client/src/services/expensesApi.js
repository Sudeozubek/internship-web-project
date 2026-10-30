import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  console.warn("VITE_API_URL tanımlı değil. .env dosyasını kontrol et.");
}

const api = axios.create({
  baseURL,
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
