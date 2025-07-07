import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ContestList from './ContestList';
import AdminPage from './pages/AdminPage';
import ContestPage from './pages/ContestPage';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ContestList />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/contests/:id" element={<ContestPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
