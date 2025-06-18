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

  const subtaskList = [
    { label: "Awaiting Questionnaire Review", code: "questionnaire" },
    { label: "Awaiting Document Review", code: "documentation" },
    { label: "Awaiting Payment Confirmation", code: "payment" },
    { label: "Awaiting Final Document Approval", code: "document_preparation" },
  ];

  const getProcessCount = (type: string) =>
    processCounts.find(
      (item: any) => item.process_template__process_type === type
    )?.count || 0;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen space-y-12">
      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Makers Under Me */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border hover:scale-[1.01] transition">
          <h2 className="text-sm uppercase font-bold text-red-600 tracking-wide">
            Checker Overview
          </h2>
          <div className="flex items-center gap-2 text-gray-700 font-semibold mt-4">
            <Dot className="text-green-600" />
            <GroupIcon />
            Makers Under me:
          </div>
          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : makers.length === 0 ? (
              <div className="text-gray-500">No makers assigned</div>
            ) : (
              makers.map((maker: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-lg flex items-center gap-2"
                >
                  <Dot className="text-blue-500 w-4 h-4" />
                  {maker.name}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Total Tasks Under Me */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border hover:scale-[1.01] transition">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <DotIcon />
            Total Tasks under Me:
          </div>
          <div className="mt-4 text-blue-600 text-4xl font-extrabold text-center">
            {loading ? "..." : totalTasks}
          </div>
        </div>
      </div>

      {/* Subtasks & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Subtasks */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border">
          <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <HammerIcon className="text-indigo-500" /> Subtasks in My Queue
          </h3>
          <ul className="space-y-3">
            {subtaskList.map((task, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-700">{task.label}</span>
                <span className="bg-indigo-100 text-indigo-600 text-sm font-medium px-3 py-1 rounded-full">
                  {loading ? "..." : getProcessCount(task.code)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions Required */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border">
          <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <AlertIcon className="text-red-500" /> Actions Required
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center border-b pb-2">
              Payments to confirm
              <span className="bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-full">
                {loading ? "..." : getProcessCount("payment")}
              </span>
            </li>
            <li className="flex justify-between items-center border-b pb-2">
              Overdue Tasks
              <span className="bg-red-100 text-red-600 text-sm font-medium px-3 py-1 rounded-full">
                {loading ? "..." : overdueTasks.length}
              </span>
            </li>
            <li className="flex justify-between items-center">
              Tasks Due Next Week
              <span className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
                {loading ? "..." : dueNextWeek.length}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Task Category List */}
      <TaskCategoryList />
    </div>
  );
}
