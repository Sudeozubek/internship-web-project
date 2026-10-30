import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ExpenseForm from "../components/ExpenseForm";
import {
  fetchExpenseById,
  getErrorMessage,
  updateExpense,
} from "../services/expensesApi";

export default function EditExpensePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  async function handleSubmit(payload) {
    setSaving(true);
    setError("");
    try {
      await updateExpense(id, payload);
      navigate(`/expenses/${id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-slate-500">Yükleniyor…</p>;
  }

  if (error && !expense) {
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
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        to={`/expenses/${id}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Detaya dön
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Harcamayı düzenle</h1>
        {error && expense && (
          <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}
        <div className="mt-6">
          <ExpenseForm
            initialValues={expense}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/expenses/${id}`)}
            submitLabel="Güncelle"
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
}
