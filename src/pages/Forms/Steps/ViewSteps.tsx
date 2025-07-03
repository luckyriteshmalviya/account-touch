import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStepDetailsService } from "../../../services/restApi/steps";

export default function ViewSteps() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const data = await getStepDetailsService(id);
        setStep(data);
      }
    })();
  }, [id]);

  const formatDate = (dateString?: string) => {
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

  if (!step) {
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
          <p>Loading step details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">Step Details</h1>

      {/* Step Text */}
      <div className="mb-8 space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
            Title
          </h3>
          <p className="text-gray-900 dark:text-white font-medium">
            {step.step_text || "-"}
          </p>
        </div>

        {/* Description */}
        {step.description && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Description
            </h3>
            <p className="text-gray-800 dark:text-gray-300">
              {step.description}
            </p>
          </div>
        )}
      </div>

      {/* Creator Info & Timestamps */}
      <div className="mb-8">
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Creator Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Created By
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {step.created_by?.full_name || "-"}
            </p>
            {step.created_by?.email && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {step.created_by.email}
              </p>
            )}
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
                  {formatDate(step.created_at)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last Updated:
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-300">
                  {formatDate(step.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/steps")}
          className="px-8 p-2 border border-1 border-zinc-400 hover:bg-gray-300 rounded-lg"
        >
          Back to List
        </button>
        <button
          onClick={() => navigate(`/manage-steps/${id}`)}
          className="px-8 p-2 border border-1 border-blue-600 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
        >
          Edit Step
        </button>
      </div>
    </div>
  );
}
