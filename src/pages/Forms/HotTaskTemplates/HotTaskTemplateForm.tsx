import React, { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { useNavigate } from "react-router";
import { getTaskTemplatListService } from "../../../services/restApi/taskTemplate";

interface TaskTemplate {
  id: number;
  title: string;
}

interface HotTaskTemplatFormProps {
  onSubmit: (formData: {
    task_template: number;
    featured_order: number;
  }) => void;
  editMode?: boolean;
  existingData?: any;
}

const HotTaskTemplatForm = ({
  onSubmit,
  editMode = false,
  existingData,
}: HotTaskTemplatFormProps) => {
  const navigate = useNavigate();
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(0);
  const [featureOrder, setFeatureOrder] = useState<number>(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchTaskTemplates = async () => {
      try {
        const res = await getTaskTemplatListService({});
        setTaskTemplates(res?.results || []);
      } catch (error) {
        console.error("Failed to fetch task templates", error);
      }
    };

    fetchTaskTemplates();
  }, []);
  useEffect(() => {
    if (editMode && existingData) {
      setSelectedTemplateId(existingData.task_template);
      setFeatureOrder(existingData.featured_order);
    }
  }, [editMode, existingData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedTemplateId) newErrors.title = "Please select a task template.";
    if (featureOrder === null || featureOrder === undefined)
      newErrors.order = "Feature order is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        task_template: selectedTemplateId,
        featured_order: featureOrder,
      };
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ComponentCard
        title={
          editMode ? "Edit Hot Task Template" : "Add New Hot Task Template"
        }
      >
        <div className="space-y-4">
          {/* Task Template Title Dropdown */}
          <div>
            <Label>Task Template *</Label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
              className="px-3 py-2 border rounded-md w-full"
            >
              <option value="">Select Task Template</option>
              {taskTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.title}
                </option>
              ))}
            </select>
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Feature Order */}
          <div>
            <Label>Feature Order *</Label>
            <Input
              type="number"
              value={featureOrder}
              onChange={(e) => setFeatureOrder(Number(e.target.value))}
              className="px-3 py-2 border rounded-md w-full"
            />
            {errors.order && (
              <p className="text-red-500 text-sm">{errors.order}</p>
            )}
          </div>

          {/* Created By */}
          {/* <div>
            <Label>Created By</Label>
            <div className="py-2 px-3 border rounded-md bg-gray-100">--</div>
          </div> */}

          {/* Submit + Cancel */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editMode ? "Save Changes" : "Save"}
            </button>

            {editMode && (
              <button
                type="button"
                onClick={() => navigate("/hot-task-list")}
                className="px-6 py-2 border border-gray-400 hover:bg-gray-200 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </ComponentCard>
    </form>
  );
};

export default HotTaskTemplatForm;
