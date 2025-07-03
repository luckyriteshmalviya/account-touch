import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  getStepDetailsService,
  addStepService,
  updateStepService,
} from "../../../services/restApi/steps"; // Adjust this path if needed
import StepsForm from "./StepsForm";

interface Step {
  id?: string;
  title: string;
  description?: string;
}

export default function AddOrEditSteps() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [step, setStep] = useState<Step>({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      getStepDetailsService(id)
        .then((data) => {
          if (data) {
            setStep({
              id: data.id,
              title: data.step_text || "",
              description: data.description || "",
            });
          } else {
            setError("Failed to load step.");
          }
        })
        .catch(() => setError("Error loading step"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("step_text", step.title); // corrected here
      if (step.description) formData.append("description", step.description);

      let response = null;

      if (isEdit && step.id) {
        response = await updateStepService(step.id, formData);
      } else {
        response = await addStepService(formData);
      }

      if (!response) {
        throw new Error("Step create/update failed.");
      }

      await Swal.fire({
        icon: "success",
        title: `Step ${isEdit ? "Updated" : "Added"} Successfully`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/steps-list");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: `Failed to ${isEdit ? "update" : "add"} step.`,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <StepsForm
        step={step}
        setStep={setStep}
        onSubmit={handleSubmit}
        editMode={isEdit}
      />
    </div>
  );
}
