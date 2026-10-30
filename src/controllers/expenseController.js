const {
  addExpense,
  getAllExpenses: getAllExpensesFromStore,
  findExpenseById,
  replaceExpense,
  deleteExpenseById,
} = require("../data/expenses");

/**
 * POST ve PUT için ortak doğrulama.
 * Tam güncelleme (PUT) kısmi alan kabul etmez — tüm zorunlu alanlar body'de olmalı.
 */
function validateExpenseBody(body) {
  if (body === undefined || body === null) {
    return {
      error: {
        status: 400,
        message:
          "İstek gövdesi (JSON) gerekli. Header: Content-Type: application/json",
      },
    };
  }

  const { title, amount, category, description, date } = body;

  if (typeof title !== "string" || title.trim() === "") {
    return {
      error: { status: 400, message: "title zorunludur ve boş olamaz." },
    };
  }

  let numericAmount = amount;
  if (typeof amount === "string" && amount.trim() !== "") {
    numericAmount = Number(amount);
  }

  if (
    typeof numericAmount !== "number" ||
    Number.isNaN(numericAmount) ||
    numericAmount <= 0
  ) {
    return {
      error: { status: 400, message: "amount pozitif bir sayı olmalıdır." },
    };
  }

  if (typeof category !== "string" || category.trim() === "") {
    return {
      error: { status: 400, message: "category zorunludur ve boş olamaz." },
    };
  }

  if (typeof date !== "string" || date.trim() === "") {
    return {
      error: { status: 400, message: "date zorunludur (örnek: 2026-10-14)." },
    };
  }

  if (description !== undefined && typeof description !== "string") {
    return {
      error: { status: 400, message: "description metin (string) olmalıdır." },
    };
  }

  return {
    payload: {
      title: title.trim(),
      amount: numericAmount,
      category: category.trim(),
      description: typeof description === "string" ? description : "",
      date: date.trim(),
    },
  };
}

/**
 * POST /api/expenses — yeni harcama kaydı oluşturur.
 */
function createExpense(req, res) {
  const validation = validateExpenseBody(req.body);

  if (validation.error) {
    return res.status(validation.error.status).json({
      success: false,
      message: validation.error.message,
    });
  }

  const newExpense = addExpense(validation.payload);

  return res.status(201).json({
    success: true,
    data: newExpense,
  });
}

/**
 * GET /api/expenses — bellekteki tüm harcamaları listeler.
 */
function getAllExpenses(req, res) {
  const expenses = getAllExpensesFromStore();

  return res.status(200).json({
    success: true,
    data: expenses,
  });
}

/**
 * GET /api/expenses/:id — tek bir harcamayı id ile getirir.
 */
function getExpenseById(req, res) {
  const { id } = req.params;
  const expense = findExpenseById(id);

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: `id ${id} ile harcama bulunamadı.`,
    });
  }

  return res.status(200).json({
    success: true,
    data: expense,
  });
}

/**
 * PUT /api/expenses/:id — tam güncelleme.
 */
function updateExpense(req, res) {
  const { id } = req.params;
  const existing = findExpenseById(id);

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: `id ${id} ile harcama bulunamadı.`,
    });
  }

  const validation = validateExpenseBody(req.body);

  if (validation.error) {
    return res.status(validation.error.status).json({
      success: false,
      message: validation.error.message,
    });
  }

  const updated = replaceExpense(existing, validation.payload);

  return res.status(200).json({
    success: true,
    data: updated,
  });
}

/**
 * DELETE /api/expenses/:id — harcamayı bellekten kaldırır.
 */
function deleteExpense(req, res) {
  const { id } = req.params;
  const deleted = deleteExpenseById(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: `id ${id} ile harcama bulunamadı.`,
    });
  }

  return res.status(200).json({
    success: true,
    message: `id ${id} harcama silindi.`,
  });
}

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
