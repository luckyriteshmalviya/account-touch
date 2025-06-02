import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import QuestionnairesForm from "./QuestionnairesForm";
import {
  addQuestionnairesService,
  updateQuestionnairesService,
  getQuestionnairesDetailsService,
} from "../../../services/restApi/Questionnaires";
import { getQuestionListService } from "../../../services/restApi/Questions";

export default function AddOrEditQuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState({
    title: "",
    description: "",
    is_active: true,
  });

  const [questions, setQuestions] = useState<any[]>([]); // Assuming questions is an array of objects

  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([
    {
      value: "",
      label: "",
      type: "",
    },
  ]);

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
      questions: selectedQuestions,
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

  useEffect(() => {
    try {
      // Fetching questions from the API or any other source
      const fetchQuestions = async () => {
        // Simulating an API call
        const response = await getQuestionListService({});
        setQuestions(response.results || []);
      };

      fetchQuestions();
    } catch (error) {
      console.error("Error fetching questions:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch questions.",
      });
    }
  }, []);

  return (
    <QuestionnairesForm
      questionnaires={questionnaires}
      setQuestionnaires={setQuestionnaires}
      onSubmit={handleSubmit}
      editMode={isEdit}
      questions={questions}
      selectedQuestions={selectedQuestions}
      setSelectedQuestions={setSelectedQuestions}
    />
  );
}
