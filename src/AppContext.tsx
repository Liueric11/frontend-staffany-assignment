import React, { createContext, useContext, useState, ReactNode } from "react";
import { getStartOfWeek } from "./helper/function/getStartOfWeek";

interface AppContextType {
  startOfWeek: Date;
  setStartOfWeek: (date: Date) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [startOfWeek, setStartOfWeek] = useState<Date>(getStartOfWeek(new Date()));

  return (
    <AppContext.Provider value={{ startOfWeek, setStartOfWeek }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
