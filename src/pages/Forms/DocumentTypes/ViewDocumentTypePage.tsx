import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDocumentTypeDetailsService } from "../../../services/restApi/documentType";

export default function ViewDocumentTypePage() {
  const { id } = useParams();
  const [documentType, setDocumentType] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const data = await getDocumentTypeDetailsService(id);
        setDocumentType(data);
      }
    })();
  }, [id]);

  if (!documentType) {
    return <p className="text-gray-500 text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">Document Type Details</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-left">

            {/* ID */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">ID</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{documentType.id}</td>
            </tr>

            {/* Name */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Name</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{documentType.name || "-"}</td>
            </tr>

            {/* Description */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Description</td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">{documentType.description || "-"}</td>
            </tr>

            {/* Slug */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Slug</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{documentType.slug || "-"}</td>
            </tr>

            {/* Is Active */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Is Active</td>
              <td className="px-6 py-4">
                {documentType.is_active ? (
                  <span className="inline-block w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                ) : (
                  <span className="inline-block w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">×</span>
                )}
              </td>
            </tr>

            {/* Validation Rules */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Validation Rules</td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {documentType.validation_rules
                  ? JSON.stringify(documentType.validation_rules)
                  : "-"}
              </td>
            </tr>

            {/* Validation Rules Display */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Validation Rules Display</td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {documentType.validation_rules_display &&
                Object.keys(documentType.validation_rules_display).length > 0
                  ? JSON.stringify(documentType.validation_rules_display)
                  : "-"}
              </td>
            </tr>

            {/* Created By */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Created By</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">
                {documentType.created_by?.full_name ||
                 documentType.created_by?.email ||
                 documentType.created_by?.id ||
                 "-"}
              </td>
            </tr>

            {/* Created At */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Created At</td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {new Date(documentType.created_at).toLocaleString() || "-"}
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}
