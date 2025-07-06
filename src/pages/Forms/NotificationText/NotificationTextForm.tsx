import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";

interface NotificationTextFormProps {
  formData: {
    title: string;
    body: string;
    is_active: boolean;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      body: string;
      is_active: boolean;
    }>
  >;
  onSubmit: () => void;
  editMode?: boolean;
}

const NotificationTextForm: React.FC<NotificationTextFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  editMode = false,
}) => {
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { title?: string; body?: string } = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.body.trim()) newErrors.body = "Body is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <div className="max-w-full mx-auto p-8">
      <form onSubmit={handleSubmit}>
        <ComponentCard
          title={editMode ? "Edit Notification Text" : "Add Notification Text"}
        >
          {/* Title */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="title">
              Title<span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Body */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="body">
              Body<span className="text-red-500">*</span>
            </Label>
            <textarea
              id="body"
              value={formData.body}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, body: e.target.value }))
              }
              className={`w-full p-2 border rounded ${
                errors.body ? "border-red-500" : ""
              }`}
              rows={5}
            />
            {errors.body && (
              <p className="text-red-500 text-sm">{errors.body}</p>
            )}
          </div>

          {/* Is Active */}
          <div className="mb-6">
            <Checkbox
              id="isActive"
              checked={formData.is_active}
              onChange={(isChecked: boolean) =>
                setFormData((prev) => ({ ...prev, is_active: isChecked }))
              }
              label="Active"
              subLabel="Whether this notification is active"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editMode ? "Save Changes" : "Save"}
            </button>

            {editMode && (
              <button
                type="button"
                onClick={() => navigate("/notification-text-list")}
                className="px-6 py-2 border border-zinc-400 hover:bg-blue-400 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </ComponentCard>
      </form>
    </div>
  );
};

export default NotificationTextForm;
