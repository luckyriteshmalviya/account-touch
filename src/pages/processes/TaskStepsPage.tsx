// TaskStepsPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskDetailsService } from "../../services/restApi/task";
import Questionnaire from "./Questionnaire";
import Documents from "./Documents";
import Payment from "./Payment";
import DocumentPreparation from "./DocumentPreparation";
import useAuth from "../../hooks/useAuth";

export default function TaskStepsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  console.log("userProfile in task steps page", userProfile);

  // Fetch task details on mount (or when id changes)
  useEffect(() => {
    (async () => {
      if (id) {
        try {
          if (!task) {
            setLoading(true);
          } else {
            setRefreshing(true);
          }
          const data = await getTaskDetailsService(id);
          if (data) {
            setTask(data);
            // Check for step query parameter
            const urlParams = new URLSearchParams(window.location.search);
            const stepParam = urlParams.get("step");
            if (stepParam !== null) {
              const stepIndex = parseInt(stepParam);
              if (
                !isNaN(stepIndex) &&
                stepIndex >= 0 &&
                stepIndex < data.processes?.length
              ) {
                setCurrentStep(stepIndex);
              }
            }
          } else {
            setError("Failed to load task details");
          }
        } catch (err) {
          console.error("Error fetching task details:", err);
          setError("An error occurred while loading task details");
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      }
    })();
  }, [id]);

  // Re-fetch task details whenever currentStep changes (to get latest process/questionnaire submission)
  useEffect(() => {
    if (!id) return;
    // Don't re-fetch on first mount (handled by previous effect)
    if (task && task.processes && task.processes.length > 0) {
      setRefreshing(true);
      getTaskDetailsService(id)
        .then((data) => {
          if (data) setTask(data);
        })
        .catch((err) => {
          console.error("Error refreshing task details:", err);
        })
        .finally(() => setRefreshing(false));
    }
  }, [currentStep, id]);

  // Function to handle step navigation
  const handleStepClick = (stepIndex: number) => {
    // Update URL with the new step parameter without refreshing the page
    const url = new URL(window.location.href);
    url.searchParams.set("step", stepIndex.toString());
    window.history.pushState({}, "", url);

    // Update current step
    setCurrentStep(stepIndex);
  };

  const handleStepComplete = (stepIndex: number) => {
    setCompletedSteps((prev) => [...prev, stepIndex]);

    // Move to the next step if available
    if (stepIndex < processes.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToDetails = () => {
    navigate(`/tasks/view/${id}`);
  };

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
  console.log("task--", task);
  return (
    <div className="relative max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      {/* Loader overlay */}
      {(loading || refreshing) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/80 z-20 rounded-lg">
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBackToDetails}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Task Details
        </button>
        <h1 className="text-2xl font-semibold text-center">
          Task: {task.title || task.name}
        </h1>
        <div className="w-24"></div> {/* Empty div for flex spacing */}
      </div>

      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {processes.map((process, index) => (
            <div key={process.id} className="flex flex-col items-center">
              <button
                onClick={() => handleStepClick(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium cursor-pointer transition-colors ${
                  completedSteps.includes(index)
                    ? "bg-green-500 hover:bg-green-600"
                    : currentStep === index
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                }`}
                aria-label={`Go to step ${index + 1}`}
              >
                {completedSteps.includes(index) ? "✓" : index + 1}
              </button>
              <button
                onClick={() => handleStepClick(index)}
                className="text-sm mt-2 text-center hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              >
                {process.process_template_name || `Step ${index + 1}`}
              </button>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2"
            style={{
              width: `${(currentStep / (processes.length - 1)) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mt-8">
        {/* Loader overlay now covers the whole layout, so remove the old loader here */}
        {processes.length > 0 && currentStep < processes.length && (
          <div>
            {(() => {
              const currentProcess = processes[currentStep];
              const processType =
                currentProcess.process_template_detail?.process_type;

              // if (processType === 'payment') {
              //   handleStepComplete(currentStep);
              //   return null;
              // }

              switch (processType) {
                case "questionnaire":
                  return (
                    <Questionnaire
                      process={currentProcess}
                      taskId={task.id}
                      onComplete={() => handleStepComplete(currentStep)}
                    />
                  );
                case "documentation":
                  return (
                    <Documents
                      process={currentProcess}
                      onComplete={() => handleStepComplete(currentStep)}
                      onPrevious={
                        currentStep > 0 ? handlePreviousStep : undefined
                      }
                    />
                  );
                case "payment":
                  return (
                    <Payment
                      task={task}
                      process={currentProcess}
                      onComplete={() => handleStepComplete(currentStep)}
                      onPrevious={
                        currentStep > 0 ? handlePreviousStep : undefined
                      }
                      userRole={userProfile?.user?.roles?.[0]?.slug || ""}
                      refreshProcess={() => {
                        if (id) {
                          setRefreshing(true);
                          getTaskDetailsService(id)
                            .then((data) => {
                              if (data) setTask(data);
                            })
                            .catch((err) => {
                              console.error(
                                "Error refreshing task details:",
                                err
                              );
                            })
                            .finally(() => setRefreshing(false));
                        }
                      }}
                    />
                  );
                case "document_preparation":
                  return (
                    <DocumentPreparation
                      process={currentProcess}
                      processes={processes}
                      taskId={task.id}
                      onComplete={() => handleStepComplete(currentStep)}
                      onPrevious={
                        currentStep > 0 ? handlePreviousStep : undefined
                      }
                    />
                  );
                default:
                  return (
                    <div className="bg-yellow-100 text-yellow-800 p-4 rounded">
                      Unknown process type: {processType}
                    </div>
                  );
              }
            })()}
          </div>
        )}
        {/* {currentStep === processes.length - 1 && (
          <div className="flex justify-end mt-8">
            <SubmitButton
              processes={processes}
              processTypes={["payment"]}
              onSubmit={handleBackToDetails}
            />
          </div>
        )} */}
      </div>
    </div>
  );
}
