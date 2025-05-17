
import { getAccessToken } from "./user";

export const getProcessTemplatListService = async (params: {
  is_active?: boolean;
  ordering?: string;
  page?: Number;
  processtype?: string;
  search?:string

}) => {
  try {
    const token = getAccessToken();

    const queryParams = new URLSearchParams();

    if (params.is_active) queryParams.append("is_active", params.is_active.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.processtype) queryParams.append("process_type", params.processtype);
    if (params.search) queryParams.append("search", params.search);
    if (params.ordering) {
      queryParams.append("ordering", params.ordering);
    } else {
      queryParams.append("ordering", "created_at"); // 👈 Default: latest created first
    }
    const res = await fetch(`https://api.accountouch.com/api/tasks/process-templates?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(`Error fetching ProcessTemplat list: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.error("Error in getProcessTemplatListService:", e);
    return null;
  }
};

export const getProcessTemplatDetailsService = async (id: string) => {
  try {
    const token = getAccessToken();
    const res = await fetch(`https://api.accountouch.com/api/tasks/process-templates/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (e) {
    console.error("Error in getProcessTemplatDetailsService:", e);
    return null;
  }
};

export const addProcessTemplatService = async (payload: any) => {
  const token = getAccessToken();
  const res = await fetch("https://api.accountouch.com/api/tasks/process-templates/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateProcessTemplatService = async (id: string, payload: any) => {
  const token = getAccessToken();
  const res = await fetch(`https://api.accountouch.com/api/tasks/process-templates/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteProcessTemplatService = async (processTemplatId: number) => {
  try {
    
    const token = getAccessToken();
    const res = await fetch(`https://api.accountouch.com/api/tasks/process-templates/${processTemplatId}/`, {
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
    console.error("Error deleting Process Templates:", error);
    return false;
  }
};

