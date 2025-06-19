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

  // Function to handle category click and navigate with category filter
  const handleCategoryClick = (categoryName: string) => {
    const createdStart = dashboardData?.financial_year_start || "2025-04-01";
    const createdEnd = dashboardData?.financial_year_end || "2026-03-31";

    const params = new URLSearchParams({
      created_start: createdStart,
      created_end: createdEnd,
      category: categoryName,
      show_more: "true",
    });

    navigate(`/task-list?${params.toString()}`);
  };
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate("/task-list")}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tasks by Category
        </h3>
        <FolderIcon className="h-5 w-5 text-gray-400" />
      </div>

      {loading ? (
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      ) : Object.keys(categoryCounts).length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">No tasks found.</div>
      ) : (
        <div className="space-y-3">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div
              key={category}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent div click
                handleCategoryClick(category);
              }}
            >
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
