import { createContext, useState } from 'react';
import { MAP_THEMES } from '../constants/mapConfig';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState('standard');

  return (
    <ThemeContext.Provider value={{ 
      activeTheme, 
      setActiveTheme, 
      // themeData akan otomatis terupdate saat activeTheme berubah
      themeData: MAP_THEMES[activeTheme] 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}