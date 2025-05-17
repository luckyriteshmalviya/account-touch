
import { getAccessToken } from "./user";

export const getQuestionnairesListService = async (params: {
  page?: Number;
  search?:string
}) => {
  try {
    const token = getAccessToken();

    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.search) queryParams.append("search", params.search);
    const res = await fetch(`https://api.accountouch.com/api/tasks/questionnaires?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(`Error fetching Questionnaires list: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.error("Error in getQuestionnairesListService:", e);
    return null;
  }
};

export const getQuestionnairesDetailsService = async (id: string) => {
  try {
    const token = getAccessToken();
    const res = await fetch(`https://api.accountouch.com/api/tasks/questionnaires/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (e) {
    console.error("Error in getQuestionnairesDetailsService:", e);
    return null;
  }
};

export const addQuestionnairesService = async (payload: {
  title: string;
  description: string;
  is_active: boolean;
}) => {
  try {
    const token = getAccessToken();

    const res = await fetch(`https://api.accountouch.com/api/tasks/questionnaires/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (e) {
    console.error("Error adding Questionnaires:", e);
    return null;
  }
};

export const updateQuestionnairesService = async (
  id: string,
  payload: {
    title: string;
    description: string;
    is_active: boolean;
  }
) => {
  try {
    const token = getAccessToken();

    const res = await fetch(`https://api.accountouch.com/api/tasks/questionnaires/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (e) {
    console.error("Error updating Questionnaires:", e);
    return null;
  }
};

export const deleteQuestionnairesService = async (questionnairesId: number) => {
  try {
    
    const token = getAccessToken();
    const res = await fetch(`https://api.accountouch.com/api/tasks/questionnaires/${questionnairesId}/`, {
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

