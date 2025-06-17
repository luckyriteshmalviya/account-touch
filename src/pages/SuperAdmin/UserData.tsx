import { useDashboard } from "../../context/DashboardContext";
import { GroupIcon } from "../../icons";

export default function UserData() {
  const { dashboardData, loading } = useDashboard();

  const counts = {
    clients: dashboardData?.user_role_counts?.client || 0,
    franchises: dashboardData?.user_role_counts?.franchise || 0,
    checkers: dashboardData?.user_role_counts?.checker || 0,
    makers: dashboardData?.user_role_counts?.maker || 0,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      <UserCard title="Customers" count={counts.clients} loading={loading} />
      <UserCard
        title="Franchises"
        count={counts.franchises}
        loading={loading}
      />
      <UserCard title="Checkers" count={counts.checkers} loading={loading} />
      <UserCard title="Makers" count={counts.makers} loading={loading} />
    </div>
  );
}

function UserCard({
  title,
  count,
  loading,
}: {
  title: string;
  count: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {loading ? "Loading..." : count}
          </h4>
        </div>
      </div>
    </div>
  );
}
