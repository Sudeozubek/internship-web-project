import { useEffect, useState } from "react";
import { CATEGORIES } from "../constants";

const emptyForm = {
  title: "",
  amount: "",
  category: CATEGORIES[0],
  description: "",
  date: new Date().toISOString().slice(0, 10),
};

function buildInitialValues(initialValues) {
  if (!initialValues) {
    return emptyForm;
  }
  return {
    title: initialValues.title ?? "",
    amount: String(initialValues.amount ?? ""),
    category: initialValues.category ?? CATEGORIES[0],
    description: initialValues.description ?? "",
    date: initialValues.date ?? emptyForm.date,
  };
}

export default function ExpenseForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Kaydet",
  loading = false,
}) {
  const [form, setForm] = useState(() => buildInitialValues(initialValues));
  const [errors, setErrors] = useState({});

  // Düzenleme sayfasında veri API'den gelince formu dolduruyorum.
  useEffect(() => {
    if (initialValues) {
      setForm(buildInitialValues(initialValues));
    }
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.title.trim()) {
      nextErrors.title = "Başlık zorunlu.";
    }

    const amount = Number(form.amount);
    if (!form.amount || Number.isNaN(amount) || amount <= 0) {
      nextErrors.amount = "Tutar pozitif bir sayı olmalı.";
    }

    if (!form.category.trim()) {
      nextErrors.category = "Kategori seç.";
    }

    if (!form.date.trim()) {
      nextErrors.date = "Tarih zorunlu.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const payload = {
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category.trim(),
      description: form.description.trim(),
      date: form.date.trim(),
    };

    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="title">
          Başlık
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="amount">
            Tutar (₺)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="date">
            Tarih
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="category">
          Kategori
        </label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="description">
          Açıklama (isteğe bağlı)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <div className="flex flex-wrap justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Vazgeç
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Kaydediliyor…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
