const {
  addExpense,
  deleteExpenseById,
  findExpenseById,
  getAllExpenses,
  replaceExpense,
} = require("../../src/data/expenses");
const { validateExpenseBody } = require("../../shared/expenseValidation");

function respond(statusCode, payload) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
}

function parseExpenseId(event) {
  const path = event.path || "";
  const match =
    path.match(/\/api\/expenses\/([^/]+)/) ||
    path.match(/\/\.netlify\/functions\/expenses\/([^/]+)/);
  return match ? match[1] : null;
}

function parseJsonBody(event) {
  if (!event.body) {
    return { parsed: undefined };
  }

  let raw = event.body;
  if (event.isBase64Encoded) {
    raw = Buffer.from(event.body, "base64").toString("utf8");
  }

  try {
    return { parsed: JSON.parse(raw) };
  } catch {
    return {
      error: respond(400, {
        success: false,
        message: "Geçersiz JSON gövdesi. İstek gövdesini kontrol edin.",
      }),
    };
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, body: "" };
  }

  const id = parseExpenseId(event);
  const method = event.httpMethod;

  if (method === "GET" && !id) {
    return respond(200, { success: true, data: getAllExpenses() });
  }

  if (method === "GET" && id) {
    const expense = findExpenseById(id);
    if (!expense) {
      return respond(404, {
        success: false,
        message: `id ${id} ile harcama bulunamadı.`,
      });
    }
    return respond(200, { success: true, data: expense });
  }

  if (method === "POST" && !id) {
    const bodyResult = parseJsonBody(event);
    if (bodyResult.error) {
      return bodyResult.error;
    }

    const validation = validateExpenseBody(bodyResult.parsed);
    if (validation.error) {
      return respond(validation.error.status, {
        success: false,
        message: validation.error.message,
      });
    }

    const created = addExpense(validation.payload);
    return respond(201, { success: true, data: created });
  }

  if (method === "PUT" && id) {
    const existing = findExpenseById(id);
    if (!existing) {
      return respond(404, {
        success: false,
        message: `id ${id} ile harcama bulunamadı.`,
      });
    }

    const bodyResult = parseJsonBody(event);
    if (bodyResult.error) {
      return bodyResult.error;
    }

    const validation = validateExpenseBody(bodyResult.parsed);
    if (validation.error) {
      return respond(validation.error.status, {
        success: false,
        message: validation.error.message,
      });
    }

    const updated = replaceExpense(existing, validation.payload);
    return respond(200, { success: true, data: updated });
  }

  if (method === "DELETE" && id) {
    const deleted = deleteExpenseById(id);
    if (!deleted) {
      return respond(404, {
        success: false,
        message: `id ${id} ile harcama bulunamadı.`,
      });
    }
    return respond(200, {
      success: true,
      message: `id ${id} harcama silindi.`,
    });
  }

  return respond(404, { success: false, message: "Endpoint bulunamadı." });
};
