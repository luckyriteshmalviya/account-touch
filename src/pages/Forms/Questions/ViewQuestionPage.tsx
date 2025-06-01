import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionDetailsService } from "../../../services/restApi/Questions"; // Adjust the path as needed

export default function ViewQuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const data = await getQuestionDetailsService(id);
        setQuestion(data);
      }
    })();
  }, [id]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  if (!question) {
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
          <p>Loading question details...</p>
        </div>
      </div>
    );
  }

  // Get the appropriate question type icon and color
  const getQuestionTypeInfo = (type: string) => {
    switch (type?.toLowerCase()) {
      case "text":
        return {
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          ),
          color:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        };
      case "multiple_choice":
      case "multiple choice":
        return {
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          color:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        };
      case "single_choice":
      case "single choice":
        return {
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          ),
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        };
      case "date":
        return {
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ),
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        };
      case "number":
        return {
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
              />
            </svg>
          ),
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        };
      default:
        return {
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        };
    }
  };

  const questionTypeInfo = getQuestionTypeInfo(question.question_type);

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Question Details
        </h1>
        <div className="flex justify-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${questionTypeInfo.color}`}
          >
            {questionTypeInfo.icon}
            {question.question_type || "Unknown Type"}
          </span>
        </div>
      </div>

      {/* Question Content Section - Emphasized as important */}
      <div className="mb-8">
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Question Content
          </h2>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg mb-6 shadow-sm">
          <div className="flex items-start">
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mr-4">
              <span className="text-lg font-medium">Q</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {question.text || "-"}
              </h3>
              {question.description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {question.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                question.is_required
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {question.is_required ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>Required Field</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Optional Field</span>
                </>
              )}
            </span>
            {question.order !== undefined && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Order: {question.order}
              </span>
            )}
          </div>

          {/* Answer Choices - Now inside Question Content section */}
          {question.choices && question.choices.length > 0 && (
            <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Answer Choices ({question.choices.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {question.choices
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((choice: any, index: number) => (
                    <div
                      key={choice.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          {choice.text}
                        </p>
                      </div>
                      {choice.order !== undefined && (
                        <div className="mt-1 ml-7">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Order: {choice.order}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details - Less emphasized */}
      <div className="mb-4">
        <div className="border-l-4 border-gray-300 pl-4 mb-4">
          <h2 className="text-base font-medium text-gray-600 dark:text-gray-400">
            Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Created By
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {question.created_by?.full_name ||
                question.created_by?.email ||
                "-"}
            </p>
            {question.created_by?.id && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                ID: {question.created_by.id}
              </p>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Timestamps
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Created:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-500">
                  {question.created_at ? formatDate(question.created_at) : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last Updated:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-500">
                  {question.updated_at ? formatDate(question.updated_at) : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/manage-question/${id}`)}
          className="px-8 mt-4 p-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
