
import { getAccessToken } from "./user";

export const getTaskTemplatCategory = async()=>{
    try {
        const token = getAccessToken();
        const res = await fetch(`https://api.accountouch.com/api/tasks/categories/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        return await res.json();
    } catch (e) {
        console.error("Error in getTaskTemplatCategory:", e);
        return null;
    }
};

export const getTaskTemplatListService = async (params: {
  isActive?: boolean;
  isReady?: boolean;
  selectedCategory?: number | string;
  ordering?: string;
  page?: number;
  page_size?: number;
  search?: string;
}) => {
  try {
    const token = getAccessToken();

    const queryParams = new URLSearchParams();

    // Append params if present
    if (params.isActive !== undefined) queryParams.append("is_active", params.isActive.toString());
    if (params.isReady !== undefined) queryParams.append("is_ready", params.isReady.toString());
    if (params.selectedCategory !== undefined) queryParams.append("category", params.selectedCategory.toString());
    if (params.page !== undefined) queryParams.append("page", params.page.toString());
    if (params.page_size !== undefined) queryParams.append("page_size", params.page_size.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.ordering) {
      queryParams.append("ordering", params.ordering);
    } else {
      queryParams.append("ordering", "created_at"); // default ordering
    }

    const url = `https://api.accountouch.com/api/tasks/task-templates/?${queryParams.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Error fetching task templates: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getTaskTemplatListService:", error);
    return null;
  }
};

export const getTaskTemplatDetailsService = async (id: string) => {
  try {
    const token = getAccessToken();
    const res = await fetch(`https://api.accountouch.com/api/tasks/task-templates/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (e) {
    console.error("Error in getTaskTemplatDetailsService:", e);
    return null;
  }
};

export const addTaskTemplatService = async (payload: any) => {
  const token = getAccessToken();
  const res = await fetch("https://api.accountouch.com/api/tasks/task-templates/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateTaskTemplatService = async (id: string, payload: any) => {
  const token = getAccessToken();
  const res = await fetch(`https://api.accountouch.com/api/tasks/task-templates/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteTaskTemplatService = async (taskTemplatId: number) => {
  try {
    const token = getAccessToken();
    const res = await fetch(`https://api.accountouch.com/api/tasks/task-templates/${taskTemplatId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      return true; // ✅ Return success flag
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting Task Templates:", error);
    return false;
  }
};

