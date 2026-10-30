import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { fetchExpenses, getErrorMessage } from "../services/expensesApi";
import {
  formatMoney,
  getTotalAmount,
  groupByCategory,
  getCurrentMonthTotal,
  getRecentExpenses,
  getCategoryMaxAmount,
} from "../helpers";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchExpenses();
        if (!cancelled) {
          setExpenses(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = getTotalAmount(expenses);
  const monthTotal = getCurrentMonthTotal(expenses);
  const categoryGroups = groupByCategory(expenses);
  const categoryMax = getCategoryMaxAmount(categoryGroups);
  const recent = getRecentExpenses(expenses);

  if (loading) {
    return <p className="text-slate-500">Yükleniyor…</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Harcama özetin tek bakışta.</p>
        </div>
        <Link
          to="/expenses"
          state={{ openAddModal: true }}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Harcama ekle
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Toplam harcama</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">{formatMoney(total)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Kayıt sayısı</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{expenses.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <p className="text-sm text-slate-500">Bu ay</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{formatMoney(monthTotal)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Kategoriye göre</h2>
          {categoryGroups.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Henüz harcama yok.{" "}
              <Link
                to="/expenses"
                state={{ openAddModal: true }}
                className="font-medium text-emerald-600 hover:underline"
              >
                İlk kaydı ekle
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {categoryGroups.map(([category, amount]) => (
                <li key={category}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{category}</span>
                    <span className="text-slate-600">{formatMoney(amount)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: categoryMax ? `${(amount / categoryMax) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Son harcamalar</h2>
            <Link to="/expenses" className="text-sm font-medium text-emerald-600 hover:underline">
              Tümü
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Henüz harcama yok.{" "}
              <Link
                to="/expenses"
                state={{ openAddModal: true }}
                className="font-medium text-emerald-600 hover:underline"
              >
                Harcama ekle
              </Link>
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {recent.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <Link
                      to={`/expenses/${item.id}`}
                      className="font-medium text-slate-800 hover:text-emerald-600"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {item.category} · {item.date}
                    </p>
                  </div>
                  <span className="font-medium text-slate-900">{formatMoney(item.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
