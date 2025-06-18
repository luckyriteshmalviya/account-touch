import { useDashboard } from "../../context/DashboardContext";
import { FolderIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TasksByCategory() {
  const { dashboardData, loading } = useDashboard();
  const navigate = useNavigate();
  const categoryCounts: { [key: string]: number } = {};

  if (dashboardData?.template_category_counts) {
    dashboardData.template_category_counts.forEach((item: any) => {
      const categoryName = item.template__category__name || "Uncategorized";
      categoryCounts[categoryName] = item.count;
    });
  }

  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition">
      <div
        className="flex items-center gap-2 mb-4"
        onClick={() => navigate("/task-list")}
      >
        <FolderIcon className="text-indigo-600 w-5 h-5" />
        <h3 className="text-lg font-semibold text-gray-800">
          Tasks by Category
        </h3>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : Object.keys(categoryCounts).length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <ul className="space-y-3">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <li
              key={category}
              className="flex items-center justify-between text-gray-700 font-medium"
            >
              <span>{category}</span>
              <span className="bg-indigo-100 text-indigo-600 text-sm font-semibold px-3 py-1 rounded-full">
                {count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
