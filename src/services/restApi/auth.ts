// All Api calling related to auth module will comes here.

import { UserProfile } from "../../redux/reduxTypes.ts";
import {
  GET_USER_PROFILE,
} from "../../constants/apiEndPoints.ts";
import CreateRequest from "../apiMiddleware.ts";


export interface UserAuthBody {
  type: string;
  phone_number: string;
  country: string;
  code?: string
}


export const sendOtp = async (payload: UserAuthBody) => {
  
  try {
    const response = await fetch(`https://api.accountouch.com/api/users/auth/login/otp/request/`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json(); // parse the response body
    return data; // return the parsed data, not the raw Response
  } catch (e) {
    return console.log("something went wrong in userLogin api");
  }
};

export const verifyOtp = async (payload: UserAuthBody) => {
  try {
    const response = await fetch(`https://api.accountouch.com/api/users/auth/login/otp/verify/`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },      
    });
    const data = await response.json(); // parse the response body
    return data;
  } catch (e) {
    return console.log("something went wrong in userLogin api");
  }
};

export const signUp = async (payload: any) => {
  try {
    const response = await fetch(`https://api.accountouch.com/api/users/auth/register/`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },      
    });
    const data = await response.json(); // parse the response body
    return data;
  } catch (e) {
    console.log("Something went wrong in signUp API", e);
  }
};


export const userProfile = async (): Promise<UserProfile | null> => {
  return CreateRequest({
    url: GET_USER_PROFILE,
    method: "GET",
  })
    .then((res: any) => {
      if (res?.data?.user) {
        return { ...res.data.user, settings: res.data.settings };
      }
      return null;
    })
    .catch((e: Error) => {
      console.error("Err: ", e);
      return null;
    });
};




// export const userCreate = async (
//   payload: UserCreateRequestBody
// ): Promise<UserCreateResponse | null> => {
//   return CreateRequest({
//     url: "/user/",
//     method: "POST",
//     data: payload,
//   })
//     .then((res) => {
//       return res.data;
//     })
//     .catch((e) => {
//       console.error("Err: ", e);
//       return null;
//     });
// };


