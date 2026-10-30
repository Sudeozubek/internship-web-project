export function formatMoney(amount) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(amount);
}

export function getTotalAmount(expenses) {
  return expenses.reduce((sum, item) => sum + item.amount, 0);
}

export function groupByCategory(expenses) {
  const totals = {};
  for (const item of expenses) {
    totals[item.category] = (totals[item.category] || 0) + item.amount;
  }
  return Object.entries(totals).sort((a, b) => b[1] - a[1]);
}

export function getCurrentMonthTotal(expenses) {
  const now = new Date();
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return expenses
    .filter((item) => item.date.startsWith(prefix))
    .reduce((sum, item) => sum + item.amount, 0);
}

export function getRecentExpenses(expenses, limit = 5) {
  return [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

export function filterExpenses(expenses, { search, category }) {
  let list = expenses;

  if (category && category !== "all") {
    list = list.filter((item) => item.category === category);
  }

  const query = search.trim().toLowerCase();
  if (query) {
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query),
    );
  }

  return list;
}

export function getCategoryMaxAmount(categoryGroups) {
  if (categoryGroups.length === 0) {
    return 0;
  }
  return Math.max(...categoryGroups.map(([, amount]) => amount));
}
