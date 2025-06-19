import { useDashboard } from "../../context/DashboardContext";
import { CalendarDaysIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TasksDueInWeek() {
  const { dashboardData, loading } = useDashboard();
  const navigate = useNavigate();
  const dueNextWeekCount = dashboardData?.tasks_due_next_week?.length ?? 0;

  const handleCardClick = () => {
    const today = new Date();
    const currentDay = today.getDay();

    // Calculate days until next Monday
    const daysUntilNextMonday = currentDay === 0 ? 1 : 8 - currentDay;

    // Next Monday
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);

    // Next Sunday
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);

    const formatDate = (date: Date): string => {
      return date.toISOString().split("T")[0];
    };

    const dueStart = formatDate(today); // today
    const dueEnd = formatDate(nextSunday); // end of next week
    const createdStart = dashboardData?.financial_year_start || "2025-04-01";
    const createdEnd = dashboardData?.financial_year_end || "2026-03-31";

    const params = new URLSearchParams({
      created_start: createdStart,
      created_end: createdEnd,
      due_start: dueStart,
      due_end: dueEnd,
      status: "pending,started",
      show_more: "true",
    });

    navigate(`/task-list?${params.toString()}`);
  };

  return (
    <div
      className="p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer transform hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-2 mb-4">
        <CalendarDaysIcon className="text-rose-600 w-5 h-5" />
        <h3 className="text-lg font-semibold text-gray-800">
          Tasks Due in Next Week
        </h3>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <p className="text-lg font-bold text-gray-800">
          {dueNextWeekCount}{" "}
          <span className="text-base font-medium text-gray-500">
            task{dueNextWeekCount !== 1 ? "s" : ""} due
          </span>
        </p>
      )}

      {/* Optional: Add a small indicator that this is clickable */}
      <div className="mt-2 text-xs text-gray-400">Click to view tasks →</div>
    </div>
  );
}
