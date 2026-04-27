import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { MapHistory } from './pages/MapHistory';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Feedback } from './pages/Feedback';
import { Support } from './pages/Support';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<MapHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </AppLayout>
  );
}

export default App;

