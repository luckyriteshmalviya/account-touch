import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProcessTemplatDetailsService } from "../../../services/restApi/processTemplate";

export default function ViewProcessTemplatPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [processTemplat, setProcessTemplat] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const data = await getProcessTemplatDetailsService(id);
        setProcessTemplat(data);
      }
    })();
  }, [id]);

  if (!processTemplat) {
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
          <p>Loading process template details...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Process Template Details
      </h1>

      {/* Basic Info Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Title
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {processTemplat?.title || "-"}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Process Type
            </h3>
            <p className="text-gray-900 dark:text-white font-medium capitalize">
              {processTemplat?.process_type || "-"}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
            Description
          </h3>
          <p className="text-gray-800 dark:text-gray-300">
            {processTemplat?.description || "-"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Created By
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {processTemplat?.created_by?.full_name || "-"}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Created At
            </h3>
            <p className="text-gray-800 dark:text-gray-300">
              {formatDate(
                processTemplat?.created_by?.created_at ||
                  processTemplat?.created_at
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Questionnaire Section */}
      {processTemplat?.process_type === "questionnaire" &&
        processTemplat?.questionnaire && (
          <div className="mb-8">
            <div className="border-l-4 border-blue-500 pl-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {processTemplat.questionnaire.description ||
                  "No description provided"}
              </p>
            </div>

            <div className="space-y-6">
              {processTemplat.questionnaire.questions?.map(
                (question: any, index: number) => (
                  <div
                    key={question.id || index}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                          {question.text}
                        </h3>
                        {question.description && (
                          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                            {question.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2 items-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              question.is_required
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {question.is_required ? "Required" : "Optional"}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 capitalize">
                            {question.question_type}
                          </span>
                        </div>

                        {question.choices && question.choices.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Answer Choices:
                            </h4>
                            <div className="space-y-2">
                              {question.choices.map(
                                (choice: any, choiceIndex: number) => (
                                  <div
                                    key={choice.id || choiceIndex}
                                    className="flex items-center gap-2"
                                  >
                                    {question.question_type ===
                                    "multiple_choice" ? (
                                      <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"></div>
                                    ) : question.question_type ===
                                      "checkbox" ? (
                                      <div className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"></div>
                                    ) : null}
                                    <span className="text-gray-800 dark:text-gray-200">
                                      {choice.text}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {question.created_by && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                            <p>
                              Created by: {question.created_by.full_name || "-"}
                            </p>
                            <p>
                              Created:{" "}
                              {formatDate(
                                question.created_by?.created_at ||
                                  question.created_at
                              )}
                            </p>
                            <p>
                              Updated:{" "}
                              {formatDate(
                                question.created_by?.updated_at ||
                                  question.updated_at
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {processTemplat.questionnaire.created_by && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                    Questionnaire Created By
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {processTemplat.questionnaire.created_by.full_name || "-"}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                    Questionnaire Created At
                  </h3>
                  <p className="text-gray-800 dark:text-gray-300">
                    {formatDate(
                      processTemplat.questionnaire.created_by?.created_at ||
                        processTemplat.questionnaire.created_at
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      {/* Document Preparation Section */}
      {(processTemplat?.process_type === "documentation" ||
        processTemplat?.process_type === "document_preparation") &&
        processTemplat?.required_documents &&
        processTemplat.required_documents.length > 0 && (
          <div className="mb-8">
            <div className="border-l-4 border-green-500 pl-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Required Documents
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Please prepare the following documents
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {processTemplat.required_documents.map(
                (doc: any, index: number) => (
                  <div
                    key={doc.id || index}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                          {doc.name}
                        </h3>
                        {doc.description && (
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {doc.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-3">
                          {doc.is_active !== undefined && (
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                doc.is_active
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-red-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {doc.is_active ? "Active" : "Inactive"}
                            </span>
                          )}
                          {/* {doc.slug && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {doc.slug}
                        </span>
                      )} */}
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                          {doc.created_by ? (
                            <p>Created by: {doc.created_by.full_name || "-"}</p>
                          ) : (
                            <p>Created by: -</p>
                          )}
                          <p>
                            Created:{" "}
                            {formatDate(
                              doc.created_by?.created_at || doc.created_at
                            )}
                          </p>
                          {doc.created_by?.updated_at && (
                            <p>
                              Updated: {formatDate(doc.created_by.updated_at)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      <button
        type="button"
        onClick={() => navigate(`/manage-process-templates/${id}`)}
        className="px-8 mt-4 p-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
      >
        Edit
      </button>

      {/* Footer Section with Updated At */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated:{" "}
              {formatDate(
                processTemplat?.created_by?.updated_at ||
                  processTemplat?.updated_at
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
