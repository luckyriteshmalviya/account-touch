import { useEffect, useState } from "react";
import { Dot, DotIcon, HammerIcon } from "lucide-react";
import { AlertIcon, GroupIcon } from "../../icons";
import TaskCategoryList from "../TaskCategorylist/TaskCateroryList";
import { getMakerListService } from "../../services/restApi/user";

export default function Checker() {
  const [makers, setMakers] = useState([]);

  useEffect(() => {
    const fetchMakers = async () => {
      const res = await getMakerListService();
      setMakers(res);
    };

    fetchMakers();
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen space-y-8">
      {/* Top Row */}
      <div className="flex justify-around gap-8">
        {/* A: Makers Under Me */}
        <div className="w-64 border rounded-lg p-4 shadow">
          <h2 className="text-red-600 font-bold uppercase">CHECKER</h2>
          <div className="flex items-center gap-2 font-semibold mt-2">
            <Dot /> <GroupIcon />
            Makers Under me:
          </div>
          <div className="mt-2 text-blue-500 text-2xl font-bold">
            {makers.length}
          </div>
          <div className="mt-2 flex justify-center">
            <div className="border border-blue-500 rounded-full px-6 py-1 cursor-pointer text-sm font-medium">
              List of Makers
            </div>
          </div>
        </div>

        {/* B: Total Tasks Under Me */}
        <div className="w-64 border rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 font-semibold mt-6">
            <DotIcon />
            Total Tasks under Me:
          </div>
          <div className="mt-2 text-blue-500 text-2xl font-bold cursor-pointer">
            {/* yaha bhi count laga sakte ho */}
          </div>
        </div>
      </div>

      {/* Middle Section */}
      {/* ... baaki same code ... */}

      {/* Bottom Row */}
      <TaskCategoryList />
    </div>
  );
}
