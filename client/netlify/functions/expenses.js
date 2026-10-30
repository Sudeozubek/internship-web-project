// Netlify-only API — src/ backend koduna require YOK (backend ödevi ayrı kalır).
const expenses = [];
let nextId = 1;

function getAllExpenses() {
  return [...expenses];
}

function findExpenseById(id) {
  const numericId = Number(id);
  return expenses.find((item) => item.id === numericId) || null;
}

function addExpense(payload) {
  const now = new Date().toISOString();
  const item = {
    id: nextId++,
    title: payload.title,
    amount: payload.amount,
    category: payload.category,
    description: payload.description ?? "",
    date: payload.date,
    createdAt: now,
    updatedAt: now,
  };
  expenses.push(item);
  return item;
}

function replaceExpense(existing, payload) {
  const now = new Date().toISOString();
  existing.title = payload.title;
  existing.amount = payload.amount;
  existing.category = payload.category;
  existing.description = payload.description ?? "";
  existing.date = payload.date;
  existing.updatedAt = now;
  return existing;
}

function deleteExpenseById(id) {
  const numericId = Number(id);
  const index = expenses.findIndex((item) => item.id === numericId);
  if (index === -1) {
    return false;
  }
  expenses.splice(index, 1);
  return true;
}

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

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
}

function parseExpenseId(event) {
  const path = event.path || event.rawUrl || "";
  const match =
    path.match(/\/api\/expenses\/([^/?]+)/) ||
    path.match(/\/expenses\/([^/?]+)/);
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
      error: json(400, {
        success: false,
        message: "Geçersiz JSON gövdesi. İstek gövdesini kontrol edin.",
      }),
    };
  }
}

function respondValidation(validation) {
  return json(validation.error.status, {
    success: false,
    message: validation.error.message,
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, body: "" };
  }

  const id = parseExpenseId(event);
  const method = event.httpMethod;

  if (method === "GET" && !id) {
    return json(200, { success: true, data: getAllExpenses() });
  }

  if (method === "GET" && id) {
    const expense = findExpenseById(id);
    if (!expense) {
      return json(404, {
        success: false,
        message: `id ${id} ile harcama bulunamadı.`,
      });
    }
    return json(200, { success: true, data: expense });
  }

  if (method === "POST" && !id) {
    const bodyResult = parseJsonBody(event);
    if (bodyResult.error) {
      return bodyResult.error;
    }
    const validation = validateExpenseBody(bodyResult.parsed);
    if (validation.error) {
      return respondValidation(validation);
    }
    return json(201, { success: true, data: addExpense(validation.payload) });
  }

  if (method === "PUT" && id) {
    const existing = findExpenseById(id);
    if (!existing) {
      return json(404, {
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
      return respondValidation(validation);
    }
    return json(200, {
      success: true,
      data: replaceExpense(existing, validation.payload),
    });
  }

  if (method === "DELETE" && id) {
    if (!deleteExpenseById(id)) {
      return json(404, {
        success: false,
        message: `id ${id} ile harcama bulunamadı.`,
      });
    }
    return json(200, {
      success: true,
      message: `id ${id} harcama silindi.`,
    });
  }

  return json(404, { success: false, message: "Endpoint bulunamadı." });
};
