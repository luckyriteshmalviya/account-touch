import { useEffect, useState } from "react";
import { GroupIcon } from "../../icons";
import { getUserListService } from "../../services/restApi/user";

export default function UserData() {
  const [counts, setCounts] = useState({
    clients: 0,
    franchises: 0,
    checkers: 0,
    makers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");

  useEffect(() => {
    const fetchAllPages = async (url?: string, allResults: any[] = []) => {
      const params = url ? {} : { page_size: 100 }; // pehle page pe page_size de do
      const data = url
        ? await fetch(url, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("auth") || "{}")?.access
              }`,
            },
          }).then((res) => res.json())
        : await getUserListService(params);

      const combinedResults = [...allResults, ...(data.results || [])];

      if (data.next) {
        // next page call karo
        return await fetchAllPages(data.next, combinedResults);
      } else {
        // sab pages aagaye
        return combinedResults;
      }
    };

    const fetchCounts = async () => {
      try {
        setLoading(true);

        const users = await fetchAllPages();

        // Count based on roles inside each user
        const clients = users.filter((user: any) =>
          user.roles.includes("Client")
        ).length;

        const franchises = users.filter((user: any) =>
          user.roles.includes("Franchise")
        ).length;

        const checkers = users.filter((user: any) =>
          user.roles.includes("Checker")
        ).length;

        const makers = users.filter((user: any) =>
          user.roles.includes("Maker")
        ).length;

        setCounts({
          clients,
          franchises,
          checkers,
          makers,
        });
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching user counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      <UserCard title="Customers" count={counts.clients} loading={loading} />
      <UserCard
        title="Franchises"
        count={counts.franchises}
        loading={loading}
      />
      <UserCard title="Checkers" count={counts.checkers} loading={loading} />
      <UserCard title="Makers" count={counts.makers} loading={loading} />
    </div>
  );
}

function UserCard({
  title,
  count,
  loading,
}: {
  title: string;
  count: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {loading ? "Loading..." : count}
          </h4>
        </div>
      </div>
    </div>
  );
}
