import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { getTaskTemplatDetailsService } from "../../../services/restApi/taskTemplate";

export default function ViewTaskTemplatPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [taskTemplat, setTaskTemplat] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [expandedProcess, setExpandedProcess] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const data = await getTaskTemplatDetailsService(id);
        setTaskTemplat(data);
      }
    })();
  }, [id]);

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

  const toggleProcessExpansion = (processId: string) => {
    setExpandedProcess((prev) => (prev === processId ? null : processId));
  };

  if (!taskTemplat) {
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
              Category
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {taskTemplat.category?.name || "-"}
            </p>
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
              Status
            </h3>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  taskTemplat.is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {taskTemplat.is_active ? "Active" : "Inactive"}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  taskTemplat.is_ready
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {taskTemplat.is_ready ? "Ready" : "Not Ready"}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Priority & Order
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Priority: {taskTemplat.priority || "-"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Order: {taskTemplat.order || "-"}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Fees
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {taskTemplat.fees ? `₹${taskTemplat.fees}` : "-"}
            </p>
          </div>
        </div>

        {taskTemplat.image && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-2">
              Image
            </h3>
            <img
              src={taskTemplat.image}
              alt="Task Template"
              className="w-32 h-32 object-cover rounded cursor-pointer"
              onClick={() => setIsPreviewOpen(true)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Created At
            </h3>
            <p className="text-gray-800 dark:text-gray-300">
              {formatDate(
                taskTemplat.created_by?.created_at || taskTemplat.created_at
              )}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Updated At
            </h3>
            <p className="text-gray-800 dark:text-gray-300">
              {formatDate(
                taskTemplat.created_by?.updated_at || taskTemplat.updated_at
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Process Templates Section */}
      <div className="mb-8">
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Process Templates
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {taskTemplat.process_templates?.length || 0} process templates in
            this task
          </p>
        </div>

        {taskTemplat?.process_templates &&
        taskTemplat.process_templates.length > 0 ? (
          <div className="space-y-4">
            {taskTemplat.process_templates.map(
              (process: any, index: number) => (
                <div
                  key={process.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <div
                    className="bg-gray-50 dark:bg-gray-800 p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleProcessExpansion(process.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {process.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          Type: {process.process_type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {expandedProcess === process.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {expandedProcess === process.id && (
                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                      {process.description && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {process.description}
                          </p>
                        </div>
                      )}

                      {process.process_type === "questionnaire" &&
                        process.questionnaire && (
                          <div className="mb-4">
                            {/* <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Questionnaire</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{process.questionnaire.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {process.questionnaire.questions?.length || 0} questions
                          </p>
                        </div> */}

                            {process.questionnaire.questions &&
                              process.questionnaire.questions.length > 0 && (
                                <div className="space-y-3 mt-3">
                                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Questions:
                                  </h5>
                                  {process.questionnaire.questions.map(
                                    (question: any, qIndex: number) => (
                                      <div
                                        key={question.id}
                                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                                      >
                                        <div className="flex items-start gap-2">
                                          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-medium">
                                              {qIndex + 1}
                                            </span>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-900 dark:text-white">
                                              {question.text}
                                            </p>
                                            {question.choices &&
                                              question.choices.length > 0 && (
                                                <div className="mt-2 pl-1">
                                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    Choices:
                                                  </p>
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                                    {question.choices.map(
                                                      (
                                                        choice: any,
                                                        cIndex: number
                                                      ) => (
                                                        <div
                                                          key={cIndex}
                                                          className="flex items-center gap-1"
                                                        >
                                                          <span className="w-4 h-4 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                                                            {cIndex + 1}
                                                          </span>
                                                          <span className="text-xs text-gray-600 dark:text-gray-300">
                                                            {choice.text}
                                                          </span>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        )}

                      {(process.process_type === "documentation" ||
                        process.process_type === "document_preparation") &&
                        process.required_documents &&
                        process.required_documents.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Required Documents
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {process.required_documents.map((doc: any) => (
                                <div
                                  key={doc.id}
                                  className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg"
                                >
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {doc.name}
                                  </p>
                                  {doc.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {doc.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {process.process_type === "payment" && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Payment Process
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              This is a payment process template.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Created by: {process.created_by?.full_name || "-"}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No process templates assigned
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate(`/manage-task-templates/${id}`)}
        className="px-8 mt-4 p-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
      >
        Edit
      </button>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100000] bg-black bg-opacity-80 flex items-center justify-center">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-5 right-5 text-white text-2xl"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={taskTemplat.image}
            alt="Full Preview"
            className="max-w-full max-h-full object-contain rounded"
          />
        </div>
      )}
    </div>
  );
}
