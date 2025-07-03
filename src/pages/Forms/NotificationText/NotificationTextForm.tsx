import React from "react";

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
}

const NotificationTextForm: React.FC<NotificationTextFormProps> = ({
  formData,
  setFormData,
  onSubmit,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="border px-3 py-2 rounded w-full"
          placeholder="Enter title"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Body</label>
        <textarea
          rows={6}
          value={formData.body}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, body: e.target.value }))
          }
          className="border px-3 py-2 rounded w-full"
          placeholder="Enter body content"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.is_active}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
          }
        />
        <label className="font-medium">Active</label>
      </div>

      <button
        onClick={onSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Notification
      </button>
    </div>
  );
};

export default NotificationTextForm;
