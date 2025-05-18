import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionDetailsService } from "../../../services/restApi/Questions"; // Adjust the path as needed

export default function ViewQuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const data = await getQuestionDetailsService(id);
        setQuestion(data);
      }
    })();
  }, [id]);

  if (!question) {
    return <p className="text-gray-500 text-center mt-10">Loading...</p>;
  }

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

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Question Details
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-left">
            {/* ID */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                ID
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {question.id}
              </td>
            </tr>

            {/* Text */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Text
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {question.text || "-"}
              </td>
            </tr>

            {/* Description */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Description
              </td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {question.description || "-"}
              </td>
            </tr>

            {/* Question Type */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Question Type
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {question.question_type || "-"}
              </td>
            </tr>

            {/* Is Required */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Is Required
              </td>
              <td className="px-6 py-4">
                {question.is_required ? (
                  <span className="inline-block w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    ✓
                  </span>
                ) : (
                  <span className="inline-block w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    ×
                  </span>
                )}
              </td>
            </tr>

            {/* Order */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Order
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {question.order}
              </td>
            </tr>

            {/* Choices */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Choices
              </td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {question.choices && question.choices.length > 0 ? (
                  <ul className="list-disc ml-5">
                    {question.choices
                      .sort((a: any, b: any) => a.order - b.order)
                      .map((choice: any) => (
                        <li key={choice.id}>
                          <span className="text-gray-900 dark:text-white">
                            {choice.text}
                          </span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  "-"
                )}
              </td>
            </tr>

            {/* Created By */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Created By
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {question.created_by?.full_name ||
                  question.created_by?.email ||
                  question.created_by?.id ||
                  "-"}
              </td>
            </tr>

            {/* Created At */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Created At
              </td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {question.created_at ? formatDate(question.created_at) : "-"}
              </td>
            </tr>

            {/* Updated At */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Updated At
              </td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {question.updated_at ? formatDate(question.updated_at) : "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
