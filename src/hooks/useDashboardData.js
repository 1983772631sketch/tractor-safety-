import { useState, useEffect, useRef, useCallback } from 'react';
import { useSerial } from '../components/SerialContext';

export const useDashboardData = () => {
  const [mode, setMode] = useState('demo'); // 'serial', 'demo', 'wifi'
  const serial = useSerial();
  const [wifiData, setWifiData] = useState({
    loader: 0,
    obstacle: 0,
    zmpt: 0,
    lat: '--.------',
    lng: '--.------',
    fix: false,
    sats: 0
  });
  const [wifiConnected, setWifiConnected] = useState(false);
  const [wifiError, setWifiError] = useState(null);
  const [demoData, setDemoData] = useState({
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
        setDemoData(prev => ({
          ...prev,
          loader: 100 + Math.sin(Date.now() / 1000) * 80 + Math.random() * 5,
          obstacle: 250 + Math.cos(Date.now() / 1500) * 100 + Math.random() * 20,
          zmpt: Math.random() > 0.9 ? Math.random() * 100 : Math.random() * 5,
          sats: Math.floor(6 + Math.random() * 4)
        }));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [mode]);

  // WiFi Polling Mode — fetches latest telemetry from backend
  const pollCountRef = useRef(0);
  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await fetch('/api/telemetry');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      
      if (json && !json.message) {
        setWifiData({
          loader: json.loader ?? 0,
          obstacle: json.obstacle ?? 0,
          zmpt: json.zmpt ?? 0,
          lat: json.lat ?? '--.------',
          lng: json.lng ?? '--.------',
          fix: json.fix === 1 || json.fix === true,
          sats: json.sats ?? 0
        });
        setWifiConnected(true);
        setWifiError(null);
        pollCountRef.current = 0;
      } else {
        // No data yet from ESP32
        pollCountRef.current++;
        if (pollCountRef.current > 10) {
          setWifiError('NO_DATA_FROM_HARDWARE');
        }
        setWifiConnected(true);
      }
    } catch (err) {
      setWifiConnected(false);
      setWifiError(err.message || 'BACKEND_UNREACHABLE');
    }
  }, []);

  useEffect(() => {
    if (mode === 'wifi') {
      fetchTelemetry(); // Immediate first fetch
      const interval = setInterval(fetchTelemetry, 500);
      return () => clearInterval(interval);
    } else {
      setWifiConnected(false);
      setWifiError(null);
    }
  }, [mode, fetchTelemetry]);

  // Select data source based on mode
  const data = mode === 'serial' ? serial.data : mode === 'wifi' ? wifiData : demoData;
  const isConnected = mode === 'serial' ? serial.isConnected : mode === 'wifi' ? wifiConnected : true;
  const error = mode === 'serial' ? serial.error : mode === 'wifi' ? wifiError : null;

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
