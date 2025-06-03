import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProcessTemplatForm from "./ProcessTemplateForm";
import {
  addProcessTemplatService,
  updateProcessTemplatService,
  getProcessTemplatDetailsService,
} from "../../../services/restApi/processTemplate";

// Assuming you have this service for fetching questionnaire list
import { getQuestionnairesListService } from "../../../services/restApi/Questionnaires";
import { getDocumentTypeListService } from "../../../services/restApi/documentTypes";

interface Questionnaire {
  id: string;
  title: string;
}

export default function AddOrEditProcessTemplatPage() {
  const [processTemplat, setProcessTemplat] = useState({
    title: "",
    description: "",
    // questionnaire_id: "", // Add this
    process_type: "",
    created_by_id: 0, // You'll probably get this from auth/user context
  });

  const [questionnaireList, setQuestionnaireList] = useState<Questionnaire[]>(
    []
  );

  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState("");

  const [documentList, setDocumentList] = useState<any[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<any[]>([]);

  const [page] = useState(1);
  const [search] = useState("");

  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  useEffect(() => {
    if (processTemplat.process_type === "") return;

    // Fetch questionnaire list on mount
    if (processTemplat.process_type === "questionnaire") {
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
    }

    // Fetch questionnaire list on mount
    if (
      processTemplat.process_type === "documentation" ||
      processTemplat.process_type === "document_preparation" ||
      processTemplat.process_type === "payment"
    ) {
      async function fetchdocuments() {
        try {
          const data = await getDocumentTypeListService({ page, search });
          setDocumentList(data.results || []);
        } catch (error) {
          console.error("Error fetching questionnaires:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch questionnaire list.",
          });
        }
      }
      fetchdocuments();
    }
  }, [processTemplat.process_type]);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const data = await getProcessTemplatDetailsService(id as string);
          setProcessTemplat({
            title: data.title || "",
            description: data.description || "",
            // questionnaire_id: data?.questionnaire?.id || "",
            process_type: data.process_type, // dynamic now
            created_by_id: data.created_by?.id || 0,
          });

          if (data.process_type === "questionnaire") {
            setSelectedQuestionnaire(data?.questionnaire?.id || "");
          } else if (
            data.process_type === "documentation" ||
            data.process_type === "document_preparation" ||
            data.process_type === "payment"
          ) {
            const requiredDocumentIds =
              data?.required_documents.map((item: any) => item.id) || [];
            setSelectedDocumentType(requiredDocumentIds);
          }
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
    if (
      selectedQuestionnaire.length === 0 &&
      processTemplat.process_type === "questionnaire"
    ) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Questionnaire ID is required!",
      });
      return;
    }

    if (
      selectedDocumentType.length === 0 &&
      (processTemplat.process_type === "documentation" ||
        processTemplat.process_type === "document_preparation")
    ) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Select Document!",
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
    let payload;

    if (
      processTemplat.process_type === "documentation" ||
      processTemplat.process_type === "document_preparation" ||
      processTemplat.process_type === "payment"
    ) {
      payload = {
        title: processTemplat.title,
        description: processTemplat.description || "",
        process_type: processTemplat.process_type, // dynamic now
        required_document_ids: selectedDocumentType || "", // Assuming selectedDocumentType is an array
        created_by_id: parsedProfile?.user?.id,
      };
    } else {
      payload = {
        title: processTemplat.title,
        description: processTemplat.description || "",
        process_type: processTemplat.process_type, // dynamic now
        questionnaire_id: selectedQuestionnaire || "", // Assuming selectedQuestionnaire is an array
        created_by_id: parsedProfile?.user?.id,
      };
    }

    try {
      const result = isEdit
        ? await updateProcessTemplatService(id as string, payload)
        : await addProcessTemplatService(payload);

      if (result?.id) {
        await Swal.fire({
          icon: "success",
          title: `Process Template ${isEdit ? "Updated" : "Added"}`,
          text: `Process Template ${
            isEdit ? "updated" : "added"
          } successfully!`,
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
      questionnaireList={questionnaireList}
      setSelectedQuestionnaire={setSelectedQuestionnaire}
      selectedQuestionnaire={selectedQuestionnaire}
      documentList={documentList}
      setSelectedDocumentType={setSelectedDocumentType}
      selectedDocumentType={selectedDocumentType}
    />
  );
}
