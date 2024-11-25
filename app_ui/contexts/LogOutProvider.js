// LogoutProvider.js

import React, { createContext, useContext } from 'react';

const LogoutContext = createContext();

export const LogoutProvider = ({ children, handleLogout }) => (
  <LogoutContext.Provider value={handleLogout}>
    {children}
  </LogoutContext.Provider>
);

export const useLogout = () => useContext(LogoutContext);
