import { getAccessToken } from "./user";

const BASE_URL = "https://api.accountouch.com/api/tasks/procedures/";

// Common headers
const headers = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
  "Content-Type": "application/json",
  Accept: "application/json",
});

// 📥 GET: List Procedures (with pagination + search)
export const getProceduresListService = async (params: {
  page?: number;
  search?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.search) queryParams.append("search", params.search);

    const res = await fetch(`${BASE_URL}?${queryParams.toString()}`, {
      method: "GET",
      headers: headers(),
    });

    if (!res.ok) {
      console.error(
        `Error fetching Procedures list: ${res.status} ${res.statusText}`
      );
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error in getProceduresListService:", e);
    return null;
  }
};

// 📥 GET: Single Procedure Details
export const getProcedureDetailsService = async (id: string | number) => {
  try {
    const res = await fetch(`${BASE_URL}${id}/`, {
      method: "GET",
      headers: headers(),
    });
    if (!res.ok) {
      console.error(`Failed to fetch Procedure: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error("Error in getProcedureDetailsService:", e);
    return null;
  }
};

// 📤 POST: Add New Procedure
export const addProcedureService = async (payload: {
  title: string;
  description: string;
  steps: {
    step_text: string;
    description: string;
  }[];
}) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Failed to add Procedure:", res.statusText);
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error adding Procedure:", e);
    return null;
  }
};

// 📤 PATCH: Update Existing Procedure
export const updateProcedureService = async (
  id: string | number,
  payload: {
    title: string;
    description: string;
    steps: {
      step_text: string;
      description: string;
    }[];
  }
) => {
  try {
    const res = await fetch(`${BASE_URL}${id}/`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Failed to update Procedure:", res.statusText);
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error updating Procedure:", e);
    return null;
  }
};

// ❌ DELETE: Remove Procedure
export const deleteProcedureService = async (procedureId: number) => {
  try {
    const token = getAccessToken();
    // console.log("Deleting procedure id: ", procedureId);
    const res = await fetch(
      `https://api.accountouch.com/api/tasks/procedures/${procedureId}/`,
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
      console.error("Failed with status: ", res.status);
      return false;
    }
  } catch (error) {
    console.error("Error deleting procedure:", error);
    return false;
  }
};

export interface ProcedureWithStepIdsPayload {
  title: string;
  description: string;
  step_data: Array<{ step_id: number; order: number }>;
  is_active: boolean;
}
export const addProcedureWithStepIdsService = async (
  payload: ProcedureWithStepIdsPayload
) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Failed to add Procedure with step_ids:", res.statusText);
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error adding Procedure with step_ids:", e);
    return null;
  }
};

export const updateProcedureWithStepIdsService = async (
  id: string | number,
  payload: ProcedureWithStepIdsPayload
) => {
  try {
    const res = await fetch(`${BASE_URL}${id}/`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Failed to update Procedure:", res.statusText);
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("Error updating Procedure:", e);
    return null;
  }
};
