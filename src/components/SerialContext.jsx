import { createContext, useContext } from 'react';
import { useSerialPort } from '../hooks/useSerialPort';

const SerialContext = createContext();

export function SerialProvider({ children }) {
  const serial = useSerialPort();

  return (
    <SerialContext.Provider value={serial}>
      {children}
    </SerialContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSerial = () => {
  const context = useContext(SerialContext);
  if (context === undefined) {
    throw new Error('useSerial must be used within a SerialProvider');
  }
  return context;
};
