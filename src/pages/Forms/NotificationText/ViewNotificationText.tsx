import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNotificationTextByIdService } from "../../../services/restApi/notificationTexts";

const ViewNotificationText = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [textData, setTextData] = useState<any>(null);

  useEffect(() => {
    fetchText();
  }, []);

  const fetchText = async () => {
    try {
      const res = await getNotificationTextByIdService(id);
      setTextData(res);
    } catch (err) {
      console.error("Failed to fetch notification text.");
    }
  };

  if (!textData) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-bold">View Notification Text</h1>
      <div>
        <strong>Title:</strong> {textData.title}
      </div>
      <div>
        <strong>Body:</strong> {textData.body}
      </div>
      <div>
        <strong>Status:</strong> {textData.is_active ? "Active" : "Inactive"}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => navigate("/notification-texts")}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
        >
          Back to List
        </button>
        <button
          onClick={() => navigate(`/edit-notification-text/${textData.id}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit Notification
        </button>
      </div>
    </div>
  );
};

export default ViewNotificationText;
