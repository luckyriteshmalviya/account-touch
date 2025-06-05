import React, { useState, useEffect } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import { useNavigate, useParams } from "react-router";

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
    process_template_ids: string[]; // Changed from process_templates_list
  };
  setTaskTemplat: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (formData: FormData) => void;
  editMode?: boolean;
  categoryList: Category[];
  processTemplates: ProcessTemplate[];
  setSelectedProcesses: React.Dispatch<
    React.SetStateAction<{ process_template_id: string; order: number }[]>
  >;
  selectedProcesses: { process_template_id: string; order: number }[];
}

const TaskTemplatForm = ({
  taskTemplat,
  setTaskTemplat,
  onSubmit,
  editMode = false,
  categoryList,
  processTemplates,
  selectedProcesses,
  setSelectedProcesses,
}: TaskTemplatFormProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Initialize selectedProcesses from taskTemplat.process_template_ids if available
    if (
      taskTemplat.process_template_ids &&
      Array.isArray(taskTemplat.process_template_ids) &&
      taskTemplat.process_template_ids.length > 0
    ) {
      // Convert IDs to the format expected by selectedProcesses
      const initialProcesses = taskTemplat.process_template_ids.map(
        (id, index) => ({
          process_template_id: id,
          order: index,
        })
      );

      // Make sure we have at least 4 items
      while (initialProcesses.length < 4) {
        initialProcesses.push({
          process_template_id: "",
          order: initialProcesses.length,
        });
      }
      setSelectedProcesses(initialProcesses);
    } else {
      // Update taskTemplat with default selectedProcesses
      const processIds = selectedProcesses
        .filter((process) => process.process_template_id.trim() !== "")
        .map((process) => process.process_template_id);

      setTaskTemplat((prev: any) => ({
        ...prev,
        process_template_ids: processIds,
      }));
    }
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!taskTemplat.title.trim()) newErrors.title = "Title is required.";
    if (!taskTemplat.description.trim())
      newErrors.description = "Description is required.";
    if (
      !taskTemplat.image ||
      (typeof taskTemplat.image === "string" && !taskTemplat.image.trim())
    ) {
      newErrors.image = "Image is required.";
    }
    if (!taskTemplat.category_id)
      newErrors.category_id = "Category is required.";
    if (!taskTemplat.priority) newErrors.priority = "Priority is required.";
    if (!taskTemplat.fees) newErrors.fees = "Fees is required.";
    if (taskTemplat.order === undefined || taskTemplat.order === null)
      newErrors.order = "Order is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate();

    if (!isValid) {
      return;
    }

    // Create FormData for submission
    const formData = new FormData();
    formData.append("title", taskTemplat.title);
    formData.append("description", taskTemplat.description);

    // Handle image
    if (taskTemplat.image instanceof File) {
      formData.append("image", taskTemplat.image);
    }

    formData.append("category_id", String(taskTemplat.category_id));
    formData.append("is_active", String(taskTemplat.is_active));
    formData.append("is_ready", String(taskTemplat.is_ready));
    formData.append("order", String(taskTemplat.order));
    formData.append("priority", taskTemplat.priority);
    formData.append("fees", taskTemplat.fees);

    // Extract process template IDs (only non-empty ones)
    const processTemplateIds = selectedProcesses
      .filter((process) => process.process_template_id.trim() !== "")
      .map((process) => process.process_template_id);

    // Add process_template_ids - this will be handled in the parent component
    formData.append("process_template_ids", JSON.stringify(processTemplateIds));

    onSubmit(formData);
  };

  // Update the parent state when selectedProcesses changes
  const updateProcessTemplateIds = (
    updatedProcesses: { process_template_id: string; order: number }[]
  ) => {
    const processIds = updatedProcesses
      .filter((process) => process.process_template_id.trim() !== "")
      .map((process) => process.process_template_id);

    setTaskTemplat((prev: any) => ({
      ...prev,
      process_template_ids: processIds,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ComponentCard
        title={editMode ? "Edit Task Template" : "Add New Task Template"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={taskTemplat.title}
              onChange={(e) =>
                setTaskTemplat((prev: any) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="border px-2 py-2 rounded w-full"
              value={taskTemplat.category_id || ""}
              onChange={(e) =>
                setTaskTemplat((prev: any) => ({
                  ...prev,
                  category_id: Number(e.target.value),
                }))
              }
              required
            >
              <option value="">-- Select Category --</option>
              {categoryList.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-sm">{errors.category_id}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <TextArea
              rows={4}
              value={taskTemplat.description}
              onChange={(value) =>
                setTaskTemplat((prev: any) => ({ ...prev, description: value }))
              }
              // required
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              type="file"
              className="border p-2 rounded w-full"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setTaskTemplat((prev: any) => ({ ...prev, image: file }));
                }
              }}
            />
            {typeof taskTemplat.image === "string" && taskTemplat.image && (
              <div className="mt-2">
                <img
                  src={taskTemplat.image}
                  alt="Current"
                  className="h-20 object-contain"
                />
                <p className="text-sm text-gray-500">Current image</p>
              </div>
            )}
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>

          {/* Order */}
          {/* <div>
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              min="0"
              value={taskTemplat.order}
              onChange={(e) =>
                setTaskTemplat((prev: any) => ({
                  ...prev,
                  order: Number(e.target.value),
                }))
              }
              required
            />
            {errors.order && (
              <p className="text-red-500 text-sm">{errors.order}</p>
            )}
          </div> */}

          {/* Priority */}
          <div>
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              className="border px-2 py-2 rounded w-full"
              value={taskTemplat.priority}
              onChange={(e) =>
                setTaskTemplat((prev: any) => ({
                  ...prev,
                  priority: e.target.value as Priority,
                }))
              }
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p className="text-red-500 text-sm">{errors.priority}</p>
            )}
          </div>

          {/* Status */}
          {id && (
            <div>
              <Label>Status</Label>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={taskTemplat.is_active}
                    onChange={(e) =>
                      setTaskTemplat((prev: any) => ({
                        ...prev,
                        is_active: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  Active
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={taskTemplat.is_ready}
                    onChange={(e) =>
                      setTaskTemplat((prev: any) => ({
                        ...prev,
                        is_ready: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  Ready
                </label>
              </div>
            </div>
          )}

          {/* Fees */}
          <div>
            <Label htmlFor="fees">Fees</Label>
            <Input
              id="fees"
              type="text"
              value={taskTemplat.fees}
              onChange={(e) =>
                setTaskTemplat((prev: any) => ({
                  ...prev,
                  fees: e.target.value,
                }))
              }
              required
            />
            {errors.fees && (
              <p className="text-red-500 text-sm">{errors.fees}</p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <br />
          <div>
            {/* Header Row */}
            <div className="grid grid-cols-2 gap-4 font-bold text-lg text-gray-700 mb-2">
              <div>Process Template</div>
              <div>Order</div>
            </div>

            {/* Dynamic Process Rows */}
            {selectedProcesses.map((process, index) => {
              const matchedTemplate = processTemplates.find(
                (pt) => pt.id === Number(process.process_template_id)
              );
              const matchedTitle = matchedTemplate?.title || "";

              return (
                <div key={index} className="mb-4">
                  {/* Optional Label above row */}
                  {matchedTitle && (
                    <div className="text-sm font-semibold text-gray-600 mb-1">
                      GST RETURN - {matchedTitle} (Order: {process.order})
                    </div>
                  )}

                  {/* Row with dropdown and input */}
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <select
                      className="border px-2 py-2 rounded"
                      value={process.process_template_id}
                      onChange={(e) => {
                        const updated = [...selectedProcesses];
                        updated[index].process_template_id = e.target.value;
                        setSelectedProcesses(updated);
                        updateProcessTemplateIds(updated);
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
                      value={String(process.order || 0)}
                      min="0"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = Number(e.target.value);
                        if (value >= 0) {
                          const updated = [...selectedProcesses];
                          updated[index].order = value;
                          setSelectedProcesses(updated);
                          updateProcessTemplateIds(updated);
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Add Button */}
            <div className="mt-2">
              <button
                type="button"
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => {
                  const newProcess = {
                    process_template_id: "",
                    order: selectedProcesses.length,
                  };
                  const updated = [...selectedProcesses, newProcess];
                  setSelectedProcesses(updated);
                  updateProcessTemplateIds(updated);
                }}
              >
                <span className="text-lg font-bold mr-1">+</span> Add Process
                Template
              </button>
            </div>
          </div>
        </div>

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
              onClick={() => navigate("/task-templates-list")}
              className="px-6 py-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </ComponentCard>
    </form>
  );
};

export default TaskTemplatForm;
