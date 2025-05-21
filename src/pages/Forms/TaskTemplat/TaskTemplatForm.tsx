import React, { useState, useEffect } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

interface ProcessTemplate {
  id: number;
  name: string;
  process_type: string;
  title: string;
}

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
    process_templates: any;  
  };
  setTaskTemplat: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (formData: FormData) => void;
  editMode?: boolean;
  categoryList: Category[];
  processTemplates: ProcessTemplate[];
}

const TaskTemplatForm = ({
  taskTemplat,
  setTaskTemplat,
  onSubmit,
  editMode = false,
  categoryList,
  processTemplates,
}: TaskTemplatFormProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [selectedProcesses, setSelectedProcesses] = useState<{ title: any; process_type: any; process_template_id: any; order: any }[]>([
    { title: 'GST Ret Q P', process_type: 'questionnaire', process_template_id: 0, order: 0 },
    { title: 'IT RETURN User Document PT', process_type: 'documentation', process_template_id: 0, order: 0 },
    { title: 'IT RETURN Payment', process_type: 'payment', process_template_id: 0, order: 0 },
    { title: 'IT RETURN Final Document PT', process_type: 'document_preparation', process_template_id: 0, order: 0 },
  ]);
  const [processErrors, setProcessErrors] = useState<string>("");

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

  const validateProcessSelections = () => {
    // Define expected process types by index
    const expectedTypes = [
      'questionnaire',
      'documentation',
      'payment',
      'document_preparation',
    ];

    const selectedDetails = selectedProcesses.map(sel =>
      processTemplates.find(pt => pt.id === sel.process_template_id)
    );

    // Check for incorrect types per index
    for (let i = 0; i < expectedTypes.length; i++) {
      if (!selectedDetails[i]) {
        setProcessErrors(`Please select a process template for step ${i + 1}.`);
        return false;
      }

      if (selectedDetails[i]?.process_type !== expectedTypes[i]) {
        setProcessErrors(
          `Step ${i + 1} must be a "${expectedTypes[i]}" process type.`
        );
        return false;
      }
    }

    // Check for uniqueness
    const processTypes = selectedDetails.map(pt => pt?.process_type);
    const orders = selectedProcesses.map(p => p.order);

    const hasDuplicateTypes = new Set(processTypes).size !== processTypes.length;
    const hasDuplicateOrders = new Set(orders).size !== orders.length;

    if (hasDuplicateTypes || hasDuplicateOrders) {
      setProcessErrors("Each process type and order must be unique.");
      return false;
    }

    // All good
    setProcessErrors("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValidForm = validate();
    const isValidProcess = validateProcessSelections();

    if (isValidForm && isValidProcess) {
      const formData = new FormData();
      formData.append("title", taskTemplat.title);
      formData.append("description", taskTemplat.description);
      formData.append("category_id", taskTemplat.category_id.toString());
      formData.append("is_active", taskTemplat.is_active ? "true" : "false");
      formData.append("is_ready", taskTemplat.is_ready ? "true" : "false");
      formData.append("order", taskTemplat.order.toString());
      formData.append("priority", taskTemplat.priority);
      formData.append("fees", taskTemplat.fees);
      formData.append("process_templates", JSON.stringify(selectedProcesses));

      if (taskTemplat.image instanceof File) {
        formData.append("image", taskTemplat.image);
      }
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
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
        <div className="space-y-4">
          <ComponentCard title="Assign Process Templates">
            {/* Header Row */}
            <div className="grid grid-cols-2 gap-4 font-semibold text-sm text-gray-700 mb-2">
              <div>Process Template</div>
              <div>Order</div>
            </div>

            {/* Process Rows */}
            {selectedProcesses.map((process, index) => {
              const matchedTemplate = processTemplates.find(pt => pt.title === process.title);
              const matchedTitle = matchedTemplate?.title || "";

              return (
                <div key={index} className="mb-4">
                  {/* Label above row */}
                  {matchedTitle && (
                    <div className="text-sm font-semibold text-gray-600 mb-1">
                      GST RETURN - {matchedTitle} (Order: {index})
                    </div>
                  )}

                  {/* Row with dropdown and input */}
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <select
                      className="border px-2 py-2 rounded"
                      value={taskTemplat?.process_templates[index]?.process_template_id}
                      onChange={(e) => {
                        const updated = selectedProcesses.map((item, idx) =>
                          idx == index ? { ...item, process_template_id: e.target.value } : item
                        );
                        setSelectedProcesses(updated);
                      }}
                    >
                      <option value="">-- Select Process Template --</option>
                      {processTemplates.map((pt) => (
                        <option key={pt.id} value={pt.id}>
                          {pt.title} ({pt.process_type})
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      className="border px-2 py-2 rounded"
                      value={String(taskTemplat?.process_templates[index]?.order)}
                      min="0" // <-- string, not number
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = Number(e.target.value);
                        if (value >= 0) {
                          const updated = selectedProcesses.map((item, idx) =>
                            idx === index ? { ...item, order: value } : item
                          );
                          setSelectedProcesses(updated);
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Error Message */}
            {processErrors && <p className="text-red-500 mt-2">{processErrors}</p>}
          </ComponentCard>
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
