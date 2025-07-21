import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../context/DashboardContext";
import { ListIcon } from "../../icons";
import { useRef } from "react";

export default function TasksByStatus() {
  const { dashboardData, loading } = useDashboard();
  const navigate = useNavigate();
  const chartRef = useRef<any>(null); // Chart ref

  const categories = [
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in_progress" },
    { label: "Approval wait", value: "waiting_for_approval" },
    { label: "Completed", value: "completed" },
    { label: "Rejected", value: "rejected" },
  ];

  const taskStatusCounts = categories.map(({ value }) => {
    const match = dashboardData?.task_status_counts?.find(
      (item: any) => item.status.toLowerCase() === value
    );
    return match ? match.count : 0;
  });

  const options: ApexOptions = {
    chart: {
      type: "bar",
      events: {
        dataPointSelection: (_event, _chartContext, config) => {
          const clickedIndex = config.dataPointIndex;
          if (clickedIndex >= 0) {
            const clickedStatus = categories[clickedIndex].value;
            navigate(`/task-list?status=${clickedStatus}`);
          }
        },
      },
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#3b82f6", "#facc15", "#a855f7", "#10b981", "#ef4444"],
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
      categories: categories.map(({ label }) => label),
      labels: { style: { fontSize: "11px", fontWeight: 600, colors: "#555" } },
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
    tooltip: {
      x: {
        formatter: (_, opts) =>
          categories[opts.dataPointIndex].value
            .replace(/_/g, " ")
            .toUpperCase(),
      },
      y: {
        formatter: (val: number) => `${Math.max(val, 0)}`,
      },
    },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    legend: { show: false },
  };

  const series = [
    {
      name: "Tasks",
      data: loading
        ? Array(categories.length).fill(0)
        : taskStatusCounts.map((count) => Math.max(count, 0)),
    },
  ];

  return (
    <div className="cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 px-6 pt-5 pb-6 shadow-lg transition-all duration-500 hover:shadow-xl active:scale-[0.98]">
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex items-center gap-3"
          onClick={() => navigate("/task-list")}
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
            <ListIcon className="text-blue-600 w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Tasks by Status
          </h3>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[450px] xl:min-w-full pl-2">
          <Chart
            ref={chartRef}
            options={options}
            series={series}
            type="bar"
            height={200}
          />
        </div>
      </div>
    </div>
  );
}
