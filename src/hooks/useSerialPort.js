import { useState, useEffect, useRef } from 'react';

export const useSerialPort = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    loader: 0,
    obstacle: 0,
    zmpt: 0,
    lat: '--.------',
    lng: '--.------',
    fix: false,
    sats: 0
  });

  const [history, setHistory] = useState([]);
  const portRef = useRef(null);
  const readerRef = useRef(null);

  const clearHistory = () => setHistory([]);

  const connect = async () => {
    try {
      if (!('serial' in navigator)) {
        throw new Error('Web Serial API is not supported in this browser. Please use Chrome or Edge.');
      }

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 }); // Assuming standard baudrate
      
      portRef.current = port;
      setIsConnected(true);
      setError(null);

      // Start reading loop
      readLoop(port);
    } catch (err) {
      console.error('Serial connection error:', err);
      setError(err.message || 'Failed to connect to serial port');
    }
  };

  const disconnect = async () => {
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
      }
      if (portRef.current) {
        await portRef.current.close();
      }
      setIsConnected(false);
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  const readLoop = async (port) => {
    const textDecoder = new TextDecoderStream();
    await port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    readerRef.current = reader;

    let buffer = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        if (value) {
          buffer += value;
          const lines = buffer.split('\n');
          // Keep the last partial line in the buffer
          buffer = lines.pop();

          for (const line of lines) {
            parseData(line.trim());
          }
        }
      }
    } catch (err) {
      console.error('Read error:', err);
      setIsConnected(false);
    } finally {
      reader.releaseLock();
    }
  };

  const parseData = (line) => {
    if (!line) return;
    
    // Example format: LO:150|OB:200|ZM:0|LT:--.------|LN:--.------|FX:0|ST:0
    const parts = line.split('|');
    const newData = { ...data };
    let updated = false;

    parts.forEach(part => {
      const [key, val] = part.split(':');
      if (!key || !val) return;

      switch(key) {
        case 'LO': newData.loader = parseFloat(val); updated = true; break;
        case 'OB': newData.obstacle = parseFloat(val); updated = true; break;
        case 'ZM': newData.zmpt = parseFloat(val); updated = true; break;
        case 'LT': newData.lat = val; updated = true; break;
        case 'LN': newData.lng = val; updated = true; break;
        case 'FX': newData.fix = val === '1'; updated = true; break;
        case 'ST': newData.sats = parseInt(val, 10); updated = true; break;
        default: break;
      }
    });

    if (updated) {
      const entry = { ...newData, timestamp: new Date().toLocaleTimeString(), id: Date.now() };
      setData(prev => ({ ...prev, ...newData }));
      setHistory(prev => [entry, ...prev].slice(0, 100));
    }
  };

  useEffect(() => {
    return () => {
      disconnect(); // Cleanup on unmount
    };
  }, []);

  return { isConnected, data, history, error, connect, disconnect, clearHistory };
};
