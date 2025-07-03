import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Select from "react-select";
import { getStepsListService } from "../../../services/restApi/steps";

interface StepOption {
  label: string;
  value: number;
}

interface ProcedureStep {
  id: number | null;
  step_text: string;
  description: string;
}

interface ProcedureFormState {
  title: string;
  description: string;
  steps: ProcedureStep[];
}

interface ProcedureFormProps {
  form: ProcedureFormState;
  setForm: React.Dispatch<React.SetStateAction<ProcedureFormState>>;
  onSubmit: () => void;
  editMode?: boolean;
}

export default function ProcedureForm({
  form,
  setForm,
  onSubmit,
  editMode = false,
}: ProcedureFormProps) {
  const navigate = useNavigate();
  const [stepOptions, setStepOptions] = useState<StepOption[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getStepsListService({});
      if (res?.results) {
        setStepOptions(
          res.results.map((s: any) => ({
            label: s.step_text,
            value: s.id,
          }))
        );
      }
    })();
  }, []);

  const updateStep = (idx: number, key: string, val: any) => {
    setForm((f) => {
      const steps = [...f.steps];
      (steps[idx] as any)[key] = val;
      return { ...f, steps };
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <ComponentCard title={editMode ? "Edit Procedure" : "Add Procedure"}>
        <div className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Description</Label>
            <TextArea
              rows={4}
              value={form.description}
              onChange={(val) => setForm((f) => ({ ...f, description: val }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Steps</Label>
            {form.steps.map((s, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <div className="w-1/3">
                  <Select
                    options={stepOptions}
                    value={stepOptions.find((opt) => opt.value === s.id)}
                    onChange={(selected) => {
                      updateStep(idx, "id", selected?.value);
                      updateStep(idx, "step_text", selected?.label);
                    }}
                    placeholder="Select step"
                  />
                </div>

                <button
                  type="button"
                  className="text-red-600"
                  onClick={() =>
                    setForm((f) => {
                      const steps = f.steps.filter((_, i) => i !== idx);
                      return { ...f, steps };
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-600"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  steps: [
                    ...f.steps,
                    { id: null, step_text: "", description: "" },
                  ],
                }))
              }
            >
              + Add Step
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              {editMode ? "Save Changes" : "Save"}
            </button>
            {editMode && (
              <button
                type="button"
                className="px-6 py-2 border"
                onClick={() => navigate("/procedures-list")}
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
