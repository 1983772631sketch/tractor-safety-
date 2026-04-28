import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { MapHistory } from './pages/MapHistory';
import { Profile } from './pages/Profile';
import { Feedback } from './pages/Feedback';
import { Support } from './pages/Support';
import { Upgrades } from './pages/Upgrades';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AuthProvider, useAuth } from './components/AuthContext';
import { SosProvider } from './components/SosContext';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <SosProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/history" element={<MapHistory />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/upgrades" element={<Upgrades />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </SosProvider>
    </AuthProvider>
  );
}

export default App;
