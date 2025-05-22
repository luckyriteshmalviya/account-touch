import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTaskTemplatDetailsService } from "../../../services/restApi/taskTemplate";

export default function ViewTaskTemplatPage() {
  const { id } = useParams();
  const [taskTemplat, setTaskTemplat] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const data = await getTaskTemplatDetailsService(id);
        setTaskTemplat(data);
      }
    })();
  }, [id]);

  if (!taskTemplat) {
    return <p className="text-gray-500 text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">Task Template Details</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-left">
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">ID</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{taskTemplat.id}</td>
            </tr>

            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Title</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{taskTemplat.title || "-"}</td>
            </tr>

            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Description</td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">{taskTemplat.description || "-"}</td>
            </tr>

            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Category</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{taskTemplat.category?.name || "-"}</td>
            </tr>

            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Image</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {taskTemplat.image ? (
                  <img src={taskTemplat.image} alt="Task Template" className="w-20 h-20 object-cover rounded" />
                ) : (
                  "-"
                )}
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Is Active</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{taskTemplat.is_active ? "✅" : "❌"}</td>
            </tr>

            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Is Ready</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{taskTemplat.is_ready ? "✅" : "❌"}</td>
            </tr>

            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Order</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{taskTemplat.order}</td>
            </tr>

            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Priority</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{taskTemplat.priority}</td>
            </tr>

            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Fees</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{taskTemplat.fees}</td>
            </tr>

            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Created At</td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {new Date(taskTemplat.created_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })}
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Updated At</td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {new Date(taskTemplat.updated_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
