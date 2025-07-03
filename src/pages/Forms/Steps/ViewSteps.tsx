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

  if (!step) {
    return <div className="text-center py-10">Loading step details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Step Details</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">Title:</h2>
        <p className="text-gray-700 dark:text-gray-300">{step.step_text}</p>
      </div>

      {step.description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-1">Description:</h2>
          <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate(`/manage-steps/${id}`)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit Step
        </button>
      </div>
    </div>
  );
}
