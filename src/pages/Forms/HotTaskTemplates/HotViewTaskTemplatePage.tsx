import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { getTaskTemplatDetailsService } from "../../../services/restApi/taskTemplate";

export default function HotViewTaskTemplatPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [taskTemplat, setTaskTemplat] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (id) {
        setLoading(true);
        try {
          const data = await getTaskTemplatDetailsService(id);
          setTaskTemplat(data);
        } catch (error) {
          console.error("Error fetching task template:", error);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [id]);

  // Helper function to format dates consistently
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500 text-center">
          <svg
            className="w-10 h-10 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <p>Loading task template details...</p>
        </div>
      </div>
    );
  }

  if (!taskTemplat) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 dark:text-gray-400">
          Task template not found
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Task Template Details
      </h1>

      {/* Basic Info Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Title
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {taskTemplat.title || "-"}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Status
            </h3>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  taskTemplat.is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {taskTemplat.is_active ? "Active" : "Inactive"}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  taskTemplat.is_ready
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {taskTemplat.is_ready ? "Ready" : "Not Ready"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
            Description
          </h3>
          <p className="text-gray-800 dark:text-gray-300">
            {taskTemplat.description || "-"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Category
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {taskTemplat.category?.name || "-"}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Order
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {taskTemplat.order || "-"}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Priority
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {taskTemplat.priority || "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Fees
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {taskTemplat.fees || "-"}
            </p>
          </div>

          {taskTemplat.image && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-2">
                Image
              </h3>
              <img
                src={taskTemplat.image}
                alt={taskTemplat.title}
                className="w-48 h-48 object-cover rounded cursor-pointer"
                onClick={() => setIsPreviewOpen(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Timestamps Section */}
      <div className="mb-8">
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Additional Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Created At
            </h3>
            <p className="text-gray-800 dark:text-gray-300">
              {formatDate(taskTemplat.created_at)}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Updated At
            </h3>
            <p className="text-gray-800 dark:text-gray-300">
              {formatDate(taskTemplat.updated_at)}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/manage-hot-task-templates/${id}`)}
        className="px-8 mt-4 p-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
      >
        Edit
      </button>

      {isPreviewOpen && taskTemplat.image && (
        <div className="fixed inset-0 z-[100000] bg-black bg-opacity-80 flex items-center justify-center">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-5 right-5 text-white text-2xl"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={taskTemplat.image}
            alt={taskTemplat.title || "Full Preview"}
            className="max-w-full max-h-full object-contain rounded"
          />
        </div>
      )}
    </div>
  );
}
