const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const clearBtn = document.getElementById("clear");
const equalsBtn = document.getElementById("equals");

let currentExpression = "";

// Update display
function updateDisplay(value) {
  display.value = value;
}

// Append value safely
function appendToExpression(value) {
  // prevent two operators in a row (except minus for negative numbers after '(')
  const operators = ["+", "-", "*", "/"];
  const lastChar = currentExpression.slice(-1);

  if (operators.includes(lastChar) && operators.includes(value)) {
    return;
  }

  currentExpression += value;
  updateDisplay(currentExpression);
}

// Clear everything
function clearExpression() {
  currentExpression = "";
  updateDisplay("");
}

// Evaluate with error handling
function calculateResult() {
  if (!currentExpression) return;

  try {
    // Basic validation – only numbers, operators, parentheses, and dot
    if (!/^[0-9+\-*/().\s]+$/.test(currentExpression)) {
      throw new Error("Invalid input");
    }

    // Use JavaScript evaluation (respects operator precedence / BODMAS)
    const result = Function(`"use strict"; return (${currentExpression})`)();

    if (!isFinite(result)) {
      throw new Error("Math error");
    }

    currentExpression = result.toString();
    updateDisplay(currentExpression);
  } catch (error) {
    updateDisplay("Error");
    currentExpression = "";
  }
}

// Handle button clicks
buttons.forEach((btn) => {
  const value = btn.getAttribute("data-value");

  if (!value) return;

  btn.addEventListener("click", () => {
    appendToExpression(value);
  });
});

clearBtn.addEventListener("click", clearExpression);
equalsBtn.addEventListener("click", calculateResult);

// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/[0-9+\-*/().]/.test(key)) {
    appendToExpression(key);
  } else if (key === "Enter") {
    event.preventDefault();
    calculateResult();
  } else if (key === "Escape") {
    clearExpression();
  } else if (key === "Backspace") {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay(currentExpression);
  }
});
