
import { getAccessToken } from "./user";// ----------------------
// ✅ CATEGORY SERVICES
// ----------------------

// export const getCategoryListService = async (params: {
//   page?: number;
//   search?: string;
//   ordering?: string;
// }) => {
//   try {
//     const token = getAccessToken();

//     const queryParams = new URLSearchParams();

//     if (params.page) queryParams.append("page", params.page.toString()); // ← convert number to string
//     if (params.search) queryParams.append("search", params.search);
//     if (params.ordering) queryParams.append("ordering", params.ordering);

//     const res = await fetch(`https://api.accountouch.com/api/tasks/categories/?${queryParams.toString()}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return await res.json();
//   } catch (e) {
//     console.error("Error in getCategoryListService:", e);
//     return null;
//   }
// };

export const getCategoryListService = async (params: {
  page?: number;
  search?: string;
  ordering?: string;
}) => {
  try {
    const token = getAccessToken();

    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.search) queryParams.append("search", params.search);
    // ✅ If no custom ordering, set default to latest created
    if (params.ordering) {
      queryParams.append("ordering", params.ordering);
    } else {
      queryParams.append("ordering", "-created_at"); // 👈 Default: latest created first
    }

    const res = await fetch(`https://api.accountouch.com/api/tasks/categories/?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(`Error fetching category list: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (e) {
    console.error("Error in getCategoryListService:", e);
    return null;
  }
};



export const getCategoryDetailsService = async (id: string) => {
  try {
    const token = getAccessToken();
    const res = await fetch(`https://api.accountouch.com/api/tasks/categories/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (e) {
    console.error("Error in getCategoryDetailsService:", e);
    return null;
  }
};

export const addCategoryService = async (formData: FormData) => {
  try {
    const token = getAccessToken();
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
    const res = await fetch(`https://api.accountouch.com/api/tasks/categories/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await res.json();
  } catch (e) {
    console.error("Error adding category:", e);
    return null;
  }
};


export const updateCategoryService = async (
  id: number | string,
  formData: FormData
) => {
  try {
    const token = getAccessToken();

    const res = await fetch(`https://api.accountouch.com/api/tasks/categories/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Do NOT manually set 'Content-Type' when using FormData
      },
      body: formData,
    });

    return await res.json();
  } catch (e) {
    console.error("Error updating category:", e);
    return null;
  }
};

export const deleteCategoryService = async (categoryId: number) => {
  try {
    
    const token = getAccessToken();
    const res = await fetch(`https://api.accountouch.com/api/tasks/categories/${categoryId}/`, {
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
    console.error("Error deleting category:", error);
    return false;
  }
};

