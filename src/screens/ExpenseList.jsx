import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isSameDay, parseISO } from 'date-fns';
import { fetchAllExpenses } from '../services/firebaseService.js';

function ExpenseList() {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        let isMounted = true;

        async function loadExpenses() {
            const allExpenses = await fetchAllExpenses();

            if (isMounted) {
                setExpenses(allExpenses);
            }
        }

        loadExpenses();

        return () => {
            isMounted = false;
        };
    }, []);

    const pageStyles = {
        minHeight: '100vh',
        padding: '24px',
        backgroundColor: '#f7f7f7',
        color: '#1f2937',
        fontFamily: 'Arial, sans-serif',
    };

    const buttonStyles = {
        display: 'inline-block',
        marginBottom: '24px',
        padding: '12px 16px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#111827',
        color: '#ffffff',
        cursor: 'pointer',
        fontSize: '16px',
    };

    const sectionStyles = {
        marginBottom: '20px',
    };

    const dateHeadingStyles = {
        margin: '24px 0 12px',
        fontSize: '18px',
        fontWeight: 700,
    };

    const itemStyles = {
        padding: '14px 16px',
        marginBottom: '12px',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    };

    const metaStyles = {
        marginTop: '6px',
        color: '#4b5563',
        fontSize: '14px',
    };

    const emptyStateStyles = {
        padding: '14px 16px',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        color: '#4b5563',
        fontSize: '15px',
    };

    return (
        <div style={pageStyles}>
            <button type="button" style={buttonStyles} onClick={() => navigate('/add')}>
                + Add Expense
            </button>

            <div style={sectionStyles}>
                {expenses.length === 0 ? (
                    <div style={emptyStateStyles}>No expenses yet. Add your first expense.</div>
                ) : null}

                {expenses.map((expense, index) => {
                    const currentDate = parseISO(expense.date);
                    const previousExpense = expenses[index - 1];
                    const previousDate = previousExpense ? parseISO(previousExpense.date) : null;
                    const showDateHeading = !previousDate || !isSameDay(currentDate, previousDate);

                    return (
                        <div key={expense.id}>
                            {showDateHeading ? (
                                <div style={dateHeadingStyles}>{format(currentDate, 'dd MMM yyyy')}</div>
                            ) : null}

                            <div style={itemStyles}>
                                <div style={{ fontSize: '18px', fontWeight: 700 }}>
                                    ₹{Number(expense.amount).toFixed(2)}
                                </div>
                                <div style={metaStyles}>{expense.category}</div>
                                {expense.note ? <div style={metaStyles}>{expense.note}</div> : null}
                                <div style={metaStyles}>{format(currentDate, 'dd MMM yyyy')}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ExpenseList;
