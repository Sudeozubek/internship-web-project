import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { formatMoney } from "../helpers";
import {
  deleteExpense,
  fetchExpenseById,
  getErrorMessage,
} from "../services/expensesApi";

export default function ExpenseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchExpenseById(id);
        if (!cancelled) {
          setExpense(data);
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
  }, [id]);

  async function handleDelete() {
    try {
      await deleteExpense(id);
      navigate("/expenses", { state: { message: "Harcama silindi." } });
    } catch (err) {
      setNotice(getErrorMessage(err));
    }
  }

  if (loading) {
    return <p className="text-slate-500">Yükleniyor…</p>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link to="/expenses" className="inline-flex items-center gap-1 text-sm text-emerald-600">
          <ArrowLeft className="h-4 w-4" />
          Listeye dön
        </Link>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/expenses"
        className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Harcamalar
      </Link>

      {notice && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {notice}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{expense.title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {expense.category} · {expense.date}
            </p>
          </div>
          <p className="text-2xl font-semibold text-emerald-600">{formatMoney(expense.amount)}</p>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-slate-500">Açıklama</dt>
            <dd className="mt-1 text-sm text-slate-800">
              {expense.description || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-slate-500">Oluşturulma</dt>
            <dd className="mt-1 text-sm text-slate-800">{expense.createdAt}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-slate-500">Son güncelleme</dt>
            <dd className="mt-1 text-sm text-slate-800">{expense.updatedAt}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            to={`/expenses/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Pencil className="h-4 w-4" />
            Düzenle
          </Link>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Sil
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setConfirmDelete(false)}
            aria-label="Vazgeç"
          />
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Silinsin mi?</h2>
            <p className="mt-2 text-sm text-slate-600">{expense.title} kalıcı olarak silinecek.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
