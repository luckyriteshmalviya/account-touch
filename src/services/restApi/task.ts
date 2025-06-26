import { getAccessToken } from "./user";

export const addTaskService = async (formData: FormData) => {
  try {
    const token = getAccessToken();

    const res = await fetch(`https://api.accountouch.com/api/tasks/tasks/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await res.json();
  } catch (error) {
    console.error("Error adding task:", error);
    return null;
  }
};

export const updateTaskService = async (
  id: number | string,
  formData: FormData
) => {
  try {
    const token = getAccessToken();

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/tasks/${id}/`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
};

export const getTaskDetailsService = async (id: string) => {
  try {
    const token = getAccessToken();

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/tasks/${id}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Error getting task details:", error);
    return null;
  }
};

export const getTaskListService = async (params: {
  category?: string;
  checker?: string;
  client?: string;
  completed_after?: string;
  completed_before?: string;
  created_after?: string;
  created_before?: string;
  due_after?: string;
  due_before?: string;
  maker?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  priority?: "low" | "medium" | "high" | "urgent";
  search?: string;
  started_after?: string;
  started_before?: string;
  status?: string;
  franchise?: string;
}) => {
  try {
    const token = getAccessToken();

    const queryParams = new URLSearchParams();

    if (params.category) queryParams.append("category", params.category);
    if (params.checker) queryParams.append("checker", params.checker);
    if (params.client) queryParams.append("client", params.client);
    if (params.completed_after)
      queryParams.append("completed_after", params.completed_after);
    if (params.completed_before)
      queryParams.append("completed_before", params.completed_before);
    if (params.created_after)
      queryParams.append("created_after", params.created_after);
    if (params.created_before)
      queryParams.append("created_before", params.created_before);
    if (params.due_after) queryParams.append("due_after", params.due_after);
    if (params.due_before) queryParams.append("due_before", params.due_before);
    if (params.maker) queryParams.append("maker", params.maker);
    if (params.ordering) queryParams.append("ordering", params.ordering);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.page_size)
      queryParams.append("page_size", params.page_size.toString());
    if (params.priority)
      queryParams.append("priority", params.priority as string);
    if (params.search) queryParams.append("search", params.search);
    if (params.started_after)
      queryParams.append("started_after", params.started_after);
    if (params.started_before)
      queryParams.append("started_before", params.started_before);
    if (params.status) queryParams.append("status", params.status);
    if (params.franchise) queryParams.append("franchise", params.franchise);

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/tasks/?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getTaskListService:", error);
    return null;
  }
};

export const deleteTaskService = async (taskId: string) => {
  try {
    const token = getAccessToken();

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.ok;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
};

// Questionnaire submission service
export const submitQuestionnaireService = async (data: {
  questionnaire_id: string;
  process_id: number;
  task_id: string;
  response_data: Array<{
    question: number;
    text_response?: string;
    selected_choice?: string;
  }>;
}) => {
  try {
    const token = getAccessToken();

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/questionnaire-submissions/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await res.json();

    // Check if the response is not successful
    if (!res.ok) {
      return {
        error: responseData.detail || `Error: ${res.status} ${res.statusText}`,
        status: res.status,
        data: responseData,
      };
    }

    return responseData;
  } catch (error) {
    console.error("Error submitting questionnaire:", error);
    return { error: "Network or server error occurred", status: 500 };
  }
};

// Document upload service
export const uploadDocumentService = async (
  processId: number,
  documentTypeIdentifier: string,
  file: File
) => {
  try {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append("document_type_identifier", documentTypeIdentifier);
    formData.append("file", file);
    formData.append("process", processId.toString());

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/processes/${processId}/documents/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const responseData = await res.json();

    // Check if the response is not successful
    if (!res.ok) {
      return {
        error: responseData.detail || `Error: ${res.status} ${res.statusText}`,
        status: res.status,
        data: responseData,
      };
    }

    return responseData;
  } catch (error) {
    console.error("Error uploading document:", error);
    return { error: "Network or server error occurred", status: 500 };
  }
};

// Payment processing service
export const processPaymentService = async (
  processId: number,
  paymentData: any
) => {
  try {
    const token = getAccessToken();

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/processes/${processId}/payment/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Error processing payment:", error);
    return null;
  }
};

// Document preparation service
export const submitDocumentPreparationService = async (
  taskId: number | String
) => {
  try {
    const token = getAccessToken();

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/tasks/${taskId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
        }),
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Error submitting document preparation:", error);
    return null;
  }
};

export const updateTaskDetails = async (
  taskId: number | String,
  details: any
) => {
  try {
    const token = getAccessToken();

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/tasks/${taskId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Error submitting document preparation:", error);
    return null;
  }
};

// Update payment status service
export const updatePaymentStatusService = async (
  processId: number,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED" | "CANCELLED"
) => {
  try {
    const token = getAccessToken();

    // Convert uppercase status to lowercase as expected by API
    const statusMapping = {
      PENDING: "pending",
      IN_PROGRESS: "in_progress",
      COMPLETED: "completed",
      REJECTED: "rejected",
      CANCELLED: "cancelled",
    };

    const apiStatus = statusMapping[status];

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/processes/${processId}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: apiStatus }),
      }
    );

    const responseData = await res.json();

    // Check if the response is not successful
    if (!res.ok) {
      return {
        error: responseData.detail || `Error: ${res.status} ${res.statusText}`,
        status: res.status,
        data: responseData,
      };
    }

    return responseData;
  } catch (error) {
    console.error("Error updating payment status:", error);
    return { error: "Network or server error occurred", status: 500 };
  }
};

// Request payment service
export const requestPaymentService = async (processId: number) => {
  try {
    const token = getAccessToken();

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/processes/${processId}/request-payment/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await res.json();

    // Check if the response is not successful
    if (!res.ok) {
      return {
        error: responseData.detail || `Error: ${res.status} ${res.statusText}`,
        status: res.status,
        data: responseData,
      };
    }

    return responseData;
  } catch (error) {
    console.error("Error requesting payment:", error);
    return { error: "Network or server error occurred", status: 500 };
  }
};
