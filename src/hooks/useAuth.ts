import { useSelector } from "react-redux";
import { UserProfile } from "../redux/reduxTypes";

interface AuthState {
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
}

const useAuth = (): AuthState => {
  const userProfile = useSelector((state: any) => state.auth.user.profile);
  const localStorageProfile = localStorage.getItem("auth");

  if (!localStorageProfile && !userProfile) {
    return {
      userProfile: null,
      isAuthenticated: false,
    };
  }
  try {
    const parsedProfile = userProfile || JSON.parse(localStorageProfile || "{}");
    
    const token = parsedProfile?.access;

    if (!token) {
      return {
        userProfile: null,
        isAuthenticated: false,
      };
    }

    // Decode JWT without using any library
    const base64Payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(base64Payload)); // this gives you the payload
    const exp = decodedPayload.exp;

    const isExpired = exp * 1000 < Date.now();

    if (isExpired) {
      // Optional: Clear localStorage if token is expired
      localStorage.removeItem("auth");
      return {
        userProfile: null,
        isAuthenticated: false,
      };
    }

    return {
      userProfile: parsedProfile,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("useAuth error:", error);
    return {
      userProfile: null,
      isAuthenticated: false,
    };
  }
};

export default useAuth;
