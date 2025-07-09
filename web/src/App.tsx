import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ContestList from './ContestList';
import AdminPage from './pages/AdminPage';
import ContestPage from './pages/ContestPage';
import MyPicksPage from './pages/MyPicksPage';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ContestList />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/contests/:id" element={<ContestPage />} />
          <Route path="/profile" element={<MyPicksPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
