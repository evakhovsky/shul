// AppBarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppBarContextType {
  title: string;
  updateTitle: (newTitle: string) => void;
}

const AppBarContext = createContext<AppBarContextType | undefined>(undefined);

export const AppBarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState('Default App Bar Title');

  const updateTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  return (
    <AppBarContext.Provider value={{ title, updateTitle }}>
      {children}
    </AppBarContext.Provider>
  );
};

export const useAppBar = () => {
  const context = useContext(AppBarContext);
  if (!context) {
    throw new Error('useAppBar must be used within an AppBarProvider');
  }
  return context;
};