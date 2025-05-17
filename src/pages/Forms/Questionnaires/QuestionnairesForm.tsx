import React, { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

interface QuestionnairesFormProps {
  questionnaires: {
    title: string;
    description?: string;
    is_active: boolean;
  };
  setQuestionnaires: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  editMode?: boolean;
}

const QuestionnairesForm = ({
  questionnaires,
  setQuestionnaires,
  onSubmit,
  editMode = false,
}: QuestionnairesFormProps) => {
  const [errors, setErrors] = useState<{ title?: string }>({});

  const validate = () => {
    const newErrors: { title?: string } = {};

    if (!questionnaires.title.trim()) {
      newErrors.title = "Title is required.";
    }

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
    <form onSubmit={handleSubmit}>
      <ComponentCard
        title={editMode ? "Edit Questionnaire" : "Add New Questionnaire"}
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              value={questionnaires.title}
              type="text"
              id="title"
              onChange={(e) =>
                setQuestionnaires((prev: any) => ({
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

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              value={questionnaires.description}
              type="text"
              id="description"
              onChange={(e) =>
                setQuestionnaires((prev: any) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {/* is_active Checkbox */}
          <div className="flex items-center space-x-3 col-span-2">
            <input
              id="is_active"
              type="checkbox"
              checked={questionnaires.is_active}
              onChange={(e) =>
                setQuestionnaires((prev: any) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
              className="w-5 h-5 rounded border-gray-300 dark:bg-gray-900 dark:border-gray-600"
            />
            <Label htmlFor="is_active" className="mb-0 cursor-pointer">
              Is Active
            </Label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editMode ? "Save Changes" : "Add Questionnaire"}
          </button>
        </div>
      </ComponentCard>
    </form>
  );
};

export default QuestionnairesForm;
