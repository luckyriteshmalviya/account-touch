import { getAccessToken } from "./user";

const baseUrl = "https://api.accountouch.com/api/tasks/banners/";

// ✅ Get list of banner images (with optional query params)
export const getBannerListService = async (params: {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}) => {
  try {
    const token = getAccessToken();
    const queryParams = new URLSearchParams();

    // add params if available
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.page_size)
      queryParams.append("page_size", params.page_size.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.ordering) {
      queryParams.append("ordering", params.ordering);
    } else {
      queryParams.append("ordering", "-id"); // latest first by default
    }

    const res = await fetch(`${baseUrl}?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(
        `Error fetching banner list: ${res.status} ${res.statusText}`
      );
      return null;
    }

    const data = await res.json();
    return data; // count, next, previous, results[]
  } catch (e) {
    console.error("Error in getBannerListService:", e);
    return null;
  }
};

// Get details of a single banner image
export const getBannerDetailsService = async (id: number | string) => {
  try {
    const token = getAccessToken();
    const res = await fetch(`${baseUrl}${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(
        `Error fetching banner details: ${res.status} ${res.statusText}`
      );
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error in getBannerDetailsService:", e);
    return null;
  }
};

// Add new banner image
export const addBannerService = async (formData: FormData) => {
  try {
    const token = getAccessToken();

    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: no Content-Type header for FormData
      },
      body: formData,
    });

    if (!res.ok) {
      console.error(
        `Error adding banner image: ${res.status} ${res.statusText}`
      );
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error adding banner image:", e);
    return null;
  }
};

// Update existing banner image

export const updateBannerService = async (
  id: number | string,
  formData: FormData
) => {
  try {
    const token = getAccessToken();
    const res = await fetch(`${baseUrl}${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      // Parse error response to get detailed error message
      const errorData = await res.json();
      console.error(
        `Error updating banner: ${res.status} ${res.statusText}`,
        errorData
      );
      throw new Error(`Server error: ${JSON.stringify(errorData)}`);
    }

    return await res.json();
  } catch (e) {
    console.error("Error updating banner:", e);
    throw e; // Re-throw to let the calling function handle it
  }
};
// Delete banner image
export const deleteBannerService = async (id: number | string) => {
  try {
    const token = getAccessToken();

    const res = await fetch(`${baseUrl}${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      return true;
    } else {
      console.error(
        `Error deleting banner image: ${res.status} ${res.statusText}`
      );
      return false;
    }
  } catch (e) {
    console.error("Error deleting banner image:", e);
    return false;
  }
};

// Update existing banner image using PATCH
export const updateBannerServicePatch = async (
  id: number | string,
  formData: FormData
) => {
  try {
    const token = getAccessToken();
    const res = await fetch(`${baseUrl}${id}/`, {
      method: "PATCH", // Use PATCH instead of PUT
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error(
        `Error updating banner: ${res.status} ${res.statusText}`,
        errorData
      );
      throw new Error(`Server error: ${JSON.stringify(errorData)}`);
    }

    return await res.json();
  } catch (e) {
    console.error("Error updating banner:", e);
    throw e;
  }
};
