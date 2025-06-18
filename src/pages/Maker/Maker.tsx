import { useDashboard } from "../../context/DashboardContext";
import { DocsIcon } from "../../icons";
import { ClipboardListIcon, ClockIcon } from "lucide-react";

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
    { label: "Preparation In Progress", type: "document_preparation" },
  ];

  const getProcessCount = (type: string) =>
    processCounts.find(
      (item: any) => item.process_template__process_type === type
    )?.count || 0;

  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 min-h-screen space-y-10">
      {/* Top Section */}
      <div className="flex flex-wrap gap-6">
        {/* My Tasks Box */}
        <div className="border rounded-2xl p-6 shadow-md hover:shadow-lg transition bg-white w-72">
          <h2 className="text-rose-600 font-bold uppercase mb-2 flex items-center gap-2">
            <ClipboardListIcon className="w-5 h-5" />
            MAKER
          </h2>
          <div className="font-medium text-gray-700 text-lg mb-2">
            My Tasks:
          </div>
          <div className="text-indigo-600 text-4xl font-bold cursor-pointer transition hover:scale-105">
            {loading ? "..." : totalTasks}
          </div>
        </div>

        {/* Due in Next Week Box */}
        <div className="border rounded-2xl p-6 shadow-md hover:shadow-lg transition bg-white flex-1 min-w-[220px]">
          <div className="flex items-center gap-2 mb-2">
            <ClockIcon className="w-5 h-5 text-yellow-600" />
            <h3 className="text-gray-800 font-semibold text-lg">
              Upcoming Deadlines
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {loading ? "..." : dueNextWeek.length}
            <span className="text-base font-medium text-gray-500 ml-1">
              task{dueNextWeek.length !== 1 ? "s" : ""} in a week
            </span>
          </p>
        </div>
      </div>

      {/* Active Tasks Section */}
      <div className="max-w-3xl">
        <ul className="space-y-4">
          <li className="font-semibold flex items-center gap-3 text-lg text-gray-800">
            <span className="text-yellow-600">
              <DocsIcon />
            </span>
            Active Tasks:
            <span className="bg-yellow-50 text-yellow-600 text-sm font-semibold px-3 py-1 rounded-full ml-2">
              {loading
                ? "..."
                : processCounts.reduce(
                    (total: number, item: any) => total + item.count,
                    0
                  )}
            </span>
          </li>

          {/* Subtask List */}
          {activeSubtasks.map((task, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between text-gray-700 font-medium border-b border-gray-100 pb-2"
            >
              <span>{task.label}</span>
              <span className="bg-indigo-100 text-indigo-600 text-sm font-semibold px-3 py-1 rounded-full">
                {loading ? "..." : getProcessCount(task.type)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
