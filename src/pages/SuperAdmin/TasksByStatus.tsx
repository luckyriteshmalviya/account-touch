import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router-dom";
import { ListIcon } from "../../icons";
import { useDashboard } from "../../context/DashboardContext";

export default function TasksByStatus() {
  const { dashboardData, loading } = useDashboard();
  const navigate = useNavigate();

  const categories = ["PENDING", "IN_PROGRESS", "COMPLETED", "REJECTED"];

  const taskStatusCounts = categories.map((status) => {
    const countObj = dashboardData?.task_status_counts?.find(
      (item: any) => item.status.toUpperCase() === status
    );
    return countObj ? countObj.count : 0;
  });

  const options: ApexOptions = {
    colors: ["#3b82f6", "#facc15", "#10b981", "#ef4444"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 200,
      toolbar: { show: false },
      events: {
        dataPointSelection: function (config) {
          const clickedIndex = config.dataPointIndex;
          if (clickedIndex >= 0) {
            const clickedStatus = categories[clickedIndex].toLowerCase();
            navigate(`/task-list?status=${clickedStatus}`);
          }
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "18%",
        borderRadius: 8,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 3, colors: ["transparent"] },
    xaxis: {
      categories,
      labels: { style: { fontWeight: 600, colors: "#555" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: Math.max(...taskStatusCounts, 1) + 5,
      tickAmount: 4,
      labels: {
        style: { fontWeight: 500 },
        offsetX: -4,
        formatter: (val: number) =>
          val >= 0 ? Math.floor(val).toString() : "",
      },
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: { formatter: (val: number) => `${Math.max(val, 0)}` },
    },
    legend: { show: false },
  };

  const series = [
    {
      name: "Tasks",
      data: loading
        ? [0, 0, 0, 0]
        : taskStatusCounts.map((count) => Math.max(count, 0)),
    },
  ];

  return (
    <div className="cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 px-6 pt-5 pb-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-lg transition-all duration-500 hover:shadow-xl active:scale-[0.98]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex items-center gap-3"
          onClick={() => navigate("/task-list")}
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
            <ListIcon className="text-blue-600 w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Tasks by Status
          </h3>
        </div>
      </div>

      {/* Chart */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[450px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={200} />
        </div>
      </div>
    </div>
  );
}
