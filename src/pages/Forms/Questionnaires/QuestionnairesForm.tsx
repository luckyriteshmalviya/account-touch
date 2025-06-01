import React, { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import { useNavigate, useParams } from "react-router";
import Select from "react-select";

interface QuestionnairesFormProps {
  questionnaires: {
    title: string;
    description?: string;
    is_active: boolean;
  };
  setQuestionnaires: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  editMode?: boolean;
  questions?: any[];
  selectedQuestions?: any[];
  setSelectedQuestions?: React.Dispatch<React.SetStateAction<any[]>>;
}

const QuestionnairesForm = ({
  questionnaires,
  setQuestionnaires,
  onSubmit,
  editMode = false,
  questions = [],
  selectedQuestions = [],
  setSelectedQuestions,
}: QuestionnairesFormProps) => {
  const [errors, setErrors] = useState<{ title?: string }>({});
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

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
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
          {/* Title Field */}
          <div className="space-y-2 col-span-2">
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

          <div className="space-y-2 col-span-2">
            <Label htmlFor="description">Description</Label>
            <TextArea
              rows={6}
              value={questionnaires.description}
              error
              // onChange={(value) => setMessageTwo(value)}
              onChange={(value) =>
                setQuestionnaires((prev: any) => ({
                  ...prev,
                  description: value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="select questions">Select Questions</Label>

            <div className="space-y-2 mb-4 col-span-2">
              {selectedQuestions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between space-x-2 mb-2"
                >
                  <Select
                    id="select_questions"
                    options={questions?.map((q) => ({
                      value: q.id,
                      label: q.text,
                      type: q.question_type,
                    }))}
                    value={question || ""}
                    className="w-3/6"
                    placeholder="Select questions from the list"
                    onChange={(values: any) => {
                      const updatedQuestions = [...selectedQuestions];
                      updatedQuestions[index] = values;
                      setSelectedQuestions?.(updatedQuestions);
                    }}
                    closeMenuOnSelect={true}
                    isSearchable
                  />
                  <span>{question?.type}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newChoices = selectedQuestions.filter(
                        (_, i) => i !== index
                      );
                      setSelectedQuestions?.(newChoices);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-2">
              <button
                type="button"
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => {
                  const newProcess = { value: "", label: "", type: "" };
                  const filtered = selectedQuestions.filter(
                    (q) => q.value !== ""
                  );
                  const updated = [...filtered, newProcess];
                  setSelectedQuestions?.(updated);
                }}
              >
                <span className="text-lg font-bold mr-1">+</span> Add More
                Questions
              </button>
            </div>
          </div>

          {/* is_active Checkbox */}
          {id && (
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
                Active
              </Label>
            </div>
          )}
        </div>

        {/* Submit Button */}
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
              onClick={() => navigate("/questionnaires-list")}
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

export default QuestionnairesForm;
