const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = '';
let shouldResetDisplay = false;

function updateDisplay(value) {
  display.textContent = value;
}

function appendValue(value) {
  if (shouldResetDisplay) {
    expression = '';
    shouldResetDisplay = false;
  }

  if (value === '.' && expression.includes('.') && /[+\-*/]$/.test(expression) === false) {
    const lastNumber = expression.split(/[+\-*/]/).pop();
    if (lastNumber.includes('.')) {
      return;
    }
  }

  if (['+', '-', '*', '/'].includes(value)) {
    if (!expression) {
      if (value === '-') {
        expression = '-';
      }
      return;
    }

    const lastChar = expression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
      expression = expression.slice(0, -1) + value;
      updateDisplay(expression);
      return;
    }
  }

  expression += value;
  updateDisplay(expression);
}

function clearAll() {
  expression = '';
  shouldResetDisplay = false;
  updateDisplay('0');
}

function deleteLast() {
  if (!expression) return;

  expression = expression.slice(0, -1);
  updateDisplay(expression || '0');
}

function calculatePercentage() {
  if (!expression) return;

  try {
    const result = Function(`"use strict"; return (${expression}) / 100`)();
    expression = String(result);
    updateDisplay(expression);
  } catch {
    updateDisplay('Error');
    expression = '';
  }
}

function evaluateExpression() {
  if (!expression) return;

  try {
    const sanitizedExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
    const result = Function(`"use strict"; return (${sanitizedExpression})`)();

    if (!Number.isFinite(result)) {
      throw new Error('Invalid operation');
    }

    expression = String(result);
    updateDisplay(expression);
    shouldResetDisplay = true;
  } catch {
    updateDisplay('Error');
    expression = '';
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === 'clear') {
      clearAll();
      return;
    }

    if (action === 'delete') {
      deleteLast();
      return;
    }

    if (action === 'percent') {
      calculatePercentage();
      return;
    }

    if (action === 'calculate') {
      evaluateExpression();
      return;
    }

    if (value) {
      appendValue(value);
    }
  });
});

window.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key) || ['+', '-', '*', '/', '.'].includes(key)) {
    appendValue(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    evaluateExpression();
    return;
  }

  if (key === 'Backspace') {
    deleteLast();
    return;
  }

  if (key === 'Escape') {
    clearAll();
  }
});
