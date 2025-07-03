import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBannerDetailsService } from "../../../services/restApi/bannerImages";

interface BannerType {
  id: number;
  title: string;
  is_active: boolean;
  image: string;
}

const ViewBannerImage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [banner, setBanner] = useState<BannerType | null>(null);

  useEffect(() => {
    if (id) fetchBanner();
  }, [id]);

  const fetchBanner = async () => {
    const res = await getBannerDetailsService(id as string);
    if (res) setBanner(res);
  };

  if (!banner) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-bold">View Banner Image</h1>
      <div>
        <strong>Title:</strong> {banner.title}
      </div>
      <div>
        <strong>Status:</strong> {banner.is_active ? "Active" : "Inactive"}
      </div>
      <div>
        <strong>Image:</strong>
        <div className="mt-2">
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full border rounded"
          />
        </div>
      </div>
      <button
        onClick={() => navigate(`/edit-banner-image/${banner.id}`)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Edit Banner
      </button>
    </div>
  );
};

export default ViewBannerImage;
