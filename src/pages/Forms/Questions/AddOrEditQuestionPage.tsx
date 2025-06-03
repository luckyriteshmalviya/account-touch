import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import QuestionForm from "./QuestionsForm";
import {
  getQuestionDetailsService,
  addQuestionService,
  updateQuestionService,
  addChoiceService,
  patchChoiceService,
} from "../../../services/restApi/Questions";

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

  const [multipleChoice, setMultipleChoice] = useState<
    {
      id?: string;
      text: string;
      order: number;
      question: number;
      modified?: boolean;
    }[]
  >([{ text: "", order: 0, question: 0 }]);

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

            if (data.question_type.toLowerCase() === "multiple_choice") {
              setMultipleChoice(
                data.choices.length > 0
                  ? data.choices.map((choice: any) => ({
                      id: choice.id,
                      text: choice.text,
                      order: choice.order,
                      question: data.id,
                    }))
                  : [{ text: "", order: 0, question: data.id }]
              );
            }
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
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async () => {
    const data: any = {
      text: question.text,
      description: question.description || "",
      question_type: question.question_type,
    };

    setLoading(true);
    let response = null;

    try {
      if (isEdit && question.id) {
        response = await updateQuestionService(question.id, data);
      } else {
        response = await addQuestionService(data);
      }

      if (!response || !response.id) {
        throw new Error("Question create/update failed.");
      }

      if (question.question_type === "multiple_choice") {
        const questionId = response.id;

        const choicesWithOrder = multipleChoice.map((choice, index) => ({
          ...choice,
          order: index + 1,
          question: questionId,
        }));

        for (const choice of choicesWithOrder) {
          if (choice.id) {
            console.log("choice--", choice);
            // Existing choice — if modified, patch it
            if (choice.modified) {
              await patchChoiceService(choice.id, {
                text: choice.text,
                order: choice.order,
              });
              await delay(300);
            }
          } else {
            // New choice — add it
            await addChoiceService(choice);
            await delay(300);
          }
        }
      }

      await handleSuccess();
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
        multipleChoice={multipleChoice}
        setMultipleChoice={setMultipleChoice}
      />
    </div>
  );
}
