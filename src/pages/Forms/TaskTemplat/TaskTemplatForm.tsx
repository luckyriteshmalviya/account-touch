import React, { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

interface Category {
  id: number;
  name: string;
}

type Priority = "low" | "medium" | "high";
interface TaskTemplatFormProps {
  taskTemplat: {
    title: string;
    description: string;
    image: string | File;
    category_id: number;
    is_active: boolean;
    is_ready: boolean;
    order: number;
    priority: Priority;
    fees: string;
  };
  setTaskTemplat: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (formData: FormData) => void;
  editMode?: boolean;
  categoryList: Category[];
}

const TaskTemplatForm = ({
  taskTemplat,
  setTaskTemplat,
  onSubmit,
  editMode = false,
  categoryList,
}: TaskTemplatFormProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!taskTemplat.title.trim()) newErrors.title = "Title is required.";
    if (!taskTemplat.description.trim()) newErrors.description = "Description is required.";
    if (!taskTemplat.image || (typeof taskTemplat.image === "string" && !taskTemplat.image.trim())) {
      newErrors.image = "Image is required.";
    }
    if (!taskTemplat.category_id) newErrors.category_id = "Category is required.";
    if (!taskTemplat.priority) newErrors.priority = "Priority is required.";
    if (!taskTemplat.fees) newErrors.fees = "Fees is required.";
    if (taskTemplat.order === undefined || taskTemplat.order === null) newErrors.order = "Order is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();

      formData.append("title", taskTemplat.title);
      formData.append("description", taskTemplat.description);
      formData.append("category_id", taskTemplat.category_id.toString());
      formData.append("is_active", taskTemplat.is_active ? "true" : "false");
      formData.append("is_ready", taskTemplat.is_ready ? "true" : "false");
      formData.append("order", taskTemplat.order.toString());
      formData.append("priority", taskTemplat.priority);
      formData.append("fees", taskTemplat.fees);

      if (taskTemplat.image instanceof File) {
        formData.append("image", taskTemplat.image);
      }
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ComponentCard title={editMode ? "Edit Task Template" : "Add New Task Template"}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              value={taskTemplat.title}
              type="text"
              id="title"
              onChange={(e) => setTaskTemplat((prev: any) => ({ ...prev, title: e.target.value }))}
              required
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              value={taskTemplat.description}
              type="text"
              id="description"
              onChange={(e) => setTaskTemplat((prev: any) => ({ ...prev, description: e.target.value }))}
              required
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Image *</Label>

            {/* Show preview if it's a URL string */}
            {taskTemplat.image && typeof taskTemplat.image === "string" && (
              <img
                src={taskTemplat.image}
                alt="Preview"
                className="h-20 w-auto rounded border"
              />
            )}

            <input
              type="file"
              accept="image/*"
              id="image"
              className="w-full border rounded px-3 py-2"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setTaskTemplat((prev: any) => ({
                    ...prev,
                    image: file, // <-- store the File directly
                  }));
                }
              }}
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category_id">Category *</Label>
            <select
              id="category_id"
              className="w-full border rounded px-3 py-2"
              value={taskTemplat.category_id}
              onChange={(e) => setTaskTemplat((prev: any) => ({ ...prev, category_id: parseInt(e.target.value) }))}
              required
            >
              <option value="">-- Select Category --</option>
              {categoryList.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
          </div>

          {/* Is Active */}
          <div className="space-y-2">
            <Label htmlFor="is_active">Is Active *</Label>
            <select
              id="is_active"
              className="w-full border rounded px-3 py-2"
              value={String(taskTemplat.is_active)}
              onChange={(e) => setTaskTemplat((prev: any) => ({ ...prev, is_active: e.target.value === 'true' }))}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          {/* Is Ready */}
          <div className="space-y-2">
            <Label htmlFor="is_ready">Is Ready *</Label>
            <select
              id="is_ready"
              className="w-full border rounded px-3 py-2"
              value={String(taskTemplat.is_ready)}
              onChange={(e) => setTaskTemplat((prev: any) => ({ ...prev, is_ready: e.target.value === 'true' }))}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order">Order *</Label>
            <Input
              value={taskTemplat.order}
              type="number"
              id="order"
              onChange={(e) => setTaskTemplat((prev: any) => ({ ...prev, order: parseInt(e.target.value) }))}
              required
            />
            {errors.order && <p className="text-red-500 text-sm">{errors.order}</p>}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority *</Label>
            <select
              id="priority"
              className="w-full border rounded px-3 py-2"
              value={taskTemplat.priority}
              onChange={(e) => setTaskTemplat((prev: any) => ({ ...prev, priority: e.target.value }))}
              required
            >
              <option value="">-- Select Priority --</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && <p className="text-red-500 text-sm">{errors.priority}</p>}
          </div>

          {/* Fees */}
          <div className="space-y-2">
            <Label htmlFor="fees">Fees *</Label>
            <Input
              value={taskTemplat.fees}
              type="text"
              id="fees"
              onChange={(e) => setTaskTemplat((prev: any) => ({ ...prev, fees: e.target.value }))}
              required
            />
            {errors.fees && <p className="text-red-500 text-sm">{errors.fees}</p>}
          </div>

        </div>

        {/* Submit */}
        <div className="mt-6">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {editMode ? "Save Changes" : "Create Task Template"}
          </button>
        </div>
      </ComponentCard>
    </form>
  );
};

export default TaskTemplatForm;
