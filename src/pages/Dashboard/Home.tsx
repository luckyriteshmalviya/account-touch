import PageMeta from "../../components/common/PageMeta";
import SuperAdmin from "../SuperAdmin/SuperAdmin";
import Franchise from "../Franchise/Franchise";
import Checker from "../Checker/Checker";
import Maker from "../Maker/Maker";
import { useEffect, useState, useRef } from "react";
import { useDashboard } from "../../context/DashboardContext";

export default function Home() {
  const [role, setRole] = useState<string>("");
  const { refetch } = useDashboard();
  const hasRefetched = useRef(false); // Prevent multiple refetch calls

  useEffect(() => {
    const storedUserData = localStorage.getItem("auth");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      const userRoleSlug = userData?.user?.roles?.[0]?.slug;
      setRole(userRoleSlug || "");

      // Only refetch once when component mounts and user is authenticated
      if (userRoleSlug && refetch && !hasRefetched.current) {
        refetch();
        hasRefetched.current = true;
      }
    }
  }, []); // Empty dependency array - only run once on mount
  return (
    <>
      <PageMeta title="Account Touch Dashboard" description="Account Touch" />
      {role === "super_admin" && <SuperAdmin />}
      {role === "franchise" && <Franchise />}
      {role === "checker" && <Checker />}
      {role === "maker" && <Maker />}
    </>
  );
}
