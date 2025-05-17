export const BASE_API_URL = "https://api.accountouch.com/";

// OTP Endpoints
export const SEND_OTP_ENDPOINT = "api/users/auth/login/otp/request";
export const VERIFY_OTP_ENDPOINT = "api/users/auth/login/otp/verify";

export const SIGN_UP_ENDPOINT = "api/users/auth/register";

// User Management Endpoints
export const GET_USER_PROFILE = "api/users/users/";               
export const USER_LIST_ENDPOINT = "api/users/users/";               // GET
export const ADD_USER_ENDPOINT = "api/users/users/";                // POST
export const USER_DETAILS_ENDPOINT = (id: string) => `api/users/users/${id}/`; // GET by ID
