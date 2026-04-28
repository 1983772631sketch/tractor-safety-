import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { MapHistory } from './pages/MapHistory';
import { Profile } from './pages/Profile';
import { Feedback } from './pages/Feedback';
import { Support } from './pages/Support';
import { Upgrades } from './pages/Upgrades';
import { SerialHistory } from './pages/SerialHistory';
import { AuthProvider } from './components/AuthContext';
import { SosProvider } from './components/SosContext';
import { SerialProvider } from './components/SerialContext';

function App() {
  return (
    <AuthProvider>
      <SosProvider>
        <SerialProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<MapHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/support" element={<Support />} />
              <Route path="/upgrades" element={<Upgrades />} />
              <Route path="/serial-history" element={<SerialHistory />} />
            </Routes>
          </AppLayout>
        </SerialProvider>
      </SosProvider>
    </AuthProvider>
  );
}

export default App;
