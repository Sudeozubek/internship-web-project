const {
  addExpense,
  getAllExpenses: getAllExpensesFromStore,
  findExpenseById,
  replaceExpense,
  deleteExpenseById,
} = require("../data/expenses");
const { validateExpenseBody } = require("../../shared/expenseValidation");

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
 * İstemci güncel title, amount, category, date (ve isteğe bağlı description) gönderir.
 * Eksik veya geçersiz alan → 400. Kayıt yok → 404.
 * replaceExpense id ve createdAt'i korur; updatedAt yenilenir.
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
 * Gövde gerekmez. Başarıda açık bir mesaj dönerim (PDF / teslim için anlaşılır olsun).
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
