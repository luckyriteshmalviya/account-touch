import { createContext, useContext, useEffect, useState } from "react";
import { getDashboardDataService } from "../services/restApi/dashboard";

const DashboardContext = createContext<any>(null);

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }: any) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    // Check if user is authenticated before making API call
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const accessToken = auth?.access;

    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const res = await getDashboardDataService();
    setDashboardData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth") {
        fetchDashboardData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        loading,
        refetch: fetchDashboardData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
