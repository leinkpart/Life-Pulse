import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

// Tạo context
const ThemeContext = createContext();

// Custom hook để sử dụng ThemeContext
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState('automatic');

    // Xác định theme sẽ được áp dụng
    const appliedTheme = theme === 'automatic' ? systemTheme : theme;

    return (
        <ThemeContext.Provider value={{ theme: appliedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
