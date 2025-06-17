import { Dot, DotIcon, HammerIcon } from "lucide-react";
import { AlertIcon, GroupIcon } from "../../icons";
import { useDashboard } from "../../context/DashboardContext";
import TaskCategoryList from "../taskCategorylist/TaskCateroryList";

export default function Checker() {
  const { dashboardData, loading } = useDashboard();

  const makers = dashboardData?.assigned_makers || [];
  const totalTasks = dashboardData?.total_tasks || 0;
  const processCounts = dashboardData?.process_type_pending_counts || [];
  const overdueTasks = dashboardData?.tasks_overdue || [];
  const dueNextWeek = dashboardData?.tasks_due_next_week || [];

  // Mapping process type to label & code
  const subtaskList = [
    {
      label: "Awaiting Questionnaire Review",
      code: "questionnaire",
    },
    { label: "Awaiting Document Review", code: "documentation" },
    { label: "Awaiting Payment Confirmation", code: "payment" },
    {
      label: "Awaiting Final Document Approval",
      code: "document_preparation",
    },
  ];

  const getProcessCount = (type: string) =>
    processCounts.find(
      (item: any) => item.process_template__process_type === type
    )?.count || 0;

  return (
    <div className="p-6 bg-white min-h-screen space-y-8">
      {/* Top Row */}
      <div className="flex justify-around gap-8">
        {/* A: Makers Under Me */}
        <div className="w-72 border rounded-lg p-4 shadow">
          <h2 className="text-red-600 font-bold uppercase">CHECKER</h2>
          <div className="flex items-center gap-2 font-semibold mt-2">
            <Dot /> <GroupIcon />
            Makers Under me:
          </div>
          <div className="mt-2 text-blue-500 text-2xl font-bold">
            {loading ? "..." : makers.length}
          </div>
        </div>

        {/* B: Total Tasks Under Me */}
        <div className="w-72 border rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 font-semibold mt-6">
            <DotIcon />
            Total Tasks under Me:
          </div>
          <div className="mt-2 text-blue-500 text-2xl font-bold">
            {loading ? "..." : totalTasks}
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex justify-around gap-12">
        {/* C: Subtasks in My Queue */}
        <div>
          <ul className="list-disc ml-5 space-y-2">
            <li className="font-semibold flex items-center gap-2">
              <HammerIcon /> Subtasks in My Queue:
            </li>
            {subtaskList.map((task, idx) => (
              <li key={idx} className="flex items-center gap-2 ml-6">
                {task.label}:
                <span className="bg-gray-200 text-sm px-2 py-1 rounded">
                  {loading ? "..." : getProcessCount(task.code)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* D: Actions Required */}
        <div>
          <ul className="list-disc ml-5 space-y-2">
            <li className="font-semibold flex items-center gap-2">
              <AlertIcon />
              Actions Required:
            </li>
            <li className="ml-6">
              {loading ? "..." : getProcessCount("payment")} Payments to confirm
            </li>
            <span className="ml-6 mt-2 border border-red-500 text-red-600 w-fit px-3 py-1 text-sm">
              {loading ? "..." : overdueTasks.length} Overdue Tasks
            </span>
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <TaskCategoryList />
    </div>
  );
}
