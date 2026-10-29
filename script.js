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

// Load saved expenses from localStorage (or start with an empty array if none exist)
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// =============================================================================
// 2. HELPER FUNCTIONS
// =============================================================================

// Save the current expenses array to localStorage
function saveExpensesToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to calculate and update the total spent
function updateTotal() {
  // Sum up all amounts in the expenses array
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Update the text in the HTML (formatted nicely)
  totalAmountDisplay.textContent = total.toLocaleString('en-IN');
}

// Function to render (draw) all expenses on the screen
function renderExpenses() {
  // Clear out the current list so we don't duplicate items
  expenseList.innerHTML = '';

  // Show a message if there are no expenses yet
  if (expenses.length === 0) {
    expenseList.innerHTML = '<li class="empty-msg">No expenses added yet!</li>';
    return;
  }

  // Loop through every expense and build its HTML
  expenses.forEach((expense) => {
    // Create a new <li> element
    const li = document.createElement('li');
    li.classList.add('expense-item');

    // Format the category to match CSS classes (e.g., "tag-food")
    const categoryClass = `tag-${expense.category.toLowerCase()}`;

    // Fill the <li> with structure matching style.css
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

    // Append the newly created item into the <ul> list
    expenseList.appendChild(li);
  });
}

// Function to delete an expense by its unique ID
function deleteExpense(id) {
  // Keep only the expenses whose id does NOT match the clicked one
  expenses = expenses.filter((item) => item.id !== id);

  // Save the updated list to localStorage
  saveExpensesToLocalStorage();

  // Re-draw the list and recalculate the total
  renderExpenses();
  updateTotal();
}

// =============================================================================
// 3. HANDLE FORM SUBMISSION (ADD EXPENSE)
// =============================================================================
expenseForm.addEventListener('submit', function (event) {
  // Prevent page refresh on submit
  event.preventDefault();

  // Get trimmed values from the input fields
  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);
  const category = expenseCategorySelect.value;
  const date = expenseDateInput.value;

  // Validation: Check if any field is empty
  if (!name || isNaN(amount) || !category || !date) {
    alert('⚠️ Please fill out all fields before submitting.');
    return;
  }

  // Validation: Check if amount is a positive number
  if (amount <= 0) {
    alert('⚠️ Amount must be greater than zero.');
    return;
  }

  // Create an expense object with a unique timestamp ID
  const newExpense = {
    id: Date.now(),
    name: name,
    amount: amount,
    category: category,
    date: date
  };

  // Add the new object to the expenses array
  expenses.push(newExpense);

  // Save changes to localStorage
  saveExpensesToLocalStorage();

  // Update the screen and total sum
  renderExpenses();
  updateTotal();

  // Reset the form inputs for the next entry
  expenseForm.reset();
});

// Run once when the page loads to display saved expenses and calculate total
renderExpenses();
updateTotal();
