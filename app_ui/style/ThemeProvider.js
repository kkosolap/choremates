// ThemeProvider.js

import React, { createContext, useContext, useState } from 'react';

import themes from './colors';

// create a context
const ThemeContext = createContext();

// provider component
export const ThemeProvider = ({ children }) => {
  // state to hold the current theme; default to purple
  const [currentTheme, setCurrentTheme] = useState(themes.purple);

  // function to change the theme
  // const changeTheme = (themeName) => {
  //   setCurrentTheme(themes[themeName]);
  //   // example call: changeTheme('purple')  -MH
  // };
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themes[themeName]);
    } else {
      console.warn(`Theme '${themeName}' does not exist in themes.`);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// custom hook to use the theme in any component
export const useTheme = () => useContext(ThemeContext);
