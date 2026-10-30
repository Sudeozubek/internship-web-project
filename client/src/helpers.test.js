import { describe, expect, it, vi, afterEach } from "vitest";
import {
  filterExpenses,
  formatMoney,
  getCategoryMaxAmount,
  getCurrentMonthTotal,
  getRecentExpenses,
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

describe("formatMoney", () => {
  it("TRY formatında döner", () => {
    expect(formatMoney(45)).toMatch(/45/);
    expect(formatMoney(45)).toMatch(/₺|TRY/);
  });
});

describe("getTotalAmount", () => {
  it("tüm tutarları toplar", () => {
    expect(getTotalAmount(sample)).toBe(195);
  });

  it("boş dizi için 0 döner", () => {
    expect(getTotalAmount([])).toBe(0);
  });
});

describe("groupByCategory", () => {
  it("kategori toplamlarını azalan sırada döner", () => {
    expect(groupByCategory(sample)).toEqual([
      ["Food", 165],
      ["Transportation", 30],
    ]);
  });

  it("boş dizi için boş liste döner", () => {
    expect(groupByCategory([])).toEqual([]);
  });
});

describe("getCurrentMonthTotal", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("içinde bulunulan ayın harcamalarını toplar", () => {
    vi.setSystemTime(new Date("2026-10-30T12:00:00Z"));
    expect(getCurrentMonthTotal(sample)).toBe(195);
  });

  it("başka aydaki kayıtları saymaz", () => {
    vi.setSystemTime(new Date("2026-11-01T12:00:00Z"));
    expect(getCurrentMonthTotal(sample)).toBe(0);
  });
});

describe("getRecentExpenses", () => {
  it("tarihe göre yeniden eskiye sıralar", () => {
    const recent = getRecentExpenses(sample, 2);
    expect(recent.map((item) => item.title)).toEqual(["Market", "Otobüs"]);
  });

  it("limit kadar kayıt döner", () => {
    expect(getRecentExpenses(sample, 10)).toHaveLength(3);
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

  it("all kategorisinde sadece arama uygular", () => {
    const result = filterExpenses(sample, {
      search: "otob",
      category: "all",
    });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Otobüs");
  });

  it("açıklamada da arar", () => {
    const result = filterExpenses(sample, {
      search: "haftalık",
      category: "all",
    });
    expect(result[0].title).toBe("Market");
  });
});

describe("getCategoryMaxAmount", () => {
  it("boş liste için 0 döner", () => {
    expect(getCategoryMaxAmount([])).toBe(0);
  });

  it("en yüksek kategori tutarını döner", () => {
    expect(getCategoryMaxAmount(groupByCategory(sample))).toBe(165);
  });
});
