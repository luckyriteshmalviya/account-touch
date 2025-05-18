import React, { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";

interface Choice {
  text: string;
  order: number;
}

// interface Question {
//   text: string;
//   description?: string;
//   is_active: boolean;
//   validation_rules?: string;
//   question_type: string;
//   choices: Choice[];
// }

interface QuestionFormProps {
  question: any;
  setQuestion: any;
  onSubmit?: () => void; // Optional, to prevent crash if undefined
  editMode?: boolean;
  onSuccess?: () => void;
}

const QuestionsForm = ({
  question,
  setQuestion,
  onSubmit = () => {}, // default fallback function
  editMode = false,
}: QuestionFormProps) => {
  const [errors, setErrors] = useState<{ text?: string; description?: string }>({});

  const validate = () => {
    const newErrors: { text?: string; description?: string } = {};
    if (!question.text.trim()) newErrors.text = "Text is required.";
    if (!question.description?.trim()) newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const handleChoiceChange = (index: number, field: keyof Choice, value: string | number) => {
    const updatedChoices:any = [...question.choices];
    updatedChoices[index][field] = field === "order" ? Number(value) : (value as string);
    setQuestion((prev:any) => ({ ...prev, choices: updatedChoices }));
  };

  const addChoice = () => {
    setQuestion((prev:any) => ({
      ...prev,
      choices: [...prev.choices, { text: "", order: 0 }],
    }));
  };

  const removeChoice = (index: number) => {
    const updatedChoices = question.choices.filter((_:any, i:number) => i !== index);
    setQuestion((prev:any) => ({ ...prev, choices: updatedChoices }));
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
            onChange={(e) => setQuestion((prev:any) => ({ ...prev, text: e.target.value }))}
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
              setQuestion((prev:any) => ({ ...prev, description: e.target.value }))
            }
            required
            className={`w-full p-2 border rounded ${errors.description ? "border-red-500" : ""}`}
            rows={4}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        {/* Question Type */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="question_type">Question Type</Label>
          <select
            id="question_type"
            value={question.question_type}
            onChange={(e) =>
              setQuestion((prev:any) => ({ ...prev, question_type: e.target.value }))
            }
            className="w-full p-2 border rounded"
          >
            <option value="Descriptive">Descriptive</option>
            <option value="Multiple Choice">Multiple Choice</option>
            <option value="Single Choice">Single Choice</option>
          </select>
        </div>

        {/* Is Active */}
        <div className="mb-6">
          <Checkbox
            id="is_active"
            checked={question.is_active}
            onChange={(e: any) =>
              setQuestion((prev:any) => ({ ...prev, is_active: !!e.target?.checked }))
            }
            label="Is Active"
            subLabel="Whether this question is currently active"
          />
        </div>

        {/* Choices (Only for non-descriptive types) */}
        {question.question_type !== "Descriptive" && (
          <div className="mb-6">
            <Label>Choices</Label>
            {question.choices.map((choice:any, index:number) => (
              <div key={index} className="flex items-center space-x-4 mb-2">
                <Input
                  placeholder="Choice text"
                  value={choice.text}
                  onChange={(e) => handleChoiceChange(index, "text", e.target.value)}
                />
                <Input
                  type="number"
                  value={choice.order}
                  onChange={(e) => handleChoiceChange(index, "order", e.target.value)}
                  className="w-20"
                />
                <button
                  type="button"
                  onClick={() => removeChoice(index)}
                  className="text-red-600 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addChoice}
              className="text-blue-600 text-sm hover:underline"
            >
              + Add another Choice
            </button>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {editMode ? "Update" : "Save"}
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={() => alert("Save and add another (Not implemented)")}
          >
            Save and add another
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={() => alert("Save and continue editing (Not implemented)")}
          >
            Save and continue editing
          </button>
        </div>
      </ComponentCard>
    </form>
  );
};

export default QuestionsForm;
