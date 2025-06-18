import { useDashboard } from "../../context/DashboardContext";
import { CalendarDaysIcon } from "lucide-react";

export default function TasksDueInWeek() {
  const { dashboardData, loading } = useDashboard();
  const dueNextWeekCount = dashboardData?.tasks_due_next_week?.length ?? 0;

  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition">
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
    </div>
  );
}
