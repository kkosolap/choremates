// UserContext.js

import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check if the user is logged in and fetch user details
  const fetchUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const storedUsername = await SecureStore.getItemAsync('username');

      if (token && storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);

        // Fetch user_id from the backend using the stored username
        const response = await fetch(`${API_URL}get-user-id?username=${storedUsername}`);
        const data = await response.json();
        //console.log('UserComponents: ' + data);


        if (data.success) {
          setUserId(data.user_id);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userId, username, isLoggedIn, setIsLoggedIn, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
