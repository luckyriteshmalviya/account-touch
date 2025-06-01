import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskDetailsService } from "../../../services/restApi/task";

// Format date helper function
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export default function ViewTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await getTaskDetailsService(id);
          if (data) {
            setTask(data);
          } else {
            setError("Failed to load task details");
          }
        } catch (err) {
          console.error("Error fetching task details:", err);
          setError("An error occurred while loading task details");
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [id]);

  const handleStartWorkflow = () => {
    navigate(`/tasks/steps/${id}`);
  };

  if (loading) {
    return <p className="text-gray-500 text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!task) {
    return <p className="text-gray-500 text-center mt-10">No task found</p>;
  }

  // Filter and sort processes
  const processes = task.processes
    ? [...task.processes].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">Task Details</h1>

      {/* Task Details */}
      <div className="mb-8">
        <div className="overflow-x-auto">
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Client
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  {task?.client?.full_name || "-"}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Maker
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  {task?.maker?.full_name || "-"}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Checker
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  {task?.checker?.full_name || "-"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Title
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  {task.title || "-"}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Category
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  {task.category?.name || "-"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                Description
              </h3>
              <p className="text-gray-800 dark:text-gray-300">
                {task.description || "-"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Priority & Order
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Priority: {task.priority || "-"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Order: {task.order || "-"}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Fees
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  {task.fees ? `₹${task.fees}` : "-"}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Due Date
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(task.due_date)}
                </p>
              </div>
            </div>

            {/* {task.image && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-2">Image</h3>
            <img
              src={task.image}
              alt="Task Template"
              className="w-32 h-32 object-cover rounded cursor-pointer"
              onClick={() => setIsPreviewOpen(true)}
            />
          </div>
        )} */}

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Created At
                </h3>
                <p className="text-gray-800 dark:text-gray-300">
                  {formatDate(task.created_by?.created_at || task.created_at)}
                </p>
              </div>

               <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">Updated At</h3>
            <p className="text-gray-800 dark:text-gray-300">
              {formatDate(task.created_by?.updated_at || task.updated_at)}
            </p>
          </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Process Steps Summary */}
      {processes.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Process Steps</h2>
            <button
              onClick={handleStartWorkflow}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {processes.some(
                (process) =>
                  process.status === "completed" ||
                  process.questionnaire_submission ||
                  (process.uploaded_documents &&
                    process.uploaded_documents.length > 0)
              )
                ? "Complete the Task"
                : "Start Task Workflow"}
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {processes.map((process, index) => (
                <li
                  key={process.id}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <span className="mr-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium">
                      {index + 1}
                    </span>
                    <button
                      onClick={() =>
                        navigate(`/tasks/steps/${id}?step=${index}`)
                      }
                      className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 underline"
                    >
                      {process.process_template_name || `Step ${index + 1}`}
                    </button>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      process.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : process.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : process.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {process.status ? process.status.replace("_", " ") : "-"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate(`/manage-task/${id}`)}
        className="px-8 mt-4 p-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
      >
        Edit
      </button>
    </div>
  );
}
