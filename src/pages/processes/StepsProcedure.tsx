import { useState, useEffect } from "react";
import { submitProcedureStepsService } from "../../services/restApi/task";

interface ProcedureStepsProps {
  process: any;
  taskId: string;
  task: any;
  onComplete: () => void;
  onPrevious?: () => void;
}

export default function ProcedureSteps({
  process,
  taskId,
  //   task,
  onComplete,
  onPrevious,
}: ProcedureStepsProps) {
  const [procedureDescription, setProcedureDescription] = useState("");
  const [stepStates, setStepStates] = useState<
    Record<string, { value: string; remark: string }>
  >({});

  useEffect(() => {
    if (process?.process_template_detail?.procedure_description) {
      setProcedureDescription(
        process.process_template_detail.procedure_description
      );
    }

    if (process?.process_template_detail?.procedure?.steps) {
      const initialState: Record<string, { value: string; remark: string }> =
        {};
      process.process_template_detail.procedure.steps.forEach((step: any) => {
        initialState[step.id] = {
          value: "",
          remark: "",
        };
      });
      setStepStates(initialState);
    }
  }, [process]);

  if (!process.process_template_detail) {
    return (
      <div className="text-red-500">
        No procedure details found for this process.
      </div>
    );
  }

  const handleProcedureSubmit = async () => {
    const procedureId = process.process_template_detail.procedure.id;
    const processId = process.id;

    const stepsArray = process.process_template_detail.procedure.steps.map(
      (step: any) => {
        const stepState = stepStates[step.id];
        return {
          step: step.id,
          status: stepState?.value === "true",
          remarks: stepState?.remark || "",
        };
      }
    );

    const payload = {
      procedure_id: procedureId,
      process_id: processId,
      task_id: taskId,
      response_data: stepsArray,
    };

    const res = await submitProcedureStepsService(payload);

    if (res.error) {
      alert(`Error: ${res.error}`);
    } else {
      alert("Procedure steps submitted successfully!");
      onComplete();
    }
  };

  const handleRadioChange = (stepId: string, value: string) => {
    setStepStates((prev) => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        value: value,
      },
    }));
  };

  const handleRemarkChange = (stepId: string, value: string) => {
    setStepStates((prev) => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        remark: value,
      },
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        {process.process_template_name || "Procedure Steps"}
      </h2>

      <div className="prose dark:prose-invert mb-6">
        <p>{procedureDescription}</p>
      </div>

      <div className="space-y-6">
        {process.process_template_detail.procedure?.steps.map((step: any) => (
          <div
            key={step.id}
            className="border p-4 rounded-md dark:border-gray-600"
          >
            <h3 className="font-medium text-gray-800 dark:text-white">
              {step.step_text}
            </h3>

            <div className="mt-3 flex items-center gap-4">
              <label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name={`step-${step.id}`}
                  value="true"
                  checked={stepStates[step.id]?.value === "true"}
                  onChange={() => handleRadioChange(step.id, "true")}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                True
              </label>

              <label className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name={`step-${step.id}`}
                  value="false"
                  checked={stepStates[step.id]?.value === "false"}
                  onChange={() => handleRadioChange(step.id, "false")}
                  className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                False
              </label>
            </div>

            <div className="mt-3">
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Remark
              </label>
              <textarea
                placeholder="Write a remark (optional)"
                value={stepStates[step.id]?.remark || ""}
                onChange={(e) => handleRemarkChange(step.id, e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white dark:border-gray-600"
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        {onPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Previous
          </button>
        )}

        <button
          type="button"
          onClick={() => handleProcedureSubmit()}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
