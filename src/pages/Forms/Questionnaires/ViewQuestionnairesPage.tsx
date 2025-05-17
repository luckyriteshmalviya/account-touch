import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionnairesDetailsService } from "../../../services/restApi/Questionnaires";

export default function ViewQuestionnairesPage() {
  const { id } = useParams();
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
    return <p className="text-gray-500 text-center mt-10">Loading...</p>;
  }

  const {
    id: qId,
    title,
    description,
    questions,
    is_active,
    created_at,
    updated_at,
    submissions_count,
  } = questionnaireData;

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">Questionnaire Details</h1>

      <table className="min-w-full mb-8 divide-y divide-gray-200 dark:divide-gray-700">
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-left">
          <tr>
            <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">ID</td>
            <td className="px-6 py-4 text-gray-900 dark:text-white">{qId}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Title</td>
            <td className="px-6 py-4 text-gray-900 dark:text-white">{title}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Description</td>
            <td className="px-6 py-4 text-gray-900 dark:text-white">{description || "N/A"}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Active</td>
            <td className="px-6 py-4 text-gray-900 dark:text-white">{is_active ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Submissions Count</td>
            <td className="px-6 py-4 text-gray-900 dark:text-white">{submissions_count}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Created At</td>
            <td className="px-6 py-4 text-gray-900 dark:text-white">{new Date(created_at).toLocaleString()}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Updated At</td>
            <td className="px-6 py-4 text-gray-900 dark:text-white">{new Date(updated_at).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div>
        <h2 className="text-xl font-semibold mb-4">Questions</h2>
        {questions.map((q: any, index: number) => (
          <div key={q.id} className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-gray-800 dark:text-white mb-1">
              <strong>Q{index + 1}:</strong> {q.text}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <strong>Type:</strong> {q.question_type}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <strong>Required:</strong> {q.is_required ? "Yes" : "No"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <strong>Created At:</strong> {new Date(q.created_at).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Updated At:</strong> {new Date(q.updated_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
