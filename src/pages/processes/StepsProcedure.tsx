import { useState, useEffect } from "react";

interface ProcedureStepsProps {
  process: any;
  taskId: string;
  task: any;
  onComplete: () => void;
  onPrevious?: () => void;
}

export default function ProcedureSteps({
  process,
  //   taskId,
  //   task,
  onComplete,
  onPrevious,
}: ProcedureStepsProps) {
  const [content, setContent] = useState("");
  //   console.log(task);
  //   console.log(taskId);
  // For demo, let’s assume the process template detail has a description
  useEffect(() => {
    if (process?.process_template_detail?.procedure_description) {
      setContent(process.process_template_detail.procedure_description);
    }
  }, [process]);

  if (!process.process_template_detail) {
    return (
      <div className="text-red-500">
        No procedure details found for this process
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        {process.process_template_name || "Procedure Steps"}
      </h2>

      <div className="prose dark:prose-invert mb-6">
        <p>{content}</p>
      </div>

      <div className="flex justify-end">
        {onPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Previous
          </button>
        )}
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
