// =============================================================================
// 1. SELECT HTML ELEMENTS
// =============================================================================
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategorySelect = document.getElementById('expense-category');
const expenseDateInput = document.getElementById('expense-date');
const expenseList = document.getElementById('expense-list');
const totalAmountDisplay = document.getElementById('total-amount');

// Filter element
const filterCategorySelect = document.getElementById('filter-category');

// Category breakdown displays
const catFoodDisplay = document.getElementById('cat-food');
const catTravelDisplay = document.getElementById('cat-travel');
const catBooksDisplay = document.getElementById('cat-books');
const catFunDisplay = document.getElementById('cat-fun');
const catOtherDisplay = document.getElementById('cat-other');

// Load saved expenses from localStorage (or fallback to empty array)
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// =============================================================================
// 2. HELPER FUNCTIONS
// =============================================================================

// Save to localStorage
function saveExpensesToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to calculate and update the total spent
function updateTotal() {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  totalAmountDisplay.textContent = total.toLocaleString('en-IN');
}

// Function to update spending breakdown for every category
function updateCategoryBreakdown() {
  const totals = {
    Food: 0,
    Travel: 0,
    Books: 0,
    Fun: 0,
    Other: 0
  };

  // Sum up expenses per category
  expenses.forEach((item) => {
    if (totals.hasOwnProperty(item.category)) {
      totals[item.category] += item.amount;
    }
  });

  // Update text inside each chip
  catFoodDisplay.textContent = totals.Food.toLocaleString('en-IN');
  catTravelDisplay.textContent = totals.Travel.toLocaleString('en-IN');
  catBooksDisplay.textContent = totals.Books.toLocaleString('en-IN');
  catFunDisplay.textContent = totals.Fun.toLocaleString('en-IN');
  catOtherDisplay.textContent = totals.Other.toLocaleString('en-IN');
}

// Function to render (draw) expenses with filtering applied
function renderExpenses() {
  // Clear the current list
  expenseList.innerHTML = '';

  const selectedCategory = filterCategorySelect.value;

  // Filter expenses based on the selected dropdown value
  const filteredExpenses = selectedCategory === 'All'
    ? expenses
    : expenses.filter((item) => item.category === selectedCategory);

  // If no expenses match the filter
  if (filteredExpenses.length === 0) {
    const msg = selectedCategory === 'All' 
      ? 'No expenses added yet!' 
      : `No expenses found under "${selectedCategory}".`;

    expenseList.innerHTML = `<li class="empty-msg">${msg}</li>`;
    return;
  }

  // Draw filtered expenses
  filteredExpenses.forEach((expense) => {
    const li = document.createElement('li');
    li.classList.add('expense-item');

    const categoryClass = `tag-${expense.category.toLowerCase()}`;

    li.innerHTML = `
      <div class="expense-info">
        <span class="expense-title">${expense.name}</span>
        <div class="expense-meta">
          <span class="tag ${categoryClass}">${expense.category}</span>
          <span>📅 ${expense.date}</span>
        </div>
      </div>
      <div class="expense-action">
        <span class="expense-cost">₹${expense.amount.toLocaleString('en-IN')}</span>
        <button class="delete-btn" title="Delete Expense" onclick="deleteExpense(${expense.id})">✕</button>
      </div>
    `;

    expenseList.appendChild(li);
  });
}

// Function to delete an expense by unique ID
function deleteExpense(id) {
  // Filter out the deleted item
  expenses = expenses.filter((item) => item.id !== id);

  // Save changes & update UI
  saveExpensesToLocalStorage();
  renderExpenses();
  updateTotal();
  updateCategoryBreakdown();
}

// =============================================================================
// 3. EVENT LISTENERS
// =============================================================================

// Listen for category filter changes
filterCategorySelect.addEventListener('change', renderExpenses);

// Handle form submission
expenseForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);
  const category = expenseCategorySelect.value;
  const date = expenseDateInput.value;

  // Form validations
  if (!name || isNaN(amount) || !category || !date) {
    alert('⚠️ Please fill out all fields before submitting.');
    return;
  }

  if (amount <= 0) {
    alert('⚠️ Amount must be greater than zero.');
    return;
  }

  // Create new expense object
  const newExpense = {
    id: Date.now(),
    name: name,
    amount: amount,
    category: category,
    date: date
  };

  expenses.push(newExpense);
  saveExpensesToLocalStorage();

  // Re-render UI
  renderExpenses();
  updateTotal();
  updateCategoryBreakdown();

  expenseForm.reset();
});

// Run once on page load to initialize everything
renderExpenses();
updateTotal();
updateCategoryBreakdown();
