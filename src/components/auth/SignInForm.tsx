import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { verifyOtp, sendOtp } from "../../services/restApi/auth";
import Swal from "sweetalert2";

export default function SignInForm() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    country: "india",
    phone_number: "",
    email: "",
    auth_type: "phone",
  });

  const [errors, setErrors] = useState({
    phone_number: "",
    email: "",
  });

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  // Update state with validation
  const updateState = (key: string, value: string) => {
    if (key === "phone_number") {
      const onlyDigits = value.replace(/\D/g, ""); // remove non-digits
      if (onlyDigits.length > 10) return;
      setState((prev) => ({
        ...prev,
        [key]: onlyDigits,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const signIn = async (otpCode: string) => {
    const payload: any = {
      type: state.auth_type.toUpperCase(),
      country: state.country,
      code: otpCode,
    };

    if (state.auth_type === "phone") {
      payload.phone_number = state.phone_number;
    } else {
      payload.email = state.email;
    }

    try {
      const response = await verifyOtp(payload);

      if (
        response &&
        response?.user?.roles?.length === 1 &&
        response.user.roles?.[0]?.slug === "client"
      ) {
        setState({
          country: "india",
          phone_number: "",
          email: "",
          auth_type: "phone",
        });
        setShowOtp(false);
        return Swal.fire({
          icon: "error",
          title: "Login!",
          text: "Client Role don't have access to panel. Please login through another number",
        });
      }

      if (response?.access && response?.refresh) {
        localStorage.setItem(
          "auth",
          JSON.stringify({
            phone_number: response.user?.phone_number,
            email: response.user?.email,
            country: response.user?.country,
            access: response.access,
            refresh: response.refresh,
            user: response.user,
          })
        );
        Swal.fire({
          icon: "success",
          title: "Login!",
          text: "Login successfuly!",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login!",
          text: "Invalid OTP!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login!",
        text: "Something went wrong while verifying OTP!",
      });
    }
  };

  // Form submit for sending OTP
  const handleNavigate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { auth_type, phone_number, email } = state;
    let hasError = false;

    if (auth_type === "phone") {
      if (!phone_number) {
        setErrors((prev) => ({ ...prev, phone_number: "Required" }));
        Swal.fire({
          icon: "error",
          title: "Login!",
          text: "Phone number is required",
          timer: 2000,
          showConfirmButton: false,
        });
        hasError = true;
      } else if (phone_number.length !== 10) {
        setErrors((prev) => ({
          ...prev,
          phone_number: "Phone number must be 10 digits",
        }));
        Swal.fire({
          icon: "error",
          title: "Login!",
          text: "Phone number must be 10 digits",
          timer: 2000,
          showConfirmButton: false,
        });
        hasError = true;
      }
    }

    if (auth_type === "email" && !email) {
      setErrors((prev) => ({ ...prev, email: "Required" }));
      Swal.fire({
        icon: "error",
        title: "Login!",
        text: "Email is required",
      });
      hasError = true;
    }

    if (hasError) return;

    const payload: any = {
      type: auth_type.toUpperCase(),
      country: state.country,
    };

    if (auth_type === "phone") {
      payload.phone_number = phone_number;
    } else {
      payload.email = email;
    }

    try {
      const response = await sendOtp(payload);

      if (response?.message === "OTP sent successfully") {
        setShowOtp(true);
        setOtp(response?.otp);
        Swal.fire({
          icon: "success",
          title: "OTP!",
          text: "OTP sent successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          phone_number: "No user found with this phone number.",
        }));
        Swal.fire({
          icon: "error",
          title: "Login!",
          text: "Failed to send OTP",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login!",
        text: "Something went wrong while sending OTP.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn(otp);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
          </div>

          <div className="flex gap-4 my-4">
            <label className="flex items-center gap-1">Phone</label>
          </div>

          {showOtp ? (
            <form onSubmit={handleSignIn}>
              <div className="space-y-6">
                <div>
                  <Label>
                    OTP <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <br />
                Didn't get an OTP?{" "}
                <span
                  onClick={handleNavigate as any}
                  className="text-brand-500 cursor-pointer"
                >
                  Resend it!
                </span>
                <Button type="submit" className="w-full" size="sm">
                  Sign In
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleNavigate}>
              <div className="space-y-6">
                {state.auth_type === "phone" && (
                  <div>
                    <Label>
                      Mobile Number <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      placeholder="Enter your mobile number"
                      value={state.phone_number}
                      onChange={(e) =>
                        updateState("phone_number", e.target.value)
                      }
                    />
                    {errors.phone_number && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.phone_number}
                      </p>
                    )}
                  </div>
                )}
                <Button type="submit" className="w-full" size="sm">
                  Send OTP
                </Button>
              </div>
            </form>
          )}

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
