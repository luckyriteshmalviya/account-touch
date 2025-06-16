import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { getDashboardDataService } from "../../services/restApi/dashboard";

export default function TasksByStatus() {
  const [taskStatusCounts, setTaskStatusCounts] = useState<number[]>([
    0, 0, 0, 0,
  ]);
  const [loading, setLoading] = useState(true);

  const categories = ["PENDING", "IN_PROGRESS", "COMPLETED", "REJECTED"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardDataService();

        const countsMap = data.task_status_counts.reduce(
          (
            acc: Record<string, number>,
            item: { status: string; count: number }
          ) => {
            acc[item.status.toUpperCase()] = item.count;
            return acc;
          },
          {}
        );

        // Map counts in fixed order of categories
        const countsArray = categories.map((status) => countsMap[status] || 0);
        setTaskStatusCounts(countsArray);
      } catch (err) {
        console.error("Error fetching task status data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 200,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "15%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: ["#FF0000", "#FF0000", "#FF0000", "#FF0000"],
          fontWeight: 600,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      max: Math.max(...taskStatusCounts) + 5 || 100,
      tickAmount: 4,
      labels: {
        style: { fontWeight: 500 },
        offsetX: -4,
      },
    },
    grid: {
      yaxis: {
        lines: { show: true },
      },
    },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
    legend: { show: false },
  };

  const series = [
    {
      name: "Tasks",
      data: loading ? [0, 0, 0, 0] : taskStatusCounts,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Tasks by Status
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[450px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
