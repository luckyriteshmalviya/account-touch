import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionnairesDetailsService } from "../../../services/restApi/Questionnaires";

export default function ViewQuestionnairesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const data = await getQuestionnairesDetailsService(id);
        setQuestionnaireData(data);
      }
    })();
  }, [id]);

  if (!questionnaireData) {
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
          <p>Loading questionnaire details...</p>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    questions,
    is_active,
    created_at,
    updated_at,
    submissions_count,
    created_by,
  } = questionnaireData;

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
        Questionnaire Details
      </h1>

      {/* Basic Info Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Title
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">{title}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Status
            </h3>
            <div className="flex items-center">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {is_active ? "Active" : "Inactive"}
              </span>
              {submissions_count !== undefined && (
                <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {submissions_count}{" "}
                  {submissions_count === 1 ? "Submission" : "Submissions"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
            Description
          </h3>
          <p className="text-gray-800 dark:text-gray-300">
            {description || "No description provided"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {created_by && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                Created By
              </h3>
              <p className="text-gray-900 dark:text-white font-medium">
                {created_by?.full_name || "-"}
              </p>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Created At
            </h3>
            <p className="text-gray-800 dark:text-gray-300">
              {formatDate(created_by?.created_at || created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="mb-8">
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {questions?.length}{" "}
            {questions?.length === 1 ? "question" : "questions"} in this
            questionnaire
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((question: any, index: number) => (
            <div
              key={question.id}
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
                    {question.order !== undefined && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Order: {question.order}
                      </span>
                    )}
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
                              {question.question_type === "multiple_choice" ? (
                                <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"></div>
                              ) : question.question_type === "checkbox" ? (
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

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                    {question.created_by ? (
                      <p>Created by: {question.created_by.full_name || "-"}</p>
                    ) : null}
                    <p>
                      Created:{" "}
                      {formatDate(
                        question.created_by?.created_at || question.created_at
                      )}
                    </p>
                    <p>
                      Updated:{" "}
                      {formatDate(
                        question.created_by?.updated_at || question.updated_at
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/manage-questionnaires/${id}`)}
        className="px-8 mt-4 p-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
      >
        Edit
      </button>

      {/* Footer Section with Updated At */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {formatDate(created_by?.updated_at || updated_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
