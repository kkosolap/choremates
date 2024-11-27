// GroupThemeProvider.js

import React, { createContext, useContext, useState, useEffect } from 'react';

import themes from '../style/colors';

import axios from 'axios';
import { API_URL } from '../config';

// Create a context
const GroupThemeContext = createContext();

// Provider component
export const GroupThemeProvider = ({ children, username }) => {
  // State to hold the mapping of group_id to themes
  const [groupThemes, setGroupThemes] = useState({});

  useEffect(() => {
    if (username) {
      fetchGroupThemes(username);
    }
  }, [username]);

  // Fetch themes for all groups associated with the user  -MH
  const fetchGroupThemes = async (username) => {
    try {
      const response = await axios.get(`${API_URL}get-group-themes`, {
        params: { username }, // query parameters
      });
      const groupThemeData = response.data; // data in the format [{ group_id, theme }]
      
      // map group_id to theme
      const newGroupThemes = {};
      groupThemeData.forEach(({ group_id, theme }) => {
        if (themes[theme]) {
          newGroupThemes[group_id] = themes[theme];
        } else {
          console.warn(`Theme '${theme}' for group_id ${group_id} does not exist in themes.`);
        }
      });
      setGroupThemes(newGroupThemes);
    } catch (error) {
      console.error("Error fetching group themes:", error);
    }
  };

  // Change the theme for a specific group  -MH
  const changeGroupTheme = async (username, group_id, group_color) => {
    if (themes[group_color]) {
      try {
        await axios.post(`${API_URL}update-group-theme`, { username, group_id, group_color });
        setGroupThemes((prevThemes) => ({
          ...prevThemes,
          [group_id]: themes[group_color],
        }));
      } catch (error) {
        console.error(`Error updating theme for group_id ${group_id}:`, error);
      }
    } else {
      console.warn(`Theme '${group_color}' does not exist in themes.`);
    }
  };

  return (
    <GroupThemeContext.Provider value={{ groupThemes, changeGroupTheme }}>
      {children}
    </GroupThemeContext.Provider>
  );
};

export const useGroupThemes = () => useContext(GroupThemeContext);