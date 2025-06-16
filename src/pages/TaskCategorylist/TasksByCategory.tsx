import { useDashboard } from "../../context/DashboardContext";

export default function TasksByCategory() {
  const { dashboardData, loading } = useDashboard();

  const categoryCounts: { [key: string]: number } = {};

  if (dashboardData?.template_category_counts) {
    dashboardData.template_category_counts.forEach((item: any) => {
      const categoryName = item.template__category__name || "Uncategorized";
      categoryCounts[categoryName] = item.count;
    });
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-2xl">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Number of Tasks by Category
      </h3>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : Object.keys(categoryCounts).length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <ul className="space-y-2">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <li
              key={category}
              className="flex items-center justify-between text-gray-700"
            >
              <span>{category}</span>
              <span className="font-semibold">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
