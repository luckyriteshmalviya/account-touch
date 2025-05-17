import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import QuestionForm from "./QuestionsForm";
import {
  getQuestionDetailsService,
  addQuestionService,
  updateQuestionService,
} from "../../../services/restApi/questions";

interface Question {
  id?: string;
  text: string;
  description?: string;
  question_type: string;
}

export default function AddOrEditQuestionPage() {
  const [question, setQuestion] = useState<Question>({
    text: "",
    description: "",
    question_type: "descriptive",
  });

  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      getQuestionDetailsService(id)
        .then((data) => {
          if (data) {
            setQuestion({
              id: data.id,
              text: data.text || "",
              description: data.description || "",
              question_type: data.question_type?.toLowerCase() || "descriptive",
            });
          } else {
            setError("Failed to load question.");
          }
        })
        .catch(() => setError("Failed to load question."))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSuccess = async () => {
    await Swal.fire({
      icon: "success",
      title: `Question ${isEdit ? "Updated" : "Added"}`,
      text: `Question ${isEdit ? "updated" : "added"} successfully!`,
      timer: 2000,
      showConfirmButton: false,
    });
    navigate("/questions-list");
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("text", question.text);
    formData.append("description", question.description || "");
    formData.append("question_type", question.question_type);

    setLoading(true);
    let response = null;

    try {
      if (isEdit && question.id) {
        response = await updateQuestionService(question.id, formData);
      } else {
        response = await addQuestionService(formData);
      }

      if (response) {
        handleSuccess();
      } else {
        throw new Error("API returned null response");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: `Failed to ${isEdit ? "update" : "add"} question.`,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <QuestionForm
        question={question}
        setQuestion={setQuestion}
        onSubmit={handleSubmit}
        editMode={isEdit}
      />
    </div>
  );
}
