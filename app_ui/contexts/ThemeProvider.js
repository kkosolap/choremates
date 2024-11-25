// ThemeProvider.js

import React, { createContext, useContext, useState, useEffect } from 'react';

import themes from '../style/colors';

import axios from 'axios';
import { API_URL } from '../config';

// Create a context
const ThemeContext = createContext();

// Provider component
export const ThemeProvider = ({ children, username }) => {
  // State to hold the current theme; default to purple
  const [currentTheme, setCurrentTheme] = useState(themes.purple);

  useEffect(() => {
    if (username) {
      getTheme(username);
    }
  }, [username]);

  // Gets the user's personal theme from the database -KK
  const getTheme = async (username) => {
    try {
      const response = await axios.post(`${API_URL}get-theme`, { username });
      const theme = response.data[0]?.theme;
      if (themes[theme]) {
        setCurrentTheme(themes[theme]);
      } else {
        console.warn(`Theme '${theme}' does not exist in themes.`);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  // Changes the theme when palette is pressed in settings -KK
  const changeTheme = async (username, theme) => {
    if (themes[theme]) {
      try {
        await axios.post(`${API_URL}update-theme`, { username, theme });
        setCurrentTheme(themes[theme]);
      } catch (error) {
        console.error("Error updating theme:", error);
      }
    } else {
      console.warn(`Theme '${theme}' does not exist in themes.`);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
