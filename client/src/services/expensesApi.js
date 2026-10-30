import axios from "axios";
import {
  createExpenseLocal,
  deleteExpenseLocal,
  fetchExpenseByIdLocal,
  fetchExpensesLocal,
  updateExpenseLocal,
  usesLocalStorageMode,
} from "./localExpensesStorage";

function resolveBaseURL() {
  const fromEnv = import.meta.env.VITE_API_URL;
  if (typeof fromEnv === "string" && fromEnv.trim() !== "") {
    return fromEnv.trim().replace(/\/$/, "");
  }
  return "";
}

const baseURL = resolveBaseURL();
const localMode = usesLocalStorageMode();

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

export function isLocalDemoMode() {
  return localMode;
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
  if (localMode) {
    return fetchExpensesLocal();
  }
  const response = await api.get("/api/expenses");
  const body = unwrapSuccess(response);
  return body.data ?? [];
}

export async function fetchExpenseById(id) {
  if (localMode) {
    return fetchExpenseByIdLocal(id);
  }
  const response = await api.get(`/api/expenses/${id}`);
  const body = unwrapSuccess(response);
  return body.data;
}

export async function createExpense(payload) {
  if (localMode) {
    return createExpenseLocal(payload);
  }
  const response = await api.post("/api/expenses", payload);
  const body = unwrapSuccess(response);
  return body.data;
}

export async function updateExpense(id, payload) {
  if (localMode) {
    return updateExpenseLocal(id, payload);
  }
  const response = await api.put(`/api/expenses/${id}`, payload);
  const body = unwrapSuccess(response);
  return body.data;
}

export async function deleteExpense(id) {
  if (localMode) {
    return deleteExpenseLocal(id);
  }
  const response = await api.delete(`/api/expenses/${id}`);
  unwrapSuccess(response);
}
