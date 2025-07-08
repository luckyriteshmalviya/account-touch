import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import ProcedureForm from "./ProcedureForm";
import {
  addProcedureWithStepIdsService,
  getProcedureDetailsService,
  updateProcedureWithStepIdsService,
} from "../../../services/restApi/Procedure";

interface ProcedureStep {
  id: number | null;
  step_text: string;
  description: string;
  order: number;
}

interface ProcedureFormState {
  title: string;
  description: string;
  steps: ProcedureStep[];
}

export default function AddOrEditProcedure() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState<ProcedureFormState>({
    title: "",
    description: "",
    steps: [{ id: null, step_text: "", description: "", order: 1 }],
  });
  useEffect(() => {
    (async () => {
      if (isEdit) {
        const data = await getProcedureDetailsService(id!);
        if (data) {
          setForm({
            title: data.title,
            description: data.description,
            steps: data.steps.map((s: any) => ({
              id: s.step_id,
              step_text: s.step_text,
              description: s.description,
              order: s.order,
            })),
          });
        }
      }
    })();
  }, [isEdit, id]);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      return Swal.fire("Validation", "Title is required.", "error");
    }

    const payload = {
      title: form.title,
      description: form.description,
      step_data: form.steps
        .filter((s) => s.id !== null)
        .map((s, index) => ({
          step_id: s.id as number,
          order: s.order || index + 1,
        })),
      is_active: true,
    };

    console.log(payload);

    const res = isEdit
      ? await updateProcedureWithStepIdsService(id!, payload)
      : await addProcedureWithStepIdsService(payload);

    if (res?.id) {
      Swal.fire(
        "Success",
        `Procedure ${isEdit ? "updated" : "created"}.`,
        "success"
      );
      navigate("/procedures-list");
    } else {
      Swal.fire("Error", "Could not save.", "error");
    }
  };

  return (
    <ProcedureForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      editMode={isEdit}
    />
  );
}
