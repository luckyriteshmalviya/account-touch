import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import { useState } from "react";
import { useNavigate } from "react-router";

interface Step {
  title: string;
  description?: string;
}

interface StepsFormProps {
  step: Step;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
  onSubmit: () => void;
  editMode?: boolean;
}

export default function StepsForm({
  step,
  setStep,
  onSubmit,
  editMode = false,
}: StepsFormProps) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ title?: string }>({});

  const validate = () => {
    const newErrors: { title?: string } = {};
    if (!step.title.trim()) newErrors.title = "Title is required.";
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
      <ComponentCard title={editMode ? "Edit Step" : "Add Step"}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">
              Title<span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={step.title}
              onChange={(e) =>
                setStep((prev) => ({ ...prev, title: e.target.value }))
              }
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <TextArea
              rows={5}
              value={step.description || ""}
              onChange={(value) =>
                setStep((prev) => ({ ...prev, description: value }))
              }
              className="w-full p-2 border rounded"
            />
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
                onClick={() => navigate("/steps-list")}
                className="px-6 py-2 border border-zinc-400 hover:bg-blue-400 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </ComponentCard>
    </form>
  );
}
