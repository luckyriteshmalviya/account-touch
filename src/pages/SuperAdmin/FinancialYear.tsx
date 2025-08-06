import { useDashboard } from "../../context/DashboardContext";
import { ListIcon, DollarLineIcon } from "../../icons";
import { useNavigate } from "react-router-dom";

export default function DashboardStats() {
  const { dashboardData, loading } = useDashboard();
  const navigate = useNavigate();

  const tasksCreated = dashboardData?.total_tasks || 0;
  const overdueTasks = dashboardData?.overdue_tasks?.length || 0;
  const totalRevenue = dashboardData?.total_fees_collected || 0;

  // Get financial year dates from dashboard data
  const financialYearStart =
    dashboardData?.financial_year_start || "2025-04-01";
  const financialYearEnd = dashboardData?.financial_year_end || "2026-03-31";

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Handle click on total tasks
  const handleTotalTasksClick = () => {
    // Navigate with financial year date range filter
    const params = new URLSearchParams({
      created_start: financialYearStart,
      created_end: financialYearEnd,
      show_more: "true",
    });

    navigate(`/task-list?${params.toString()}`);
  };

  // Handle click on overdue tasks
  const handleOverdueTasksClick = () => {
    const today = getTodayDate();

    // Navigate with filters for overdue tasks:
    // - Created within financial year
    // - Due date less than today
    // - Status is pending or started (in_progress)
    const params = new URLSearchParams({
      created_start: financialYearStart,
      created_end: financialYearEnd,
      due_end: today, // Tasks due before today (overdue)
      status: "pending,started", // Pending and started tasks
      show_more: "true",
    });

    navigate(`/task-list?${params.toString()}`);
  };

  return (
    <div className="mt-6  border border-gray-200 rounded-2xl px-6 py-5 bg-white shadow-lg">
      <h4 className="text-lg font-bold text-gray-800 mb-6">
        📊 This Financial Year Summary
      </h4>

      <div className="flex flex-wrap justify-between items-center gap-6 text-sm sm:text-base text-gray-700">
        {/* Tasks Created */}
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl w-full sm:w-auto flex-1 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100">
            <ListIcon className="text-indigo-600 w-5 h-5" />
          </div>
          <div onClick={handleTotalTasksClick} className="cursor-pointer">
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
            <p className="text-xs text-gray-500">Overdue Tasks</p>
            <h3 className="text-lg font-semibold text-gray-900">
              {loading ? "..." : overdueTasks}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
