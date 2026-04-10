const EXPENSES_STORAGE_KEY = 'expenses';
const LEGACY_EXPENSES_STORAGE_KEY = 'expense_tracker_expenses';

function readExpensesFromStorage() {
    if (typeof window === 'undefined') {
        return [];
    }

    const raw = window.localStorage.getItem(EXPENSES_STORAGE_KEY);

    if (!raw) {
        const legacyRaw = window.localStorage.getItem(LEGACY_EXPENSES_STORAGE_KEY);

        if (!legacyRaw) {
            return [];
        }

        try {
            const legacyParsed = JSON.parse(legacyRaw);
            const migrated = Array.isArray(legacyParsed) ? legacyParsed : [];
            window.localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(migrated));
            return migrated;
        } catch {
            return [];
        }
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeExpensesToStorage(expenses) {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
}

function sortByDateDesc(expenses) {
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addExpense(expense) {
    const existingExpenses = readExpensesFromStorage();
    const expenseWithId = {
        id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
        ...expense,
    };

    const nextExpenses = [...existingExpenses, expenseWithId];
    writeExpensesToStorage(nextExpenses);

    return expenseWithId;
}

export async function fetchAllExpenses() {
    const expenses = readExpensesFromStorage();
    return sortByDateDesc(expenses);
}

export function categoryTotals(expensesArray) {
    return expensesArray.reduce((totals, expense) => {
        const currentTotal = totals[expense.category] || 0;
        totals[expense.category] = currentTotal + expense.amount;
        return totals;
    }, {});
}
