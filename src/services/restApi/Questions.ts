import { getAccessToken } from "./user";

// ----------------------
// ✅ QUESTION SERVICES
// ----------------------

const API_BASE = "https://api.accountouch.com/api/tasks/questions";

// Common headers
const getAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

// ----------------------
// 1. Get List of Questions
// ----------------------
export const getQuestionListService = async (params: {
  page?: number;
  search?: string;
  ordering?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.search) queryParams.append("search", params.search);
    queryParams.append("ordering", params.ordering || "-created_at");

    const res = await fetch(`${API_BASE}/?${queryParams}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      console.error(`Error fetching questions: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getQuestionListService:", error);
    return null;
  }
};

// ----------------------
// 2. Get a Single Question by ID
// ----------------------
export const getQuestionDetailsService = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE}/${id}/`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      console.error(`Error fetching question details: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getQuestionDetailsService:", error);
    return null;
  }
};

// ----------------------
// 3. Create a Question (POST)
// ----------------------
export const addQuestionService = async (formData: FormData) => {
  try {
    const res = await fetch(`${API_BASE}/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Add Question failed:", errorText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error adding question:", error);
    return null;
  }
};

// ----------------------
// 4. Update Full Resource (PUT)
// ----------------------
export const updateQuestionService = async (id: string, formData: FormData) => {
  try {
    const res = await fetch(`${API_BASE}/${id}/`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Update Question failed:", errorText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error updating question:", error);
    return null;
  }
};

// ----------------------
// 5. Partial Update (PATCH)
// ----------------------
export const patchQuestionService = async (id: string, patchData: Record<string, any>) => {
  try {
    const res = await fetch(`${API_BASE}/${id}/`, {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patchData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Patch Question failed:", errorText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error patching question:", error);
    return null;
  }
};

// ----------------------
// 6. Delete a Question
// ----------------------
export const deleteQuestionService = async (id: string | number) => {
  try {
    const res = await fetch(`${API_BASE}/${id}/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return res.ok;
  } catch (error) {
    console.error("Error deleting question:", error);
    return false;
  }
};
