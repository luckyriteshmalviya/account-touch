// import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import SuperAdmin from "../SuperAdmin/SuperAdmin";
import Franchise from "../Franchise/Franchise";
import Checker from "../Checker/Checker";
import Maker from "../Maker/Maker";
import { useEffect, useState } from "react";

export default function Home() {
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const storedUserData = localStorage.getItem("auth");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      const userRoleSlug = userData?.user?.roles?.[0]?.slug;
      setRole(userRoleSlug || "");
    }
  }, []);
  return (
    <>
      {/* udpate on 3/5/2025 */}

      <PageMeta title="Account Touch Dashboard" description="Account Touch" />
      {role === "super-admin" && <SuperAdmin />}
      {role === "franchise" && <Franchise />}
      {role === "checker" && <Checker />}
      {role === "maker" && <Maker />}
      {/* udpate on 3/5/2025 */}

      {/* <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div> */}
    </>
  );
}
