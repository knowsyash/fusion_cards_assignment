import { useState } from 'react';
import { addExpense } from '../services/firebaseService.js';

function AddExpense() {
    const today = new Date().toISOString().split('T')[0];
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(today);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function handleSave() {
        if (!amount) {
            setMessage('');
            setError('Please enter an amount.');
            return;
        }

        try {
            await addExpense({
                amount: Number(amount),
                category,
                note,
                date: new Date(date).toISOString(),
            });

            setError('');
            setMessage('Expense saved!');
            setAmount('');
            setCategory('Food');
            setNote('');
            setDate(today);
        } catch {
            setMessage('');
            setError('Could not save expense. Check your Firebase config and try again.');
        }
    }

    const pageStyles = {
        minHeight: '100vh',
        padding: '24px',
        backgroundColor: '#f8fafc',
        fontFamily: 'Arial, sans-serif',
        color: '#111827',
    };

    const cardStyles = {
        maxWidth: '520px',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    };

    const fieldStyles = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '16px',
    };

    const inputStyles = {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '16px',
    };

    const buttonStyles = {
        padding: '12px 16px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: 700,
        cursor: 'pointer',
    };

    const messageStyles = {
        marginTop: '16px',
        padding: '12px 14px',
        borderRadius: '8px',
        backgroundColor: '#dcfce7',
        color: '#166534',
        fontWeight: 600,
    };

    const errorStyles = {
        marginTop: '16px',
        padding: '12px 14px',
        borderRadius: '8px',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        fontWeight: 600,
    };

    return (
        <div style={pageStyles}>
            <div style={cardStyles}>
                <div style={fieldStyles}>
                    <label htmlFor="amount">Amount</label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        style={inputStyles}
                    />
                </div>

                <div style={fieldStyles}>
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        style={inputStyles}
                    >
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Bills">Bills</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div style={fieldStyles}>
                    <label htmlFor="note">Note</label>
                    <input
                        id="note"
                        type="text"
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        style={inputStyles}
                    />
                </div>

                <div style={fieldStyles}>
                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        style={inputStyles}
                    />
                </div>

                <button type="button" onClick={handleSave} style={buttonStyles}>
                    Save
                </button>

                {message ? <div style={messageStyles}>{message}</div> : null}
                {error ? <div style={errorStyles}>{error}</div> : null}
            </div>
        </div>
    );
}

export default AddExpense;
