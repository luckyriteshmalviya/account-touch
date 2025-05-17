// TaskStepsPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskDetailsService } from "../../services/restApi/task";
import Questionnaire from "./Questionnaire";
import Documents from "./Documents";
import Payment from "./Payment";
import DocumentPreparation from "./DocumentPreparation";


export default function TaskStepsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
  }, [id, currentStep]);

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
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handleBackToDetails}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Task Details
        </button>
        <h1 className="text-2xl font-semibold text-center">Task: {task.title || task.name}</h1>
        <div className="w-24"></div> {/* Empty div for flex spacing */}
      </div>

      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {processes.map((process, index) => (
            <div key={process.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                  completedSteps.includes(index)
                    ? 'bg-green-500'
                    : currentStep === index
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                {completedSteps.includes(index) ? '✓' : index + 1}
              </div>
              <span className="text-sm mt-2 text-center">
                {process.process_template_name || `Step ${index + 1}`}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2"
            style={{ width: `${(currentStep / (processes.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mt-8">
        {refreshing && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4 flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Refreshing task data...
          </div>
        )}
        
        {processes.length > 0 && currentStep < processes.length && (
          <div>
            {(() => {
              const currentProcess = processes[currentStep];
              const processType = currentProcess.process_template_detail?.process_type;
                
              // if (processType === 'payment') {
              //   handleStepComplete(currentStep);
              //   return null;
              // }

              switch (processType) {
                case 'questionnaire':
                  return (
                    <Questionnaire
                      process={currentProcess}
                      taskId={task.id}
                      onComplete={() => handleStepComplete(currentStep)}
                    />
                  );
                case 'documentation':
                  return (
                    <Documents
                      process={currentProcess}
                      onComplete={() => handleStepComplete(currentStep)}
                      onPrevious={currentStep > 0 ? handlePreviousStep : undefined}
                    />
                  );
                case 'payment':
                  return (
                    <Payment
                      process={currentProcess}
                      onComplete={() => handleStepComplete(currentStep)}
                      onPrevious={currentStep > 0 ? handlePreviousStep : undefined}
                    />
                  );
                case 'document_preparation':
                  return (
                    <DocumentPreparation
                      process={currentProcess}
                      taskId={task.id}
                      onComplete={() => handleStepComplete(currentStep)}
                      onPrevious={currentStep > 0 ? handlePreviousStep : undefined}
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

        {completedSteps.length === processes.length && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded">
            <h3 className="font-semibold text-lg mb-2">All steps completed!</h3>
            <p>You have successfully completed all the required steps for this task.</p>
            <div className="mt-4">
              <button 
                onClick={handleBackToDetails}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Back to Task Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}