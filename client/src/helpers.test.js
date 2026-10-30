import { describe, expect, it, vi } from "vitest";
import {
  filterExpenses,
  getCategoryMaxAmount,
  getCurrentMonthTotal,
  getTotalAmount,
  groupByCategory,
} from "./helpers";

const sample = [
  {
    id: 1,
    title: "Kahve",
    amount: 45,
    category: "Food",
    description: "latte",
    date: "2026-10-14",
  },
  {
    id: 2,
    title: "Otobüs",
    amount: 30,
    category: "Transportation",
    description: "",
    date: "2026-10-20",
  },
  {
    id: 3,
    title: "Market",
    amount: 120,
    category: "Food",
    description: "haftalık",
    date: "2026-10-25",
  },
];

describe("getTotalAmount", () => {
  it("tüm tutarları toplar", () => {
    expect(getTotalAmount(sample)).toBe(195);
  });
});

describe("groupByCategory", () => {
  it("kategori toplamlarını azalan sırada döner", () => {
    expect(groupByCategory(sample)).toEqual([
      ["Food", 165],
      ["Transportation", 30],
    ]);
  });
});

describe("getCurrentMonthTotal", () => {
  it("içinde bulunulan ayın harcamalarını toplar", () => {
    vi.setSystemTime(new Date("2026-10-30T12:00:00Z"));
    expect(getCurrentMonthTotal(sample)).toBe(195);
    vi.useRealTimers();
  });
});

describe("filterExpenses", () => {
  it("kategori ve arama birlikte çalışır", () => {
    const result = filterExpenses(sample, {
      search: "lat",
      category: "Food",
    });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Kahve");
  });
});

describe("getCategoryMaxAmount", () => {
  it("boş liste için 0 döner", () => {
    expect(getCategoryMaxAmount([])).toBe(0);
  });
});
