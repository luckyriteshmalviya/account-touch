import { useState, useEffect } from "react";

function useIsSuperAdmin() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      const roles = auth?.user?.roles || [];
      const hasSuperAdmin = roles.some(
        (role: { name: string }) => role.name === "Super Admin"
      );
      setIsSuperAdmin(hasSuperAdmin);
    } catch (error) {
      setIsSuperAdmin(false);
    }
  }, []);

  return isSuperAdmin;
}

export default useIsSuperAdmin;
