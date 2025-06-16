import { createContext, useContext, useEffect, useState } from "react";
import { getDashboardDataService } from "../services/restApi/dashboard";

const DashboardContext = createContext<any>(null);

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }: any) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    const res = await getDashboardDataService();
    setDashboardData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardContext.Provider value={{ dashboardData, loading }}>
      {children}
    </DashboardContext.Provider>
  );
};
