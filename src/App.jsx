import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import ExpenseList from './screens/ExpenseList.jsx';
import AddExpense from './screens/AddExpense.jsx';
import Insights from './screens/Insights.jsx';

function App() {
    const navBarStyles = {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        padding: '14px 20px',
        backgroundColor: '#111827',
        color: '#ffffff',
    };

    const linkStyles = ({ isActive }) => ({
        color: '#ffffff',
        textDecoration: 'none',
        padding: '8px 12px',
        borderRadius: '8px',
        backgroundColor: isActive ? '#2563eb' : 'transparent',
        fontWeight: 600,
    });

    return (
        <BrowserRouter>
            <div>
                <nav style={navBarStyles}>
                    <NavLink to="/" style={linkStyles} end>
                        Expenses
                    </NavLink>
                    <NavLink to="/add" style={linkStyles}>
                        Add
                    </NavLink>
                    <NavLink to="/insights" style={linkStyles}>
                        Insights
                    </NavLink>
                </nav>

                <Routes>
                    <Route path="/" element={<ExpenseList />} />
                    <Route path="/add" element={<AddExpense />} />
                    <Route path="/insights" element={<Insights />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
