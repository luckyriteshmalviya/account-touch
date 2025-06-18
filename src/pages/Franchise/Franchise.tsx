import { Dot } from "lucide-react";
import { FileIcon, GroupIcon } from "../../icons";
import TaskCategoryList from "../taskCategorylist/TaskCateroryList";
import { useDashboard } from "../../context/DashboardContext";

export default function Franchise() {
  const { dashboardData, loading } = useDashboard();

  const assignedClients = dashboardData?.assigned_clients || 0;
  const clients = dashboardData?.clients || [];

  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 min-h-screen space-y-10">
      {/* Top Info Cards */}
      <div className="flex flex-wrap gap-6 justify-center ">
        {/* Clients Added by Me */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border hover:scale-[1.01] transition flex-1">
          <div className="flex items-center gap-2 text-gray-700 font-semibold mt-4">
            <Dot className="text-green-600" />
            <GroupIcon />
            Clients Added by Me:
          </div>
          <div className="mt-4 space-y-2 max-h-52 overflow-auto">
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : clients.length === 0 ? (
              <div className="text-gray-500">No clients added</div>
            ) : (
              clients.map((client: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-lg flex items-center gap-2"
                >
                  <Dot className="text-blue-500 w-4 h-4" />
                  {client.name}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Total Tasks Initiated by Clients */}
        <div className="p-6 bg-white rounded-2xl shadow-lg border hover:scale-[1.01] transition flex-1">
          <div className="flex items-center gap-2 text-gray-700 font-semibold mt-4">
            <Dot className="text-green-600" />
            <FileIcon />
            Tasks Initiated by Clients:
          </div>
          <div className="mt-6 text-indigo-600 text-5xl text-center font-extrabold cursor-pointer transition hover:scale-105">
            {loading ? "..." : assignedClients}
          </div>
        </div>
      </div>

      {/* Task Category List */}
      <TaskCategoryList />
    </div>
  );
}
