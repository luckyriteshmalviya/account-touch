import { Search } from "lucide-react";

const tasks = [
  { label: "Questionnaire Pending", value: "AA" },
  { label: "Docs Pending", value: "BB" },
  { label: "Payment Pending", value: "CC" },
  { label: "Preparation Pending", value: "DD" },
  { label: "Completed", value: "EE" },
];

export default function ActiveTasksList() {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm text-sm text-gray-800">
      <div className="flex items-center space-x-2 font-medium mb-2">
        <Search className="w-4 h-4 text-gray-600" />
        <span>Active</span>
        <span className="text-gray-500">tasks (All Clients):</span>
      </div>

      <ul className="space-y-2 ml-5 list-disc">
        {tasks.map((task, idx) => (
          <li key={idx} className="flex items-center">
            <span className="mr-2">{task.label}:</span>
            <span className="ml-1 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-md font-medium shadow-sm">
              {task.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
