import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHotTaskTemplateDetailsService } from "../../../services/restApi/hotTaskTemplate";

export default function HotViewTaskTemplatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotTemplate, setHotTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          const data = await getHotTaskTemplateDetailsService(id);
          setHotTemplate(data);
        } catch (error) {
          console.error("Error fetching hot task template:", error);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <p>Loading Hot Task Template details...</p>
        </div>
      </div>
    );
  }

  if (!hotTemplate) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        Hot Task Template not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        🔥 Hot Task Template Details
      </h1>

      {/* Basic Info Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Task Template Title
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {hotTemplate.task_template_title || "-"}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Featured Order
            </h3>
            <p className="text-gray-800 dark:text-white">
              {hotTemplate.featured_order || "-"}
            </p>
          </div>
        </div>

        {/* Image */}
        {hotTemplate.image && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-2">
              Image
            </h3>
            <img
              src={hotTemplate.image}
              alt="Task Template"
              className="w-48 h-48 object-cover rounded cursor-pointer"
              onClick={() => setIsPreviewOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Creator Info Section */}
      <div className="mb-8">
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Creator Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Created By
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {hotTemplate.created_by || "-"}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Timestamps
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Created:
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-300">
                  {formatDate(hotTemplate.created_at)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last Updated:
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-300">
                  {formatDate(hotTemplate.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() =>
            navigate(`/manage-hot-task-templates/${hotTemplate.id}`)
          }
          className="px-8 p-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => navigate("/hot-task-list")}
          className="px-8 p-2 border border-1 border-zinc-400 hover:bg-gray-200 rounded-lg"
        >
          Back to List
        </button>
      </div>

      {/* Image Preview Modal */}
      {isPreviewOpen && hotTemplate.image && (
        <div className="fixed inset-0 z-[100000] bg-black bg-opacity-80 flex items-center justify-center">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-5 right-5 text-white text-2xl"
          >
            ✕
          </button>
          <img
            src={hotTemplate.image}
            alt="Task Template"
            className="max-w-full max-h-full object-contain rounded"
          />
        </div>
      )}
    </div>
  );
}
