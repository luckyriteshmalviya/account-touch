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
import { getProceduresListService } from "../../../services/restApi/Procedure";
// Add this import for procedures
// import { getProceduresListService } from "../../../services/restApi/procedures";

interface Questionnaire {
  id: string;
  title: string;
}

interface Procedure {
  id: string;
  title: string;
  description: string;
  steps: Array<{
    id: number;
    step_text: string;
    description: string;
  }>;
}

export default function AddOrEditProcessTemplatPage() {
  const [processTemplat, setProcessTemplat] = useState({
    title: "",
    description: "",
    process_type: "",
    created_by_id: 0, // You'll probably get this from auth/user context
  });

  const [questionnaireList, setQuestionnaireList] = useState<Questionnaire[]>(
    []
  );

  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState("");

  const [documentList, setDocumentList] = useState<any[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<any[]>([]);

  // Add procedure state
  const [procedureList, setProcedureList] = useState<Procedure[]>([]);
  const [selectedProcedure, setSelectedProcedure] = useState("");

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

    // Fetch procedure list
    if (processTemplat.process_type === "procedure") {
      async function fetchProcedures() {
        try {
          const data = await getProceduresListService({ page, search });
          setProcedureList(data.results || []);
        } catch (error) {
          console.error("Error fetching procedures:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch procedure list.",
          });
        }
      }
      fetchProcedures();
    }

    // Fetch document list
    if (
      processTemplat.process_type === "documentation" ||
      processTemplat.process_type === "document_preparation" ||
      processTemplat.process_type === "payment"
    ) {
      async function fetchdocuments() {
        try {
          const data = await getDocumentTypeListService({ page, search });
          setDocumentList(data.results || []);

          // 👇 if payment type, select "Payment Receipt"
          if (processTemplat.process_type === "payment") {
            const paymentReceiptDoc = data.results.find(
              (doc: any) => doc.name.toLowerCase() === "payment receipt" // ya jo bhi actual name API me aaye
            );
            if (paymentReceiptDoc) {
              setSelectedDocumentType([paymentReceiptDoc.id]);
            }
          }
        } catch (error) {
          console.error("Error fetching documents:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch document list.",
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
            process_type: data.process_type, // dynamic now
            created_by_id: data.created_by?.id || 0,
          });

          if (data.process_type === "questionnaire") {
            setSelectedQuestionnaire(data?.questionnaire?.id || "");
          } else if (data.process_type === "procedure") {
            setSelectedProcedure(data?.procedure?.id || "");
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
      selectedProcedure.length === 0 &&
      processTemplat.process_type === "procedure"
    ) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Procedure is required!",
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

    if (processTemplat.process_type === "questionnaire") {
      payload = {
        title: processTemplat.title,
        description: processTemplat.description || "",
        process_type: processTemplat.process_type,
        questionnaire_id: selectedQuestionnaire,
        created_by_id: parsedProfile?.user?.id,
      };
    } else if (processTemplat.process_type === "procedure") {
      payload = {
        title: processTemplat.title,
        description: processTemplat.description || "",
        process_type: "steps_procedure",
        procedure_id: selectedProcedure,
        created_by_id: parsedProfile?.user?.id,
      };
    } else if (
      processTemplat.process_type === "documentation" ||
      processTemplat.process_type === "document_preparation" ||
      processTemplat.process_type === "payment"
    ) {
      if (!selectedDocumentType.length) {
        await Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Select at least one document type.",
        });
        return;
      }

      payload = {
        title: processTemplat.title,
        description: processTemplat.description || "",
        process_type: processTemplat.process_type,
        required_document_ids: selectedDocumentType,
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
        navigate("/process-templates-list");
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
      procedureList={procedureList}
      setSelectedProcedure={setSelectedProcedure}
      selectedProcedure={selectedProcedure}
    />
  );
}
