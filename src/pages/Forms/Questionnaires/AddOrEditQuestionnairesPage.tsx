import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import QuestionnairesForm from "./QuestionnairesForm";
import {
  addQuestionnairesService,
  updateQuestionnairesService,
  getQuestionnairesDetailsService,
} from "../../../services/restApi/Questionnaires";

export default function AddOrEditQuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState({
    title: "",
    description: "",
    is_active: true,
  });

  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const data = await getQuestionnairesDetailsService(id as string);
          setQuestionnaires({
            title: data.title || "",
            description: data.description || "",
            is_active: data.is_active ?? true,
          });
        } catch (error) {
          console.error("Error fetching questionnaire details:", error);
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch questionnaire details.",
          });
        }
      })();
    }
  }, [id, isEdit]);

  const handleSubmit = async () => {
    if (!questionnaires.title.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Questionnaire title is required!",
      });
      return;
    }

    // Simple JSON payload, no FormData
    const payload = {
      title: questionnaires.title,
      description: questionnaires.description,
      is_active: questionnaires.is_active,
    };

    try {
      const result = isEdit
        ? await updateQuestionnairesService(id as string, payload)
        : await addQuestionnairesService(payload);

      if (result?.id) {
        await Swal.fire({
          icon: "success",
          title: `Questionnaire ${isEdit ? "Updated" : "Added"}`,
          text: `Questionnaire ${isEdit ? "updated" : "added"} successfully!`,
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/questionnaires-list");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <QuestionnairesForm
      questionnaires={questionnaires}
      setQuestionnaires={setQuestionnaires}
      onSubmit={handleSubmit}
      editMode={isEdit}
    />
  );
}
