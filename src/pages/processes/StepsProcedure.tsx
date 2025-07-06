import { useState, useEffect } from "react";
import { submitProcedureStepsService } from "../../services/restApi/task";
import Swal from "sweetalert2";

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

      // Populate existing procedure_submission data if available
      if (process?.procedure_submission?.responses?.length > 0) {
        process.procedure_submission.responses.forEach(
          (response: any, index: number) => {
            const step = process.process_template_detail.procedure.steps[index];
            if (step) {
              initialState[step.id] = {
                value: response.status ? "true" : "false",
                remark: response.remarks,
              };
            }
          }
        );
      }

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

  const handleCheckboxChange = (stepId: string, checked: boolean) => {
    setStepStates((prev) => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        value: checked ? "true" : "false",
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
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: res.error,
        confirmButtonColor: "#d33",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Procedure steps submitted successfully!",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        onComplete();
      });
    }
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

            {/* Checkbox for Done */}
            <div className="mt-3 flex items-center gap-3">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={stepStates[step.id]?.value === "true"}
                  onChange={(e) =>
                    handleCheckboxChange(step.id, e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                Done
              </label>
            </div>

            {/* Remark input */}
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

      {/* Navigation buttons */}
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
          onClick={handleProcedureSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
