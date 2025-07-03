import { getAccessToken } from "./user";

const API_URL = "https://api.accountouch.com/api/tasks/static-data/";

export const getStaticDataService = async () => {
  const token = getAccessToken();

  const res = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch static data");
  }

  return res.json();
};
