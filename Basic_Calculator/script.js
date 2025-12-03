const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const clearBtn = document.getElementById("clear");
const equalsBtn = document.getElementById("equals");
const historyBtn = document.getElementById("history");
const clearHistoryBtn = document.getElementById("clear-history");

// Memory buttons
const mcBtn = document.getElementById("mc");
const mrBtn = document.getElementById("mr");
const mPlusBtn = document.getElementById("mplus");
const mMinusBtn = document.getElementById("mminus");

let currentExpression = "";
let memoryValue = 0;
let calculationHistory = JSON.parse(localStorage.getItem('calcHistory')) || [];

// Limit history to 50 items
if (calculationHistory.length > 50) {
  calculationHistory = calculationHistory.slice(-50);
}

// Update display
function updateDisplay(value) {
  display.value = value;
}

// Save to history
function saveToHistory(expression, result) {
  const entry = {
    expression: expression,
    result: result,
    timestamp: new Date().toLocaleString()
  };
  calculationHistory.unshift(entry); // Add to beginning
  if (calculationHistory.length > 50) {
    calculationHistory = calculationHistory.slice(0, 50);
  }
  localStorage.setItem('calcHistory', JSON.stringify(calculationHistory));
}

// Show history modal
function showHistory() {
  const modal = document.createElement('div');
  modal.className = 'history-modal';
  modal.innerHTML = `
    <div class="history-content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3>Calculation History</h3>
        <button onclick="this.closest('.history-modal').remove()" style="background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">×</button>
      </div>
      ${calculationHistory.length ? 
        `<ul class="history-list">
          ${calculationHistory.map(item => 
            `<li class="history-item">
              <div><strong>${item.expression}</strong> = ${item.result}</div>
              <small style="color: #9ca3af;">${item.timestamp}</small>
            </li>`
          ).join('')}
        </ul>`
        : '<p style="text-align: center; color: #9ca3af;">No calculations yet</p>'
      }
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'block';
}

// Clear history
function clearHistory() {
  calculationHistory = [];
  localStorage.removeItem('calcHistory');
  if (historyBtn) historyBtn.textContent = 'History (0)';
}

// Update history count on button
function updateHistoryButton() {
  if (historyBtn) {
    historyBtn.textContent = `History (${calculationHistory.length})`;
  }
}
updateHistoryButton();

// Append value safely (unchanged)
function appendToExpression(value) {
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

// Evaluate with HISTORY SAVING
function calculateResult() {
  if (!currentExpression) return;

  try {
    if (!/^[0-9+\-*/().\s]+$/.test(currentExpression)) {
      throw new Error("Invalid input");
    }

    const result = Function(`"use strict"; return (${currentExpression})`)();
    if (!isFinite(result)) {
      throw new Error("Math error");
    }

    // SAVE TO HISTORY
    saveToHistory(currentExpression, result.toString());

    currentExpression = result.toString();
    updateDisplay(currentExpression);
    updateHistoryButton();
  } catch (error) {
    updateDisplay("Error");
    currentExpression = "";
  }
}

// Square root, percent, memory functions (unchanged from previous version)
function applySquareRoot() {
  if (!currentExpression) return;
  try {
    const value = Function(`"use strict"; return (${currentExpression})`)();
    if (value < 0 || !isFinite(value)) throw new Error("Math error");
    const result = Math.sqrt(value);
    currentExpression = result.toString();
    updateDisplay(currentExpression);
  } catch (e) {
    updateDisplay("Error");
    currentExpression = "";
  }
}

function applyPercent() {
  if (!currentExpression) return;
  try {
    const value = Function(`"use strict"; return (${currentExpression})`)();
    const result = value / 100;
    currentExpression = result.toString();
    updateDisplay(currentExpression);
  } catch (e) {
    updateDisplay("Error");
    currentExpression = "";
  }
}

function memoryClear() { memoryValue = 0; }
function memoryRecall() {
  if (currentExpression === "" || display.value === "Error") {
    currentExpression = memoryValue.toString();
  } else {
    currentExpression += memoryValue.toString();
  }
  updateDisplay(currentExpression);
}
function memoryAdd() {
  try {
    const value = display.value ? Number(Function(`"use strict"; return (${display.value})`)()) : 0;
    if (!isNaN(value)) memoryValue += value;
  } catch (e) {}
}
function memorySubtract() {
  try {
    const value = display.value ? Number(Function(`"use strict"; return (${display.value})`)()) : 0;
    if (!isNaN(value)) memoryValue -= value;
  } catch (e) {}
}

// Event listeners
buttons.forEach((btn) => {
  const value = btn.getAttribute("data-value");
  const action = btn.getAttribute("data-action");

  if (action === "sqrt") {
    btn.addEventListener("click", applySquareRoot);
  } else if (action === "percent") {
    btn.addEventListener("click", applyPercent);
  } else if (value) {
    btn.addEventListener("click", () => appendToExpression(value));
  }
});

clearBtn.addEventListener("click", clearExpression);
equalsBtn.addEventListener("click", calculateResult);
historyBtn.addEventListener("click", showHistory);
clearHistoryBtn.addEventListener("click", clearHistory);

mcBtn.addEventListener("click", memoryClear);
mrBtn.addEventListener("click", memoryRecall);
mPlusBtn.addEventListener("click", memoryAdd);
mMinusBtn.addEventListener("click", memorySubtract);

// Keyboard support (unchanged)
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
  } else if (key === "%") {
    applyPercent();
  }
});
