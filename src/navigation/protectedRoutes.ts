import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const ProtectedRoutesLayout = (props: any) => {
    const auth = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (!auth.isAuthenticated) {
          navigate("/signin")
        }
    }, [])

    return props.children
};
export default ProtectedRoutesLayout;
