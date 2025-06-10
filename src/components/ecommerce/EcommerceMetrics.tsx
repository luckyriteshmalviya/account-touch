import { useEffect, useState } from "react";
import {
  // ArrowDownIcon,
  // ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
// import Badge from "../ui/badge/Badge";
import { getUserListService } from "../../services/restApi/user";
import { getTaskListService } from "../../services/restApi/task"; // or wherever this file is

export default function EcommerceMetrics() {
  const [userCount, setUserCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const params: any = {
          role: "client",
        };

        // Fetch users and tasks in parallel
        const [userData, taskData] = await Promise.all([
          getUserListService(params),
          getTaskListService({ page_size: 1 }), // only need the count
        ]);

        setUserCount(userData.count || 0);
        setTaskCount(taskData.count || 0);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching metrics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Customers */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "Loading..." : userCount}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>

      {/* Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Tasks
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "Loading..." : taskCount}
            </h4>
          </div>
          {/* <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge> */}
        </div>
      </div>
    </div>
  );
}
