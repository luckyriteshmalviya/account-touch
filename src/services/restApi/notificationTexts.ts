import { getAccessToken } from "./user";

const BASE_URL = "https://api.accountouch.com/api/tasks/notifications/";

const headers = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
  Accept: "application/json",
  "Content-Type": "application/json",
});

// 👉 GET list of notifications
export const getNotificationTextListService = async () => {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to fetch notification texts");
  return res.json();
};

// 👉 GET notification by ID
export const getNotificationTextByIdService = async (
  id: string | undefined
) => {
  const res = await fetch(`${BASE_URL}${id}/`, {
    method: "GET",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to fetch notification text");
  return res.json();
};

// 👉 CREATE new notification text
export const createNotificationTextService = async (data: any) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create notification text");
  return res.json();
};

// 👉 UPDATE existing notification text
export const updateNotificationTextService = async (
  id: string | undefined,
  data: any
) => {
  const res = await fetch(`${BASE_URL}${id}/`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update notification text");
  return res.json();
};

// 👉 DELETE notification text by ID
export const deleteNotificationTextService = async (id: number) => {
  const res = await fetch(`${BASE_URL}${id}/`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) {
    console.error("Failed to delete notification text");
    return false;
  }
  return true;
};
