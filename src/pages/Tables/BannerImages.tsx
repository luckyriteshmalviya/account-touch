import { useState, useEffect } from "react";
import { Eye, Trash2, Plus, Search, Edit } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  deleteBannerService,
  getBannerListService,
} from "../../services/restApi/bannerImages";

interface BannerImage {
  id: number;
  title: string;
  image: string;
  is_active: boolean;
}

const BannerImages = () => {
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBannerImages();
  }, [searchTerm, page]);

  const fetchBannerImages = async () => {
    setLoading(true);
    try {
      const response = await getBannerListService({
        search: searchTerm,
        ordering: "-id",
        page,
        page_size: 10,
      });
      if (response && response.results) {
        setBannerImages(response.results);
        setTotalPages(Math.ceil(response.count / 10));
      } else {
        setBannerImages([]);
      }
    } catch (error) {
      console.error("Error fetching banner images:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    Swal.fire({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this banner image?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteBannerService(id);
      if (success) {
        setBannerImages((prev) => prev.filter((img) => img.id !== id));
        Swal.fire("Deleted!", "Banner image deleted successfully.", "success");
      } else {
        Swal.fire("Failed", "Could not delete banner image.", "error");
      }
    } catch (error) {
      console.error("Error deleting banner image:", error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Banner Images</h1>
        <button
          onClick={() => navigate("/add-banner-image")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Banner Image
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search banner images..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Preview
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Is Active
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bannerImages.map((image) => (
                <tr
                  key={image.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {image.title}
                  </td>
                  <td className="py-4 px-4">
                    <img
                      src={image.image}
                      alt={`Banner ${image.title}`}
                      className="w-16 h-12 object-cover rounded border"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        image.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {image.is_active ? "✓ Active" : "✗ Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/view-banner-image/${image.id}`)
                        }
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/edit-banner-image/${image.id}`)
                        }
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => confirmDelete(image.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bannerImages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No banner images found</div>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
          <button
            key={pg}
            onClick={() => setPage(pg)}
            className={`px-3 py-1 rounded ${
              page === pg
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {pg}
          </button>
        ))}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BannerImages;
