import { Search } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";

export default function ActiveTasksList() {
  const { dashboardData, loading } = useDashboard();

  const processCounts = dashboardData?.process_type_pending_counts || [];

  return (
    <div className="bg-white p-4 rounded-md shadow-sm text-sm text-gray-800">
      <div className="flex items-center space-x-2 font-medium mb-2">
        <Search className="w-4 h-4 text-gray-600" />
        <span>Active</span>
        <span className="text-gray-500">tasks (All Clients):</span>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <ul className="space-y-2 ml-5 list-disc">
          {processCounts.map((item: any, idx: number) => (
            <li key={idx} className="flex items-center">
              <span className="mr-2 capitalize">
                {item.process_template__process_type.replace(/_/g, " ")}:
              </span>
              <span className="ml-1 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-md font-medium shadow-sm">
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
