import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const ProtectedRoutesLayout = (props: any) => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate("/signin");
    }
  }, [auth.isAuthenticated, navigate]);

  return props.children;
};
export default ProtectedRoutesLayout;
