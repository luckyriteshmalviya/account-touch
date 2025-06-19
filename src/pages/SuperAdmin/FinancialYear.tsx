import { useDashboard } from "../../context/DashboardContext";
import { ListIcon, DollarLineIcon } from "../../icons";
import { useNavigate } from "react-router-dom";

export default function DashboardStats() {
  const { dashboardData, loading } = useDashboard();
  const navigate = useNavigate();
  const tasksCreated = dashboardData?.total_tasks || 0;
  const overdueTasks = dashboardData?.overdue_tasks?.length || 0;
  const totalRevenue = 0; // placeholder for future

  // Helper function to get this week's date range
  const getThisWeekDateRange = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Calculate start of week (Monday)
    const startOfWeek = new Date(today);
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // If Sunday, go back 6 days
    startOfWeek.setDate(today.getDate() + mondayOffset);

    // Calculate end of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    return {
      start: formatDate(startOfWeek),
      end: formatDate(endOfWeek),
    };
  };

  // Handle click on overdue tasks
  const handleOverdueTasksClick = () => {
    const { start, end } = getThisWeekDateRange();

    // Navigate to task list with due date filter for this week and show more filters
    navigate(`/task-list?due_start=${start}&due_end=${end}&show_more=true`);
  };

  return (
    <div className="mt-6 w-[75vw] border border-gray-200 rounded-2xl px-6 py-5 bg-white shadow-lg">
      <h4 className="text-lg font-bold text-gray-800 mb-6">
        📊 This Financial Year Summary
      </h4>

      <div className="flex flex-wrap justify-between items-center gap-6 text-sm sm:text-base text-gray-700">
        {/* Tasks Created */}
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl w-full sm:w-auto flex-1 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100">
            <ListIcon className="text-indigo-600 w-5 h-5" />
          </div>
          <div
            onClick={() => navigate("/task-list")}
            className="cursor-pointer"
          >
            <p className="text-xs text-gray-500">Tasks Created</p>
            <h3 className="text-lg font-semibold text-gray-900">
              {loading ? "..." : tasksCreated}
            </h3>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl w-full sm:w-auto flex-1 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100">
            <DollarLineIcon className="text-yellow-600 w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Revenue</p>
            <h3 className="text-lg font-semibold text-gray-900">
              ₹ {loading ? "..." : totalRevenue.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl w-full sm:w-auto flex-1 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100">
            <ListIcon className="text-red-600 w-5 h-5" />
          </div>
          <div onClick={handleOverdueTasksClick} className="cursor-pointer">
            <p className="text-xs text-gray-500">Overdue This Week</p>
            <h3 className="text-lg font-semibold text-gray-900">
              {loading ? "..." : overdueTasks}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
