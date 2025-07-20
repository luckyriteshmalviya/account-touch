import { Search } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import { useNavigate } from "react-router-dom";

export default function ActiveTasksList() {
  const { dashboardData, loading } = useDashboard();
  const navigate = useNavigate();

  const processCounts = dashboardData?.process_type_pending_counts || [];

  const statusFilters: Record<string, string> = {
    questionarrie: "in_progress,pending",
    documentation: "in_progress,pending",
    payment: "in_progress,pending",
    "steps procedure": "in_progress,pending",
    "document preparation": "approved",
    default: "in_progress,pending,waiting_for_approval,approved",
  };

  const handleTaskClick = (processType: string) => {
    const formattedType = processType.replace(/_/g, " ").toLowerCase();
    const status = statusFilters[formattedType] || statusFilters.default;
    navigate(`/task-list?status=${status}`);
  };

  return (
    <div className="border border-gray-200 bg-white p-5 rounded-2xl shadow-lg text-sm text-gray-800 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 font-semibold mb-4">
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100">
          <Search className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-gray-800 text-lg">Active Tasks (All Clients)</h2>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-gray-500">Loading active tasks...</p>
      ) : processCounts.length === 0 ? (
        <p className="text-gray-500">No active tasks found.</p>
      ) : (
        <ul className="space-y-3 mt-2">
          {processCounts.map((item: any, idx: number) => (
            <li
              key={idx}
              onClick={() =>
                handleTaskClick(item.process_template__process_type)
              }
              className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <span className="capitalize text-gray-700">
                {item.process_template__process_type.replace(/_/g, " ")}
              </span>
              <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-semibold shadow">
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
