import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBannerDetailsService } from "../../../services/restApi/bannerImages";

interface BannerType {
  id: number;
  title: string;
  is_active: boolean;
  image: string;
  created_by?: {
    full_name: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string;
}

const ViewBannerImage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [banner, setBanner] = useState<BannerType | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (id) fetchBanner();
  }, [id]);

  const fetchBanner = async () => {
    const res = await getBannerDetailsService(id as string);
    if (res) setBanner(res);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  if (!banner) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500 text-center">
          <svg
            className="w-10 h-10 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <p>Loading banner details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Banner Details
      </h1>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Title
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {banner.title || "-"}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Status
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                banner.is_active
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {banner.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {banner.image && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-2">
              Image
            </h3>
            <img
              src={banner.image}
              alt={banner.title}
              className="w-48 h-48 object-cover rounded cursor-pointer"
              onClick={() => setIsPreviewOpen(true)}
            />
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="border-l-4 border-blue-500 pl-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Creator Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col justify-between">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Created By
            </h3>
            <p className="text-gray-900 dark:text-white font-medium">
              {banner.created_by?.full_name || "-"}
            </p>
            {banner.created_by?.email && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {banner.created_by.email}
              </p>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
              Timestamps
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Created:
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-300">
                  {formatDate(banner.created_at)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last Updated:
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-300">
                  {formatDate(banner.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/edit-banner-image/${banner.id}`)}
        className="px-8 p-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
      >
        Edit
      </button>

      {isPreviewOpen && banner.image && (
        <div className="fixed inset-0 z-[100000] bg-black bg-opacity-80 flex items-center justify-center">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-5 right-5 text-white text-2xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={banner.image}
            alt={banner.title}
            className="max-w-full max-h-full object-contain rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ViewBannerImage;
