import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProcessTemplatForm from "./ProcessTemplatForm";
import {
  addProcessTemplatService,
  updateProcessTemplatService,
  getProcessTemplatDetailsService,
} from "../../../services/restApi/processTemplat";

// Assuming you have this service for fetching questionnaire list
import { getQuestionnairesListService } from "../../../services/restApi/Questionnaires";

interface Questionnaire {
  id: string;
  title: string;
}

export default function AddOrEditProcessTemplatPage() {
  const [processTemplat, setProcessTemplat] = useState({
    title: "",
    description: "",
    questionnaire_id: "", // Add this
    process_type:"",
    created_by_id: 0, // You'll probably get this from auth/user context
  });

  const [questionnaireList, setQuestionnaireList] = useState<Questionnaire[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch questionnaire list on mount
    async function fetchQuestionnaires() {
      try {
        const data = await getQuestionnairesListService({ page, search });
        setQuestionnaireList(data.results || []);
      } catch (error) {
        console.error("Error fetching questionnaires:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch questionnaire list.",
        });
      }
    }
    fetchQuestionnaires();
  }, []);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const data = await getProcessTemplatDetailsService(id as string);
          const localStorageProfile = localStorage.getItem("auth");
          const parsedProfile = JSON.parse(localStorageProfile || "{}");
          setProcessTemplat({
            title: data.title || "",
            description: data.description || "",
            questionnaire_id: data?.questionnaire?.id || "",
            process_type: data.process_type, // dynamic now
            created_by_id: parsedProfile?.user?.id || 0,
          });
        } catch (error) {
          console.error("Error fetching process template details:", error);
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch process template details.",
          });
        }
      })();
    }
  }, [id, isEdit]);

  const handleSubmit = async () => {
    if (!processTemplat.title.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Title is required!",
      });
      return;
    }
    if (!processTemplat.questionnaire_id.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Questionnaire ID is required!",
      });
      return;
    }
    if (!processTemplat.process_type.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Process Type is required!",
      });
      return;
    }

    const localStorageProfile = localStorage.getItem("auth");
    const parsedProfile = JSON.parse(localStorageProfile || "{}");
    const payload = {
      title: processTemplat.title,
      description: processTemplat.description || "",
      process_type: processTemplat.process_type, // dynamic now
      questionnaire_id: processTemplat.questionnaire_id,
      created_by_id: parsedProfile?.user?.id,
    };

    try {
      const result = isEdit
        ? await updateProcessTemplatService(id as string, payload)
        : await addProcessTemplatService(payload);

      if (result?.id) {
        await Swal.fire({
          icon: "success",
          title: `Process Template ${isEdit ? "Updated" : "Added"}`,
          text: `Process Template ${isEdit ? "updated" : "added"} successfully!`,
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/process-templates-list"); // or wherever
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Error submitting Process Template:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <ProcessTemplatForm
      processTemplat={processTemplat}
      setProcessTemplat={setProcessTemplat}
      onSubmit={handleSubmit}
      editMode={isEdit}
      questionnaireList={questionnaireList} // Pass list here
    />
  );
}
