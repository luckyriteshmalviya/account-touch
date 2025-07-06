import { getAccessToken } from "./user";

// Interfaces
export interface HotTaskTemplate {
  id: number;
  task_template: number;
  task_template_title: string;
  image: string;
  featured_order: number;
  created_by: number;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface HotTaskTemplateResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: HotTaskTemplate[];
}

export interface HotTaskTemplateParams {
  page?: number;
  page_size?: number;
  ordering?: string;
  search?: string;
}

// ✅ GET Hot Task Templates list
export const getHotTaskTemplateListService = async (
  params: HotTaskTemplateParams = {}
): Promise<HotTaskTemplateResponse | null> => {
  try {
    const token = getAccessToken();
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.page_size)
      queryParams.append("page_size", params.page_size.toString());
    if (params.ordering) queryParams.append("ordering", params.ordering);
    if (params.search) queryParams.append("search", params.search);

    const url = `https://api.accountouch.com/api/tasks/hot-task-templates/?${queryParams.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(
        `Error fetching hot task templates: ${res.status} ${res.statusText}`
      );
      return null;
    }

    const data: HotTaskTemplateResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getHotTaskTemplateListService:", error);
    return null;
  }
};

// ✅ GET Hot Task Template by ID
export const getHotTaskTemplateDetailsService = async (
  id: number | string
): Promise<HotTaskTemplate | null> => {
  try {
    const token = getAccessToken();
    const res = await fetch(
      `https://api.accountouch.com/api/tasks/hot-task-templates/${id}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      console.error(
        `Error fetching hot task template details: ${res.status} ${res.statusText}`
      );
      return null;
    }

    const data: HotTaskTemplate = await res.json();
    return data;
  } catch (e) {
    console.error("Error in getHotTaskTemplateDetailsService:", e);
    return null;
  }
};

// ✅ POST Create Hot Task Template
// ✅ POST Create Hot Task Template (with JSON)
export const addHotTaskTemplateService = async (payload: {
  task_template: number;
  featured_order: number;
}): Promise<HotTaskTemplate | null> => {
  try {
    const token = getAccessToken();
    const res = await fetch(
      "https://api.accountouch.com/api/tasks/hot-task-templates/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("API Error:", errorData);
      throw new Error(`HTTP ${res.status}: ${JSON.stringify(errorData)}`);
    }

    const data: HotTaskTemplate = await res.json();
    return data;
  } catch (error) {
    console.error("Error in addHotTaskTemplateService:", error);
    throw error;
  }
};

// ✅ PATCH Update Hot Task Template by ID
export const updateHotTaskTemplateService = async (
  id: number | string,
  payload: any
): Promise<HotTaskTemplate | null> => {
  try {
    const token = getAccessToken();
    const isFormData = payload instanceof FormData;

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/hot-task-templates/${id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          ...(!isFormData && { "Content-Type": "application/json" }),
        },
        body: isFormData ? payload : JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("API Error:", errorData);
      throw new Error(`HTTP ${res.status}: ${JSON.stringify(errorData)}`);
    }

    const data: HotTaskTemplate = await res.json();
    return data;
  } catch (error) {
    console.error("Error in updateHotTaskTemplateService:", error);
    throw error;
  }
};

// ✅ DELETE Hot Task Template by ID
export const deleteHotTaskTemplateService = async (
  id: number | string
): Promise<boolean> => {
  try {
    const token = getAccessToken();
    const res = await fetch(
      `https://api.accountouch.com/api/tasks/hot-task-templates/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      return true;
    } else {
      console.error(
        `Failed to delete hot task template: ${res.status} ${res.statusText}`
      );
      return false;
    }
  } catch (error) {
    console.error("Error deleting Hot Task Template:", error);
    return false;
  }
};
