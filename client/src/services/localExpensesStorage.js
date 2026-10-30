const STORAGE_KEY = "spendly-expenses-v1";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function nextId(list) {
  if (list.length === 0) {
    return 1;
  }
  return Math.max(...list.map((item) => item.id)) + 1;
}

export function fetchExpensesLocal() {
  return Promise.resolve(readAll());
}

export function fetchExpenseByIdLocal(id) {
  const numericId = Number(id);
  const expense = readAll().find((item) => item.id === numericId);
  if (!expense) {
    return Promise.reject(new Error(`id ${id} ile harcama bulunamadı.`));
  }
  return Promise.resolve(expense);
}

export function createExpenseLocal(payload) {
  const now = new Date().toISOString();
  const list = readAll();
  const created = {
    id: nextId(list),
    ...payload,
    description: payload.description ?? "",
    createdAt: now,
    updatedAt: now,
  };
  list.push(created);
  writeAll(list);
  return Promise.resolve(created);
}

export function updateExpenseLocal(id, payload) {
  const numericId = Number(id);
  const list = readAll();
  const index = list.findIndex((item) => item.id === numericId);
  if (index === -1) {
    return Promise.reject(new Error(`id ${id} ile harcama bulunamadı.`));
  }
  const now = new Date().toISOString();
  const updated = {
    ...list[index],
    ...payload,
    description: payload.description ?? "",
    id: list[index].id,
    createdAt: list[index].createdAt,
    updatedAt: now,
  };
  list[index] = updated;
  writeAll(list);
  return Promise.resolve(updated);
}

export function deleteExpenseLocal(id) {
  const numericId = Number(id);
  const list = readAll();
  const next = list.filter((item) => item.id !== numericId);
  if (next.length === list.length) {
    return Promise.reject(new Error(`id ${id} ile harcama bulunamadı.`));
  }
  writeAll(next);
  return Promise.resolve();
}

export function usesLocalStorageMode() {
  return import.meta.env.PROD && !import.meta.env.VITE_API_URL;
}
