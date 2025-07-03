import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProcessTemplatForm from "./ProcessTemplateForm";
import {
  addProcessTemplatService,
  updateProcessTemplatService,
  getProcessTemplatDetailsService,
} from "../../../services/restApi/processTemplate";
import { getQuestionnairesListService } from "../../../services/restApi/Questionnaires";
import { getDocumentTypeListService } from "../../../services/restApi/documentTypes";
import { getProceduresListService } from "../../../services/restApi/Procedure";

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
    created_by_id: 0,
  });

  const [questionnaireList, setQuestionnaireList] = useState<Questionnaire[]>(
    []
  );
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState("");

  const [documentList, setDocumentList] = useState<any[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<any[]>([]);

  const [procedureList, setProcedureList] = useState<Procedure[]>([]);
  const [selectedProcedure, setSelectedProcedure] = useState("");

  const page = 1;
  const search = "";

  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  // 🔵 Fetch lists based on process_type
  useEffect(() => {
    if (!processTemplat.process_type) return;

    const fetchData = async () => {
      try {
        if (processTemplat.process_type === "questionnaire") {
          const data = await getQuestionnairesListService({ page, search });
          setQuestionnaireList(data.results || []);
        }

        if (processTemplat.process_type === "procedure") {
          const data = await getProceduresListService({ page, search });
          setProcedureList(data.results || []);
        }

        if (
          ["documentation", "document_preparation", "payment"].includes(
            processTemplat.process_type
          )
        ) {
          const data = await getDocumentTypeListService({ page, search });
          setDocumentList(data.results || []);

          if (processTemplat.process_type === "payment") {
            const paymentReceiptDoc = data.results.find(
              (doc: any) => doc.name.toLowerCase() === "payment receipt"
            );
            if (paymentReceiptDoc) {
              setSelectedDocumentType([paymentReceiptDoc.id]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch data. Please try again.",
        });
      }
    };

    fetchData();
  }, [processTemplat.process_type]);

  // 🔵 Load edit data
  useEffect(() => {
    if (!isEdit) return;

    const fetchDetails = async () => {
      try {
        const data = await getProcessTemplatDetailsService(id as string);

        // Map 'steps_procedure' to 'procedure' for UI
        const mappedProcessType =
          data.process_type === "steps_procedure"
            ? "procedure"
            : data.process_type;

        setProcessTemplat({
          title: data.title || "",
          description: data.description || "",
          process_type: mappedProcessType,
          created_by_id: data.created_by?.id || 0,
        });

        if (mappedProcessType === "questionnaire") {
          setSelectedQuestionnaire(data?.questionnaire?.id || "");
        }

        if (mappedProcessType === "procedure") {
          setSelectedProcedure(data?.procedure?.id || "");
        }

        if (
          ["documentation", "document_preparation", "payment"].includes(
            mappedProcessType
          )
        ) {
          const requiredDocumentIds =
            data?.required_documents.map((item: any) => item.id) || [];
          setSelectedDocumentType(requiredDocumentIds);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch Process Template details.",
        });
      }
    };

    fetchDetails();
  }, [id, isEdit]);

  // 🔵 Submit handler
  const handleSubmit = async () => {
    if (!processTemplat.title.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Title is required!",
      });
    }

    if (
      processTemplat.process_type === "questionnaire" &&
      !selectedQuestionnaire
    ) {
      return Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Select a questionnaire!",
      });
    }

    if (processTemplat.process_type === "procedure" && !selectedProcedure) {
      return Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Select a procedure!",
      });
    }

    if (
      ["documentation", "document_preparation"].includes(
        processTemplat.process_type
      ) &&
      selectedDocumentType.length === 0
    ) {
      return Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Select document(s)!",
      });
    }

    if (!processTemplat.process_type.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Process type is required!",
      });
    }

    const localStorageProfile = localStorage.getItem("auth");
    const parsedProfile = JSON.parse(localStorageProfile || "{}");

    let payload: any = {
      title: processTemplat.title,
      description: processTemplat.description || "",
      created_by_id: parsedProfile?.user?.id,
    };

    // Dynamic payload
    if (processTemplat.process_type === "questionnaire") {
      payload.process_type = "questionnaire";
      payload.questionnaire_id = selectedQuestionnaire;
    }

    if (processTemplat.process_type === "procedure") {
      payload.process_type = "steps_procedure";
      payload.procedure_id = selectedProcedure;
    }

    if (
      ["documentation", "document_preparation", "payment"].includes(
        processTemplat.process_type
      )
    ) {
      payload.process_type = processTemplat.process_type;
      payload.required_document_ids = selectedDocumentType;
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
