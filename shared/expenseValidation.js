/**
 * POST/PUT için ortak doğrulama — Express ve Netlify Function aynı kuralları kullanır.
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

module.exports = { validateExpenseBody };
