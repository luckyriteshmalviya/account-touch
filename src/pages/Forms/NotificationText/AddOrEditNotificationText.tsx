import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import NotificationTextForm from "./NotificationTextForm";

import {
  getNotificationTextByIdService,
  createNotificationTextService,
  updateNotificationTextService,
} from "../../../services/restApi/notificationTexts";

const AddOrEditNotificationText = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    is_active: true,
  });

  useEffect(() => {
    if (id) {
      fetchNotificationText();
    }
  }, [id]);

  const fetchNotificationText = async () => {
    try {
      const res = await getNotificationTextByIdService(id);
      setFormData(res);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch notification text.", "error");
    }
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await updateNotificationTextService(id, formData);
        Swal.fire(
          "Updated!",
          "Notification text updated successfully.",
          "success"
        );
      } else {
        await createNotificationTextService(formData);
        Swal.fire(
          "Created!",
          "Notification text added successfully.",
          "success"
        );
      }
      navigate("/notification-texts");
    } catch (err) {
      Swal.fire("Error", "Failed to save notification text.", "error");
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">
        {id ? "Edit Notification Text" : "Add Notification Text"}
      </h1>
      <NotificationTextForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddOrEditNotificationText;
