import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGet, mockPost, mockPut, mockDelete } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPut: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete,
    })),
  },
}));

import {
  createExpense,
  deleteExpense,
  fetchExpenseById,
  fetchExpenses,
  getErrorMessage,
  updateExpense,
} from "./expensesApi";

describe("getErrorMessage", () => {
  it("API message alanını kullanır", () => {
    const error = {
      response: { data: { message: "title zorunludur." } },
    };
    expect(getErrorMessage(error)).toBe("title zorunludur.");
  });

  it("message yoksa Error mesajına düşer", () => {
    expect(getErrorMessage(new Error("Network Error"))).toBe("Network Error");
  });

  it("bilinmeyen hatada varsayılan metin döner", () => {
    expect(getErrorMessage({})).toBe("Beklenmeyen bir hata oluştu.");
  });
});

describe("fetchExpenses", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("başarılı yanıttan dizi döner", async () => {
    mockGet.mockResolvedValue({
      data: { success: true, data: [{ id: 1, title: "Test", amount: 10 }] },
    });

    const result = await fetchExpenses();
    expect(mockGet).toHaveBeenCalledWith("/api/expenses");
    expect(result).toHaveLength(1);
  });

  it("success false ise hata fırlatır", async () => {
    mockGet.mockResolvedValue({
      data: { success: false, message: "Sunucu hatası" },
    });

    await expect(fetchExpenses()).rejects.toThrow("Sunucu hatası");
  });
});

describe("fetchExpenseById", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("tek kayıt döner", async () => {
    const expense = { id: 2, title: "Kahve", amount: 45 };
    mockGet.mockResolvedValue({ data: { success: true, data: expense } });

    await expect(fetchExpenseById("2")).resolves.toEqual(expense);
    expect(mockGet).toHaveBeenCalledWith("/api/expenses/2");
  });
});

describe("createExpense", () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  it("POST gövdesi ile oluşturur", async () => {
    const payload = {
      title: "Çay",
      amount: 20,
      category: "Food",
      description: "",
      date: "2026-10-30",
    };
    const created = { id: 1, ...payload };
    mockPost.mockResolvedValue({ data: { success: true, data: created } });

    await expect(createExpense(payload)).resolves.toEqual(created);
    expect(mockPost).toHaveBeenCalledWith("/api/expenses", payload);
  });
});

describe("updateExpense", () => {
  beforeEach(() => {
    mockPut.mockReset();
  });

  it("PUT ile günceller", async () => {
    const payload = {
      title: "Çay XL",
      amount: 25,
      category: "Food",
      description: "",
      date: "2026-10-30",
    };
    mockPut.mockResolvedValue({ data: { success: true, data: { id: 1, ...payload } } });

    await updateExpense(1, payload);
    expect(mockPut).toHaveBeenCalledWith("/api/expenses/1", payload);
  });
});

describe("deleteExpense", () => {
  beforeEach(() => {
    mockDelete.mockReset();
  });

  it("DELETE çağrısı yapar", async () => {
    mockDelete.mockResolvedValue({
      data: { success: true, message: "id 1 harcama silindi." },
    });

    await expect(deleteExpense(1)).resolves.toBeUndefined();
    expect(mockDelete).toHaveBeenCalledWith("/api/expenses/1");
  });
});
