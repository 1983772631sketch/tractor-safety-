import { createContext, useContext, useState } from 'react';

const SosContext = createContext();

export function SosProvider({ children }) {
  const [isSosActive, setIsSosActive] = useState(false);

  const toggleSos = () => {
    setIsSosActive(prev => !prev);
    if (!isSosActive) {
      // Trigger emergency protocol
      console.log('EMERGENCY SOS ACTIVATED');
      // In a real app, this would send a request to the backend or trigger local hardware
    } else {
      console.log('SOS DEACTIVATED');
    }
  };

  return (
    <SosContext.Provider value={{ isSosActive, toggleSos }}>
      {children}
    </SosContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSos = () => {
  const context = useContext(SosContext);
  if (context === undefined) {
    throw new Error('useSos must be used within a SosProvider');
  }
  return context;
};
