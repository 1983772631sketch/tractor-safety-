import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon, Activity, AlertTriangle } from 'lucide-react';

// Fix Leaflet's default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom HUD marker
const hudMarker = new L.DivIcon({
  className: 'bg-transparent',
  html: `<div class="w-4 h-4 rounded-full bg-neon-cyan border-2 border-white shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

export function MapHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/telemetry/history');
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();
        
        // Filter out invalid GPS data
        const validData = data.filter(d => d.lat && d.lng && !isNaN(parseFloat(d.lat)) && !isNaN(parseFloat(d.lng)));
        
        // Data is usually returned DESC, let's reverse it so chronological is correct for the path
        setHistory(validData.reverse());
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHistory();
    // Refresh every 10 seconds
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  const coordinates = history.map(d => [parseFloat(d.lat), parseFloat(d.lng)]);
  const latestCoord = coordinates.length > 0 ? coordinates[coordinates.length - 1] : null;

  return (
    <div className="p-4 md:p-8 lg:p-12 h-full flex flex-col">
      <header className="mb-8 shrink-0">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl font-black tracking-[0.2em] italic bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-neon-cyan/50">
            GEOLOCATION_HISTORY
          </h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 mt-2 flex items-center gap-2">
            <Activity size={12} className="text-neon-emerald" /> 
            LIVE SATCOM UPLINK ESTABLISHED
          </p>
        </motion.div>
      </header>

      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.2 }} 
        className="flex-grow hud-card overflow-hidden relative min-h-[500px]"
      >
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-carbon-900/80 backdrop-blur-sm">
            <MapIcon size={48} className="text-neon-cyan animate-pulse mb-4" />
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-cyan">ACQUIRING_SATELLITE_DATA...</span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-carbon-900/80 backdrop-blur-sm">
            <AlertTriangle size={48} className="text-neon-danger mb-4" />
            <span className="text-[10px] font-black tracking-[0.5em] text-neon-danger">SATCOM_UPLINK_FAILED</span>
            <span className="text-xs font-mono text-slate-500 mt-2">{error}</span>
          </div>
        )}

        {/* Map Container */}
        <div className="w-full h-full [&>.leaflet-container]:w-full [&>.leaflet-container]:h-full [&>.leaflet-container]:bg-carbon-900">
          {!loading && !error && latestCoord && (
            <MapContainer center={latestCoord} zoom={15} zoomControl={false}>
              {/* CartoDB Dark Matter Tile Layer */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              
              {/* Historical Path */}
              {coordinates.length > 1 && (
                <Polyline 
                  positions={coordinates} 
                  color="var(--color-neon-cyan)" 
                  weight={4} 
                  opacity={0.8}
                  className="filter drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                />
              )}

              {/* Current Position Marker */}
              <Marker position={latestCoord} icon={hudMarker}>
                <Popup className="[&>.leaflet-popup-content-wrapper]:bg-carbon-800 [&>.leaflet-popup-content-wrapper]:text-white [&>.leaflet-popup-content-wrapper]:border [&>.leaflet-popup-content-wrapper]:border-glass-border [&>.leaflet-popup-tip]:bg-carbon-800">
                  <div className="text-center">
                    <div className="text-[10px] font-black tracking-[0.2em] text-neon-cyan mb-1 uppercase">Current Position</div>
                    <div className="font-mono text-xs">{latestCoord[0].toFixed(4)}, {latestCoord[1].toFixed(4)}</div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          )}

          {!loading && !error && !latestCoord && (
            <div className="absolute inset-0 z-40 flex items-center justify-center text-[10px] font-black tracking-widest text-slate-500">
              NO_GEOLOCATION_DATA_FOUND
            </div>
          )}
        </div>

        {/* HUD Map Overlays */}
        <div className="absolute top-6 right-6 z-[400] flex flex-col gap-2 pointer-events-none">
           <div className="px-3 py-2 bg-carbon-900/80 backdrop-blur-md border border-glass-border rounded-lg text-right">
             <div className="text-[8px] font-black tracking-widest text-slate-500 mb-1">TOTAL_WAYPOINTS</div>
             <div className="text-xl font-mono font-bold text-white">{coordinates.length}</div>
           </div>
        </div>
        <div className="absolute bottom-6 left-6 z-[400] pointer-events-none">
          <div className="text-[8px] font-black tracking-widest text-slate-500 bg-carbon-900/80 backdrop-blur-md px-2 py-1 rounded border border-glass-border">
            COORD_SYS: WGS84
          </div>
        </div>
      </motion.div>
    </div>
  );
}
