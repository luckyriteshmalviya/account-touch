import { Dot } from "lucide-react";
import { FileIcon, GroupIcon } from "../../icons";
import TaskCategoryList from "../taskCategorylist/TaskCateroryList";
import { useDashboard } from "../../context/DashboardContext";

export default function Franchise() {
  const { dashboardData, loading } = useDashboard();

  const assignedClients = dashboardData?.assigned_clients || 0;
  const clients = dashboardData?.clients || [];

  return (
    <div className="p-6 bg-white min-h-screen space-y-8">
      <div className="flex justify-evenly gap-8">
        {/* Clients Added by Me */}
        <div className="w-fit border rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 font-semibold">
            <Dot />
            <GroupIcon />
            Clients Added by Me:
          </div>

          {/* Client Names */}
          <ul className="mt-2 list-disc list-inside text-gray-700 text-center text-sm space-y-1">
            {loading ? (
              <li>Loading...</li>
            ) : clients.length > 0 ? (
              clients.map((client: any) => (
                <li key={client.id}>{client.name}</li>
              ))
            ) : (
              <li>No clients added</li>
            )}
          </ul>
        </div>

        {/* Total Tasks Initiated by Clients */}
        <div className="w-fit border rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 font-semibold">
            <Dot />
            <FileIcon />
            Total Tasks Initiated by Clients:
          </div>
          <div className="mt-2 text-blue-500 text-2xl text-center font-bold cursor-pointer">
            {loading ? "..." : assignedClients}
          </div>
        </div>
      </div>

      <TaskCategoryList />
    </div>
  );
}
