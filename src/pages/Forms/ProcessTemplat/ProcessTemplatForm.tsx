import React, { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { getQuestionnairesListService } from "../../../services/restApi/Questionnaires";


interface Questionnaire {
  id: string;
  title: string;
}

interface ProcessTemplatFormProps {
  processTemplat: {
    title: string;
    description?: string;
    questionnaire_id: string;
    process_type:string;
  };
  setProcessTemplat: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  editMode?: boolean;
  questionnaireList: Questionnaire[];  // New prop: list of questionnaires
}

const ProcessTemplatForm = ({
  processTemplat,
  setProcessTemplat,
  onSubmit,
  editMode = false,
  questionnaireList,
}: ProcessTemplatFormProps) => {
  const [errors, setErrors] = useState<{ title?: string; description?: string; questionnaire_id?: string; process_type?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; description?: string; questionnaire_id?: string } = {};

    if (!processTemplat.title.trim()) {
      newErrors.title = "Title is required.";
    }
    if (!processTemplat.description?.trim()) {
      newErrors.description = "Description is required.";
    }
    if (!processTemplat.questionnaire_id.trim()) {
      newErrors.questionnaire_id = "Questionnaire is required.";
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
      <ComponentCard title={editMode ? "Edit Process Template" : "Add New Process Template"}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              value={processTemplat.title}
              type="text"
              id="title"
              onChange={(e) =>
                setProcessTemplat((prev: any) => ({ ...prev, title: e.target.value }))
              }
              required
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Input
              value={processTemplat.description}
              type="text"
              id="description"
              onChange={(e) =>
                setProcessTemplat((prev: any) => ({ ...prev, description: e.target.value }))
              }
              required
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Questionnaire Dropdown */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="questionnaire_id">
              Questionnaire <span className="text-red-500">*</span>
            </Label>
            <select
              id="questionnaire_id"
              className="w-full border rounded px-3 py-2"
              value={processTemplat.questionnaire_id}
              onChange={(e) =>
                setProcessTemplat((prev: any) => ({ ...prev, questionnaire_id: e.target.value }))
              }
              required
            >
              <option value="">-- Select Questionnaire --</option>
              {questionnaireList.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))}
            </select>
            {errors.questionnaire_id && (
              <p className="text-red-500 text-sm">{errors.questionnaire_id}</p>
            )}
          </div>

          {/* Process type */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="process_type">
              Process Type <span className="text-red-500">*</span>
            </Label>
            <select
              id="process_type"
              className="w-full border rounded px-3 py-2"
              value={processTemplat.process_type}
              onChange={(e) =>
                setProcessTemplat((prev: any) => ({
                  ...prev,
                  process_type: e.target.value,
                }))
              }
              required
            >
              <option value="">----------</option>
              <option value="questionnaire">Questionnaire</option>
              <option value="documentation">Documentation</option>
              <option value="payment">Payment</option>
              <option value="document_preparation">Document Preparation</option>
            </select>
            {errors.process_type && (
              <p className="text-red-500 text-sm">{errors.process_type}</p>
            )}
          </div>

        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editMode ? "Save Changes" : "Add Process Template"}
          </button>
        </div>
      </ComponentCard>
    </form>
  );
};

export default ProcessTemplatForm;
