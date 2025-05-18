import React, { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

interface Question {
  text: string;
  description?: string;
  question_type: string;
}

interface QuestionFormProps {
  question: Question;
  setQuestion: React.Dispatch<React.SetStateAction<Question>>;
  onSubmit?: () => void;
  editMode?: boolean;
}

const QuestionsForm = ({
  question,
  setQuestion,
  onSubmit = () => {},
  editMode = false,
}: QuestionFormProps) => {
  const [errors, setErrors] = useState<{ text?: string; description?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { text?: string; description?: string } = {};
    if (!question.text.trim()) newErrors.text = "Text is required.";
    if (!question.description?.trim())
      newErrors.description = "Description is required.";
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
      <ComponentCard title={editMode ? "Edit Question" : "Add Question"}>
        {/* Text */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="text">Text</Label>
          <Input
            id="text"
            value={question.text}
            onChange={(e) =>
              setQuestion((prev) => ({ ...prev, text: e.target.value }))
            }
            required
            className={errors.text ? "border-red-500" : ""}
          />
          {errors.text && <p className="text-red-500 text-sm">{errors.text}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={question.description || ""}
            onChange={(e) =>
              setQuestion((prev) => ({ ...prev, description: e.target.value }))
            }
            required
            className={`w-full p-2 border rounded ${
              errors.description ? "border-red-500" : ""
            }`}
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Question Type */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="question_type">Question Type</Label>
          <select
            id="question_type"
            value={question.question_type}
            onChange={(e) =>
              setQuestion((prev) => ({
                ...prev,
                question_type: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
          >
            <option value="descriptive">Descriptive</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="single_choice">Single Choice</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editMode ? "Update" : "Save"}
          </button>
        </div>
      </ComponentCard>
    </form>
  );
};

export default QuestionsForm;
