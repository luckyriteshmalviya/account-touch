import { getAccessToken } from "./user";

// ----------------------
// ✅ DOCUMENT TYPE SERVICES (by ID)
// ----------------------

// List all document types
export const getDocumentTypeListService = async (params: {
  page?: number;
  search?: string;
  ordering?: string;
}) => {
  try {
    const token = getAccessToken();

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.ordering) {
      queryParams.append("ordering", params.ordering);
    } else {
      queryParams.append("ordering", "-created_at");
    }

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/document-types/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      console.error(`Error fetching document types: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error in getDocumentTypeListService:", e);
    return null;
  }
};

// Get document type by ID
export const getDocumentTypeDetailsService = async (id: string) => {
  try {
    const token = getAccessToken();
    const res = await fetch(
      `https://api.accountouch.com/api/tasks/document-types/${id}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      console.error(`Error fetching document type details: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error in getDocumentTypeDetailsService:", e);
    return null;
  }
};

// Create new document type
export const addDocumentTypeService = async (formData: FormData) => {
  try {
    const token = getAccessToken();
    const res = await fetch(
      `https://api.accountouch.com/api/tasks/document-types/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      console.error("Error creating document type:", await res.text());
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error in addDocumentTypeService:", e);
    return null;
  }
};

// Update existing document type by ID
export const updateDocumentTypeService = async (
  id: string,
  formData: FormData
) => {
  try {
    const token = getAccessToken();
    const res = await fetch(
      `https://api.accountouch.com/api/tasks/document-types/${id}/`,
      {
        method: "PATCH", // or PUT if replacing entirely
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      console.error("Error updating document type:", await res.text());
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error in updateDocumentTypeService:", e);
    return null;
  }
};

// Delete document type by ID
export const deleteDocumentTypeService = async (id: string | number) => {
  try {
    const token = getAccessToken();
    const res = await fetch(
      `https://api.accountouch.com/api/tasks/document-types/${id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.ok;
  } catch (e) {
    console.error("Error in deleteDocumentTypeService:", e);
    return false;
  }
};
