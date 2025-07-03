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
    steps: [{ id: null, step_text: "", description: "" }],
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
              id: s.id,
              step_text: s.step_text,
              description: s.description,
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
      id: id!,
      title: form.title,
      description: form.description,
      step_ids: form.steps
        .filter((s) => s.id !== null) // only pick steps with valid id
        .map((s) => s.id as number),
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
