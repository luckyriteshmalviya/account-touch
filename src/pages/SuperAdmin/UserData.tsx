import { useDashboard } from "../../context/DashboardContext";
import { GroupIcon } from "../../icons";
import { useNavigate } from "react-router-dom";

export default function UserData() {
  const { dashboardData, loading } = useDashboard();
  const navigate = useNavigate();

  const counts = {
    clients: dashboardData?.user_role_counts?.client || 0,
    franchises: dashboardData?.user_role_counts?.franchise || 0,
    checkers: dashboardData?.user_role_counts?.checker || 0,
    makers: dashboardData?.user_role_counts?.maker || 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <UserCard
        title="Customers"
        count={counts.clients}
        loading={loading}
        color="bg-indigo-100"
        onClick={() => navigate("/user-list?role=Client")}
      />
      <UserCard
        title="Franchises"
        count={counts.franchises}
        loading={loading}
        color="bg-pink-100"
        onClick={() => navigate("/user-list?role=Franchise")}
      />
      <UserCard
        title="Checkers"
        count={counts.checkers}
        loading={loading}
        color="bg-yellow-100"
        onClick={() => navigate("/user-list?role=Checker")}
      />
      <UserCard
        title="Makers"
        count={counts.makers}
        loading={loading}
        color="bg-green-100"
        onClick={() => navigate("/user-list?role=Maker")}
      />
    </div>
  );
}

function UserCard({
  title,
  count,
  loading,
  color,
  onClick,
}: {
  title: string;
  count: number;
  loading: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.99]"
    >
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-xl ${color}`}
      >
        <GroupIcon className="text-gray-700 w-6 h-6" />
      </div>

      <div className="mt-5 space-y-2">
        <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
          {title}
        </div>
        <div className="text-3xl font-extrabold text-gray-800">
          {loading ? "..." : count}
        </div>
      </div>
    </div>
  );
}
