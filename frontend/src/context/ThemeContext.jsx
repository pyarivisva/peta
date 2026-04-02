import { createContext, useState } from 'react';
import { MAP_THEMES } from '../constants/mapConfig';

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState('standard');

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, themeData: MAP_THEMES[activeTheme] }}>
      {children}
    </ThemeContext.Provider>
  );
}