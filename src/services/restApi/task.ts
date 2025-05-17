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

    const res = await fetch(`https://api.accountouch.com/api/tasks/tasks/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await res.json();
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
};

export const getTaskDetailsService = async (id: string) => {
  try {
    const token = getAccessToken();

    const res = await fetch(`https://api.accountouch.com/api/tasks/tasks/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
}) => {
  try {
    const token = getAccessToken();

    const queryParams = new URLSearchParams();

    if (params.category) queryParams.append("category", params.category);
    if (params.checker) queryParams.append("checker", params.checker);
    if (params.client) queryParams.append("client", params.client);
    if (params.completed_after) queryParams.append("completed_after", params.completed_after);
    if (params.completed_before) queryParams.append("completed_before", params.completed_before);
    if (params.due_after) queryParams.append("due_after", params.due_after);
    if (params.due_before) queryParams.append("due_before", params.due_before);
    if (params.maker) queryParams.append("maker", params.maker);
    if (params.ordering) queryParams.append("ordering", params.ordering);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.page_size) queryParams.append("page_size", params.page_size.toString());
    if (params.priority) queryParams.append("priority", params.priority as string);
    if (params.search) queryParams.append("search", params.search);
    if (params.started_after) queryParams.append("started_after", params.started_after);
    if (params.started_before) queryParams.append("started_before", params.started_before);
    if (params.status) queryParams.append("status", params.status);

    const res = await fetch(`https://api.accountouch.com/api/tasks/tasks/?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res, 'res');

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getTaskListService:", error);
    return null;
  }
};

export const deleteTaskService = async (taskId: number) => {
  console.log(taskId, 'taskId');

  try {
    const token = getAccessToken();

    const res = await fetch(`https://api.accountouch.com/api/tasks/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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

    const res = await fetch(`https://api.accountouch.com/api/tasks/questionnaire-submissions/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    // Check if the response is not successful
    if (!res.ok) {
      return {
        error: responseData.detail || `Error: ${res.status} ${res.statusText}`,
        status: res.status,
        data: responseData
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

    // Log the request details for debugging
    console.log("Document upload request:", {
      url: `https://api.accountouch.com/api/tasks/processes/${processId}/documents/`,
      processId,
      documentTypeIdentifier,
      fileName: file.name,
      fileSize: file.size,
    });

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

    // Log the response status and headers
    console.log("Document upload response:", {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries([...res.headers.entries()]),
    });

    const responseData = await res.json();
    console.log("Document upload response data:", responseData);

    // Check if the response is not successful
    if (!res.ok) {
      return {
        error: responseData.detail || `Error: ${res.status} ${res.statusText}`,
        status: res.status,
        data: responseData
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
  processId: number,
  data: any
) => {
  try {
    const token = getAccessToken();

    const res = await fetch(
      `https://api.accountouch.com/api/tasks/processes/${processId}/document-preparation/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Error submitting document preparation:", error);
    return null;
  }
};