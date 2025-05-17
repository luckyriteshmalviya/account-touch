import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import QuestionForm from "./QuestionsForm";
import { getQuestionDetailsService } from "../../../services/restApi/questions";

export default function AddOrEditQuestionPage() {
  const [question, setQuestion] = useState({
    text: "",
    description: "",
    questionType: "Descriptive",
    choices: [],
    isActive: true,
  });

  const { slug } = useParams<{ slug?: string }>();
  const isEdit = !!slug;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && slug) {
      setLoading(true);
      getQuestionDetailsService(slug)
        .then((data) => {
          if (data) {
            setQuestion({
              text: data.text || "",
              description: data.description || "",
              questionType: data.question_type || "Descriptive",
              choices: data.choices || [],
              isActive: data.is_active ?? true,
              id: data.id,
            });
          } else {
            setError("Failed to load question.");
          }
        })
        .catch(() => setError("Failed to load question."))
        .finally(() => setLoading(false));
    }
  }, [slug, isEdit]);

  const handleSuccess = async () => {
    await Swal.fire({
      icon: "success",
      title: `Question ${isEdit ? "Updated" : "Added"}`,
      text: `Question ${isEdit ? "updated" : "added"} successfully!`,
      timer: 2000,
      showConfirmButton: false,
    });
    navigate("/question-list");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <QuestionForm
        question={question}
        setQuestion={setQuestion}
        onSuccess={handleSuccess}
        editMode={isEdit}
      />
    </div>
  );
}
