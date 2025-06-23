export const getDashboardDataService = async () => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const accessToken = auth?.access;

    const res = await fetch(
      "https://api.accountouch.com/api/tasks/dashboard/",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch dashboard data");
    }
    const parsedResponse = await res.json();
    // console.log("parsedResponse", parsedResponse);
    return parsedResponse;
    // return await res.json();
  } catch (err) {
    console.error(err);
  }
};
