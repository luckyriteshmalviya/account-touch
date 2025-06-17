import { useDashboard } from "../../context/DashboardContext";
import { DocsIcon } from "../../icons";

export default function Maker() {
  const { dashboardData, loading } = useDashboard();

  const totalTasks = dashboardData?.total_tasks || 0;
  const processCounts = dashboardData?.process_type_pending_counts || [];
  const dueNextWeek = dashboardData?.tasks_due_next_week || [];

  // Map labels to process types + code
  const activeSubtasks = [
    { label: "Questionnaire In Progress", type: "questionnaire" },
    { label: "Documents Uploaded", type: "documentation" },
    { label: "Awaiting Payment", type: "payment" },
    {
      label: "Preparation In Progress",

      type: "document_preparation",
    },
  ];

  const getProcessCount = (type: string) =>
    processCounts.find(
      (item: any) => item.process_template__process_type === type
    )?.count || 0;

  return (
    <div className="p-6 bg-white min-h-screen space-y-8">
      {/* Top Section: My Tasks and Due Date Info */}
      <div className="flex justify-between items-start w-full max-w-4xl">
        {/* My Tasks Box */}
        <div className="border rounded-lg p-4 shadow w-64">
          <h2 className="text-red-600 font-bold uppercase">MAKER</h2>
          <div className="mt-2 font-semibold text-lg">My Tasks:</div>
          <div className="text-blue-500 text-2xl font-bold mt-1 cursor-pointer">
            {loading ? "..." : totalTasks}
          </div>
        </div>

        {/* Due Date Info */}
        <div className="border mt-10 border-black px-4 py-2 font-medium">
          {loading ? "Loading..." : dueNextWeek.length} tasks due in a week
        </div>
      </div>

      {/* Active Tasks Section */}
      <div className="text-left max-w-2xl">
        <ul className="list-disc ml-5 space-y-2">
          <li className="font-semibold flex items-center gap-2">
            <span className="text-yellow-600 ">
              <DocsIcon />
            </span>
            Active Tasks:
            <span className="bg-gray-200 text-sm px-2 py-1 rounded">
              {loading
                ? "..."
                : processCounts.reduce(
                    (total: number, item: any) => total + item.count,
                    0
                  )}
            </span>
          </li>
          {activeSubtasks.map((task, idx) => (
            <li key={idx} className="flex items-center gap-2 ml-6">
              {task.label}:
              <span className="bg-gray-200 text-sm px-2 py-1 rounded">
                {loading ? "..." : getProcessCount(task.type)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
