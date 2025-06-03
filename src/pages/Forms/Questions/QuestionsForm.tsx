import React, { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import { useNavigate } from "react-router";

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
  multipleChoice: {
    text: string;
    order: number;
    question: number;
    modified?: boolean;
  }[];
  setMultipleChoice: React.Dispatch<
    React.SetStateAction<{ text: string; order: number; question: number }[]>
  >;
}

const QuestionsForm = ({
  question,
  setQuestion,
  onSubmit = () => {},
  editMode = false,
  multipleChoice,
  setMultipleChoice,
}: QuestionFormProps) => {
  const [errors, setErrors] = useState<{ text?: string; description?: string }>(
    {}
  );
  const navigate = useNavigate();

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
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
          <div className="space-y-2">
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
            {errors.text && (
              <p className="text-red-500 text-sm">{errors.text}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <TextArea
              rows={6}
              value={question.description || ""}
              error
              onChange={(value) =>
                setQuestion((prev) => ({ ...prev, description: value }))
              }
              className={`w-full p-2 border rounded ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {question.question_type === "multiple_choice" && (
            <div className="space-y-2 mb-4">
              <div>
                Multiple Choice Options
                {multipleChoice.map((choice, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      type="text"
                      value={choice.text}
                      onChange={(e) => {
                        const newChoices = [...multipleChoice];
                        newChoices[index].text = e.target.value;
                        newChoices[index].modified = true;
                        setMultipleChoice(newChoices);
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="w-full p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newChoices = multipleChoice.filter(
                          (_, i) => i !== index
                        );
                        setMultipleChoice(newChoices);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Button */}
              <div className="mt-2">
                <button
                  type="button"
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  onClick={() => {
                    const newProcess = { text: "", order: 0, question: 1 };

                    const updated = [...multipleChoice, newProcess];
                    setMultipleChoice(updated);
                    // setTaskTemplat((prev: any) => ({
                    //   ...prev,
                    //   process_templates_list: updated,
                    // }));
                  }}
                >
                  <span className="text-lg font-bold mr-1">+</span> Add Options
                </button>
              </div>
            </div>
          )}

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
            </select>
          </div>
        </div>

        {/* Submit Buttons */}
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
              onClick={() => navigate("/questions-list")}
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

export default QuestionsForm;
