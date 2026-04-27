import { useState, useEffect } from 'react';
import { useSerialPort } from './useSerialPort';

export const useDashboardData = () => {
  const [mode, setMode] = useState('demo'); // 'serial', 'api', 'demo'
  const serial = useSerialPort();
  const [apiData, setApiData] = useState({
    loader: 0,
    obstacle: 0,
    zmpt: 0,
    lat: '17.385044',
    lng: '78.486671',
    fix: true,
    sats: 8
  });

  // Simulated Demo Mode Data
  useEffect(() => {
    if (mode === 'demo') {
      const interval = setInterval(() => {
        setApiData(prev => ({
          ...prev,
          loader: 150 + Math.sin(Date.now() / 1000) * 50 + Math.random() * 10,
          obstacle: 250 + Math.cos(Date.now() / 1500) * 100 + Math.random() * 20,
          zmpt: Math.random() > 0.9 ? Math.random() * 100 : Math.random() * 5,
          sats: Math.floor(6 + Math.random() * 4)
        }));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [mode]);

  // Real Backend API Mode
  useEffect(() => {
    if (mode === 'api') {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/telemetry');
          if (!response.ok) throw new Error('API not reachable');
          const json = await response.json();
          
          // Map database fields to app state if they differ
          if (json && !json.message) {
            setApiData({
              ...json,
              fix: json.fix === 1
            });
          }
        } catch (err) {
          console.error('API Fetch error:', err);
        }
      };

      const interval = setInterval(fetchData, 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const data = mode === 'serial' ? serial.data : apiData;
  const isConnected = mode === 'serial' ? serial.isConnected : true;
  const error = mode === 'serial' ? serial.error : null;

  return {
    mode,
    setMode,
    data,
    isConnected,
    error,
    connect: serial.connect,
    disconnect: serial.disconnect
  };
};
