document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalExpenses = document.getElementById('total-expenses');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    function renderExpenses() {
        expenseList.innerHTML = '';
        let total = 0;

        if (expenses.length === 0) {
            expenseList.innerHTML = '<li>지출 내역이 없습니다.</li>';
            totalExpenses.textContent = '총 지출: 0원';
            return;
        }

        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="date">${expense.date}</span>
                <span class="desc">${expense.description}</span>
                <span class="category">${expense.category}</span>
                <span class="amount">${parseInt(expense.amount).toLocaleString()}원</span>
                <button class="delete-btn" data-index="${index}">삭제</button>
            `;
            expenseList.appendChild(li);
            total += parseInt(expense.amount);
        });

        totalExpenses.textContent = `총 지출: ${total.toLocaleString()}원`;
    }

    function addExpense(e) {
        e.preventDefault();

        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const amount = document.getElementById('amount').value;

        if (!date || !description || !category || !amount) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        const newExpense = {
            date,
            description,
            category,
            amount
        };

        expenses.push(newExpense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
        expenseForm.reset();
    }

    function deleteExpense(e) {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.getAttribute('data-index');
            expenses.splice(index, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            renderExpenses();
        }
    }

    expenseForm.addEventListener('submit', addExpense);
    expenseList.addEventListener('click', deleteExpense);

    renderExpenses();
});
