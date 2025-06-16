import { useEffect, useState } from "react";
import { ListIcon, DollarLineIcon } from "../../icons";
import { getDashboardDataService } from "../../services/restApi/dashboard";

export default function DashboardStats() {
  const [tasksCreated, setTasksCreated] = useState(0);
  const [totalRevenue] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardDataService();

        setTasksCreated(data.total_tasks || 0);
        setOverdueTasks(data.tasks_due_next_week || 0);
        // setTotalRevenue(data.total_revenue || 0); // future use
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <div className="mt-6 w-[70vw] border-2 border-blue-400 rounded-lg px-4 pt-3 bg-white dark:bg-gray-900 dark:border-gray-700">
        <h4 className="ml-3 mb-4">In this financial year</h4>

        <div className="flex justify-around items-center gap-16 text-sm sm:text-base text-gray-700 dark:text-white/80">
          {/* Tasks Created */}
          <div className="flex items-center gap-2">
            <ListIcon className="text-gray-700 dark:text-white/80" />
            <span>
              Tasks Created:{" "}
              <strong className="text-gray-900 dark:text-white">
                {loading ? "..." : tasksCreated}
              </strong>
            </span>
          </div>

          {/* Total Revenue */}
          <div className="flex items-center gap-2">
            <DollarLineIcon className="text-yellow-500" />
            <span>
              Total Revenue Collected:{" "}
              <strong className="text-gray-900 dark:text-white">
                ₹ {loading ? "..." : totalRevenue.toLocaleString()}
              </strong>
            </span>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="border-2 border-red-600 w-fit mt-4 ml-10 px-4 py-2 rounded-lg">
          <span className="text-base font-semibold text-gray-800 dark:text-white">
            Overdue Tasks This Week:{" "}
            <strong className="text-gray-900 dark:text-white">
              {loading ? "..." : overdueTasks}
            </strong>
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
        )}
      </div>
    </>
  );
}
