// 🔐 Utility to get access token
export const getAccessToken = () => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  return auth?.access || "";
};

interface UserPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  profile_picture: string;
  bio: string;
  country: string;
  password: string;
  pan_card: string;
  name_as_per_pan_card: string;
  aadhar_card: string;
  gst_number: string;
  gst_site_login: string;
  gst_site_password: string;
  is_active: boolean;
  roles: string[];
  assigned_to: string[];
}

// Add new user
export const addUserService = async (payload: UserPayload) => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const accessToken = auth?.access;

    console.log(payload,'payload');
    const formData = new FormData();

    // Append user fields to FormData
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "profile_picture") {
        if (value instanceof File) {
          formData.append("profile_picture", value);
        }
      } else {
        formData.append(key, value);
      }
    });

    const response = await fetch(`https://api.accountouch.com/api/users/users/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`, // ✅ No Content-Type here
      },
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Error in addUserService:", e);
    return null;
  }
};

// Get list of all users
export const getUserListService = async (params = {}) => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const accessToken = auth?.access;

    // Construct query string from `params` object
    const query = new URLSearchParams(params).toString();

    const response = await fetch(`https://api.accountouch.com/api/users/users/?${query}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Error in getUserListService:", e);
    return null;
  }
};

// Get user details by ID
export const userDetailsService = async (userId: string) => {
  try {
    // return await CreateRequest({
    //   url: USER_DETAILS_ENDPOINT(userId),
    //   method: "GET",
    // });
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    
    const accessToken = auth?.access;

    const response = await fetch(`https://api.accountouch.com/api/users/users/${userId}/`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Error in userDetailsService:", e);
    return null;
  }
};


export const updateUserService = async (payload: UserPayload, userId: string) => {
  try {

    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    
    const accessToken = auth?.access;
    
    const response = await fetch(`https://api.accountouch.com/api/users/users/${userId}/`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Error in userDetailsService:", e);
    return null;
  }
};
