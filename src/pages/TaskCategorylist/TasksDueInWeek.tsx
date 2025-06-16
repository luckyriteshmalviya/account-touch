import { useDashboard } from "../../context/DashboardContext";

export default function TasksDueInWeek() {
  const { dashboardData, loading } = useDashboard();
  const dueNextWeek = dashboardData?.tasks_due_next_week ?? 0;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-2xl">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Tasks Due in Next Week
      </h3>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <p className="text-gray-700 text-xl font-bold">
          {dueNextWeek} task{dueNextWeek !== 1 ? "s" : ""} due
        </p>
      )}
    </div>
  );
}
