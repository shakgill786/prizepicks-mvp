import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ContestList from './ContestList';
import AdminPage from './pages/AdminPage';
import ContestPage from './pages/ContestPage';
import './index.css';

export default function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-100 space-x-4">
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ContestList />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/contests/:id" element={<ContestPage />} />
      </Routes>
    </Router>
  );
}
