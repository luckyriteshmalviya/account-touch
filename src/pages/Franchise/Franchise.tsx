import { Dot } from "lucide-react";
import { FileIcon, GroupIcon } from "../../icons";
import TaskCategoryList from "../TaskCategorylist/TaskCateroryList";

export default function Franchise() {
  return (
    <div className="p-6 bg-white min-h-screen space-y-8">
      <div className="flex justify-evenly gap-8">
        {/*  Clients Added by Me */}
        <div className="w-fit border rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 font-semibold">
            <Dot />
            <GroupIcon />
            Clients Added by Me:
          </div>
          <div className="mt-2 text-blue-500 text-center cursor-pointer">
            list of clients
          </div>
        </div>

        {/*  Total Tasks Initiated by Clients */}
        <div className="w-fit border rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 font-semibold">
            <Dot />
            <FileIcon />
            Total Tasks Initiated by Clients:
          </div>
          <div className="mt-2 text-blue-500 text-2xl font-bold cursor-pointer">
            {}
          </div>
        </div>
      </div>
      <TaskCategoryList />
    </div>
  );
}
