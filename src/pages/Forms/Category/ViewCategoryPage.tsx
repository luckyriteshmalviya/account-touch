import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryDetailsService } from "../../../services/restApi/category";

export default function ViewCategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const data = await getCategoryDetailsService(id);
        setCategory(data);
      }
    })();
  }, [id]);

  if (!category) {
    return <p className="text-gray-500 text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">Category Details</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-left">
            
            {/* ID */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">ID</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{category.id}</td>
            </tr>

            {/* Name */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Name</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{category.name || "-"}</td>
            </tr>

            {/* Description */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Description</td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">{category.description || "-"}</td>
            </tr>

            {/* Image */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Image</td>
              <td className="px-6 py-4">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-48 h-48 object-cover rounded border"
                  />
                ) : (
                  <span className="text-gray-500">No image</span>
                )}
              </td>
            </tr>

            {/* Created By ID */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Created By ID</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{category.created_by?.id || "-"}</td>
            </tr>

            {/* Created By Full Name */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Created By Full Name</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{category.created_by?.full_name || "-"}</td>
            </tr>

            {/* Created By Email */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Created By Email</td>
              <td className="px-6 py-4 text-gray-900 dark:text-white">{category.created_by?.email || "-"}</td>
            </tr>

            {/* Created At */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Created At</td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {new Date(category.created_at).toLocaleString() || "-"}
              </td>
            </tr>

            {/* Updated At */}
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Updated At</td>
              <td className="px-6 py-4 text-gray-800 dark:text-gray-300">
                {new Date(category.updated_at).toLocaleString() || "-"}
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}
