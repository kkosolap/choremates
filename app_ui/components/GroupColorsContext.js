import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config.js';
import * as SecureStore from 'expo-secure-store';

// Create the context
const GroupColorsContext = createContext();

// Provider component
export const GroupColorsProvider = ({ children }) => {
  const [groupColors, setGroupColors] = useState({});

  // Fetch group colors from the API
  const fetchGroupColors = async (username) => {
    try {
      const response = await axios.get(`${API_URL}get-group-colors`, {
        params: { username },
      });
      setGroupColors(response.data);
    } catch (error) {
      console.error("Error fetching group colors:", error);
    }
  };

  // Update group color in the database
  const updateGroupColor = async (username, groupId, newColor) => {
    try {
      const response = await axios.post(`${API_URL}update-group-color`, {
        username,
        group_id: groupId,
        group_color: newColor,
      });

      if (response.data.success) {
        setGroupColors((prevColors) => ({
          ...prevColors,
          [groupId]: newColor,
        }));
      }
    } catch (error) {
      console.error("Error updating group color:", error);
    }
  };

  // Fetch the group colors when the component mounts
  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        console.log("Username: "+storedUsername);
        fetchGroupColors(storedUsername);
      } else {
        console.error("Username not found in SecureStore.");
      }
    };

    getUsername();
  }, []); // This will run once when the component mounts

  return (
    <GroupColorsContext.Provider value={{ groupColors, updateGroupColor }}>
      {children}
    </GroupColorsContext.Provider>
  );
};

// Custom hook to use the context
export const useGroupColors = () => {
  const context = useContext(GroupColorsContext);
  if (!context) {
    throw new Error('useGroupColors must be used within a GroupColorsProvider');
  }
  return context;
};
