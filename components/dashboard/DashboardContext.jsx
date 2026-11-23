"use client";

import { createContext, useContext } from "react";

export const DashboardContext = createContext({
  me: null,
  refreshMe: async () => {},
});

export const useDashboard = () => useContext(DashboardContext);