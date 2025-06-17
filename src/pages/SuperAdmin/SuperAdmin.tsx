import ActiveTasksList from "./ActiveTasks";
import DashboardStats from "./FinancialYear";

import TasksByStatus from "./TasksByStatus";

import UserData from "./UserData";
import TaskCategoryList from "../taskCategorylist/TaskCateroryList";

export default function SuperAdmin() {
  return (
    <div className="space-y-6 px-4 py-6">
      {/* Row 1 - Customers, Franchise, Checkers, Makers */}
      <UserData />

      {/* Row 2 - Financial Year Stats */}
      <DashboardStats />

      {/* Row 3 - Chart & Active Tasks side by side */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/5">
          <TasksByStatus />
        </div>
        <div className="w-full md:w-2/5 ">
          <ActiveTasksList />
        </div>
      </div>

      {/* Row 4 - Tasks by category & Due this week */}
      <TaskCategoryList />
    </div>
  );
}
