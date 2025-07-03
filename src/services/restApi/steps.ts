import { getAccessToken } from "./user";

// ----------------------
// ✅ STEPS SERVICES (by ID)
// ----------------------

// List all steps
export const getStepsListService = async (params: {
  page?: number;
  search?: string;
  ordering?: string;
}) => {
  try {
    const token = getAccessToken();

    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.ordering) {
      queryParams.append("ordering", params.ordering);
    } else {
      queryParams.append("page_size", "500");
    }

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/steps/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      console.error(`Error fetching steps: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error in getStepsListService:", e);
    return null;
  }
};

// Get step by ID
export const getStepDetailsService = async (id: string | number) => {
  try {
    const token = getAccessToken();
    const res = await fetch(
      `https://api.accountouch.com/api/tasks/steps/${id}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      console.error(`Error fetching step details: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error in getStepDetailsService:", e);
    return null;
  }
};

// Create new step
export const addStepService = async (formData: FormData) => {
  try {
    const token = getAccessToken();
    const res = await fetch(`https://api.accountouch.com/api/tasks/steps/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      console.error("Error creating step:", await res.text());
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error in addStepService:", e);
    return null;
  }
};

// Update existing step by ID
export const updateStepService = async (
  id: string | number,
  formData: FormData
) => {
  try {
    const token = getAccessToken();
    const res = await fetch(
      `https://api.accountouch.com/api/tasks/steps/${id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      console.error("Error updating step:", await res.text());
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error in updateStepService:", e);
    return null;
  }
};

// Delete step by ID
export const deleteStepService = async (id: string | number) => {
  try {
    const token = getAccessToken();
    const res = await fetch(
      `https://api.accountouch.com/api/tasks/steps/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.ok;
  } catch (e) {
    console.error("Error in deleteStepService:", e);
    return false;
  }
};
