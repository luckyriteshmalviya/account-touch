import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskDetailsService } from "../../../services/restApi/task";

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
  const processes = task.processes ? [...task.processes].sort((a, b) => a.order - b.order) : [];

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">Task: {task.title || task.name}</h1>

      {/* Task Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Task Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-left">
              {/* ID */}
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">ID</td>
                <td className="px-6 py-4 text-gray-900 dark:text-white">{task.id}</td>
              </tr>

              {/* Name */}
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Name</td>
                <td className="px-6 py-4 text-gray-900 dark:text-white">{task.title || task.name || "-"}</td>
              </tr>

              {/* Description */}
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Description</td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-300">{task.description || "-"}</td>
              </tr>

              {/* Due Date */}
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Due Date</td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}
                </td>
              </tr>

              {/* Status */}
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Status</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status ? task.status.replace('_', ' ') : '-'}
                  </span>
                </td>
              </tr>

              {/* Other task details as needed */}
            </tbody>
          </table>
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
              {processes.some(process => 
                process.status === 'completed' || 
                process.questionnaire_submission || 
                (process.uploaded_documents && process.uploaded_documents.length > 0)
              ) 
                ? "Complete the Task" 
                : "Start Task Workflow"}
            </button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {processes.map((process, index) => (
                <li key={process.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="mr-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium">
                      {index + 1}
                    </span>
                    <button 
                      onClick={() => navigate(`/tasks/steps/${id}?step=${index}`)}
                      className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 underline"
                    >
                      {process.process_template_name || `Step ${index + 1}`}
                    </button>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    process.status === 'completed' ? 'bg-green-100 text-green-800' :
                    process.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    process.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {process.status ? process.status.replace('_', ' ') : '-'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}