import { useEffect, useState } from 'react';
import { categoryTotals, fetchAllExpenses } from '../services/storageService.js';
import { isAfter, isBefore, parseISO, startOfDay, subDays } from 'date-fns';

function Insights() {
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

    const today = new Date();
    const currentMonthExpenses = expenses.filter((expense) => {
        const expenseDate = parseISO(expense.date);
        return (
            expenseDate.getMonth() === today.getMonth() &&
            expenseDate.getFullYear() === today.getFullYear()
        );
    });

    const currentMonthTotal = currentMonthExpenses.reduce(
        (total, expense) => total + expense.amount,
        0
    );

    const catTotals = categoryTotals(currentMonthExpenses);

    function getSmartInsight(allExpenses) {
        const now = startOfDay(new Date());
        const sevenDaysAgo = subDays(now, 7);
        const fourteenDaysAgo = subDays(now, 14);

        const thisWeek = allExpenses.filter((expense) => {
            const expenseDate = startOfDay(parseISO(expense.date));
            return isAfter(expenseDate, sevenDaysAgo) || expenseDate.getTime() === sevenDaysAgo.getTime();
        });

        const lastWeek = allExpenses.filter((expense) => {
            const expenseDate = startOfDay(parseISO(expense.date));
            return (
                (isAfter(expenseDate, fourteenDaysAgo) || expenseDate.getTime() === fourteenDaysAgo.getTime()) &&
                isBefore(expenseDate, sevenDaysAgo)
            );
        });

        const thisWeekTotals = categoryTotals(thisWeek);
        const lastWeekTotals = categoryTotals(lastWeek);

        for (const [category, thisWeekAmount] of Object.entries(thisWeekTotals)) {
            const lastWeekAmount = lastWeekTotals[category] || 0;

            if (lastWeekAmount === 0) {
                if (thisWeekAmount > 0) {
                    return `You spent 100% more on ${category} this week vs last week`;
                }

                continue;
            }

            const percentChange = ((thisWeekAmount - lastWeekAmount) / lastWeekAmount) * 100;

            if (percentChange > 20) {
                return `You spent ${percentChange.toFixed(0)}% more on ${category} this week vs last week`;
            }
        }

        return 'Your spending looks normal this week';
    }

    const smartInsight = getSmartInsight(expenses);
    const categories = Object.entries(catTotals);

    const pageStyles = {
        minHeight: '100vh',
        padding: '24px',
        backgroundColor: '#f5f7fb',
        color: '#111827',
        fontFamily: 'Arial, sans-serif',
    };

    const insightBoxStyles = {
        marginBottom: '24px',
        padding: '16px 18px',
        borderRadius: '12px',
        backgroundColor: '#fff7d6',
        border: '1px solid #f4d35e',
        fontWeight: 600,
    };

    const headingStyles = {
        margin: '0 0 20px',
        fontSize: '28px',
        fontWeight: 800,
    };

    const categoryCardStyles = {
        marginBottom: '14px',
        padding: '14px 16px',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    };

    const progressTrackStyles = {
        marginTop: '10px',
        height: '10px',
        borderRadius: '999px',
        backgroundColor: '#e5e7eb',
        overflow: 'hidden',
    };

    const progressFillStyles = (width) => ({
        height: '100%',
        width: `${width}%`,
        backgroundColor: '#2563eb',
        borderRadius: '999px',
    });

    return (
        <div style={pageStyles}>
            <div style={insightBoxStyles}>{smartInsight}</div>

            <h1 style={headingStyles}>This Month: ₹{currentMonthTotal.toFixed(2)}</h1>

            <div>
                {categories.map(([category, amount]) => {
                    const width = currentMonthTotal > 0 ? (amount / currentMonthTotal) * 100 : 0;

                    return (
                        <div key={category} style={categoryCardStyles}>
                            <div style={{ fontSize: '18px', fontWeight: 700 }}>{category}</div>
                            <div style={{ marginTop: '4px', color: '#4b5563' }}>₹{amount.toFixed(2)}</div>
                            <div style={progressTrackStyles}>
                                <div style={progressFillStyles(width)} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Insights;
