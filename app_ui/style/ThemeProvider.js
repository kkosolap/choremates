// ThemeProvider.js

import React, { createContext, useContext, useState, useEffect } from 'react';

import themes from './colors';
import axios from 'axios';
import { API_URL } from '../config';

// create a context
const ThemeContext = createContext();

// provider component
export const ThemeProvider = ({ children, username }) => {
  // state to hold the current theme; default to purple
  const [currentTheme, setCurrentTheme] = useState(themes.purple);

  useEffect(() => {
    if (username) {
      getTheme(username);
    }
  }, [username]);

  // gets the user's theme from the database -KK
  const getTheme = async (username) => {
    try {
      const response = await axios.post(`${API_URL}get_theme`, { username });
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

  // changes the theme when palette is pressed in settings -KK
  const changeTheme = async (username, theme) => {
    if (themes[theme]) {
      try {
        await axios.post(`${API_URL}update_theme`, { username, theme });
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

// custom hook to use the theme in any component
export const useTheme = () => useContext(ThemeContext);
