import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProcessTemplatDetailsService } from "../../../services/restApi/processTemplate";

export default function ViewProcessTemplatPage() {
  const { id } = useParams();
  const [processTemplat, setProcessTemplat] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const data = await getProcessTemplatDetailsService(id);
        setProcessTemplat(data);
      }
    })();
  }, [id]);

  if (!processTemplat) {
    return <p className="text-gray-500 text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Process Template Details
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
                {processTemplat?.id}
              </td>
            </tr>

            {/* Title */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Title
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {processTemplat?.title || "-"}
              </td>
            </tr>

            {/* Description */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Description
              </td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {processTemplat?.description || "-"}
              </td>
            </tr>

            {/* Process Type */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Process Type
              </td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {processTemplat?.process_type || "-"}
              </td>
            </tr>

            {/* Questionnaire */}
            {processTemplat?.questionnaire && (
              <>
                <tr>
                  <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                    Questionnaire Title
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {processTemplat?.questionnaire.title}
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                    Questionnaire Description
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {processTemplat?.questionnaire.description || "-"}
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                    Questions
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    <ol className="list-decimal pl-5 space-y-4">
                      {processTemplat?.questionnaire?.questions.map(
                        (question: any) => (
                          <li key={question?.id}>
                            <p className="font-semibold">{question?.text}</p>
                            <p className="text-sm text-gray-600">
                              Type: {question?.question_type}
                            </p>
                            {question?.choices &&
                              question?.choices.length > 0 && (
                                <ul className="list-disc pl-5 mt-1">
                                  {question?.choices.map((choice: any) => (
                                    <li key={choice?.id}>{choice?.text}</li>
                                  ))}
                                </ul>
                              )}
                          </li>
                        )
                      )}
                    </ol>
                  </td>
                </tr>
              </>
            )}

            {/* Created At */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Created At
              </td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {new Date(
                  processTemplat?.questionnaire?.created_at
                ).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }) || "-"}
              </td>
            </tr>

            {/* Updated At */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                Updated At
              </td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {new Date(
                  processTemplat?.questionnaire?.updated_at
                ).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }) || "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
