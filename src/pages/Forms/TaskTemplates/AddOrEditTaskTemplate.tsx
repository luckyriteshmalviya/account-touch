import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import TaskTemplatForm from "./TaskTemplateForm";
import {
  addTaskTemplatService,
  updateTaskTemplatService,
  getTaskTemplatDetailsService,
  getTaskTemplatCategory,
} from "../../../services/restApi/taskTemplate";
import { getProcessTemplatListService } from "../../../services/restApi/processTemplate";

interface ProcessTemplate {
  id: number;
  name: string;
  process_type: string;
  title: string;
}

export default function AddOrEditTaskTemplatePage() {
  type Priority = "low" | "medium" | "high";
  const [taskTemplat, setTaskTemplat] = useState({
    title: "",
    description: "",
    image: "",
    category_id: 0,
    is_active: true,
    is_ready: true,
    order: 0,
    priority: "low" as Priority,
    fees: "",
    process_template_ids: [] as string[], // Changed from process_templates_list
  });

  const [selectedProcesses, setSelectedProcesses] = useState<
    { process_template_id: string; order: number }[]
  >([{ process_template_id: "", order: 0 }]);

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [processtype, setprocesstype] = useState("");
  const [processTemplates, setProcessTemplates] = useState<ProcessTemplate[]>(
    []
  );

  console.log(setPage, setSearch, setprocesstype);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getTaskTemplatCategory();
        setCategories(res?.results || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }

    const fetchProcessTemplates = async () => {
      try {
        const res = await getProcessTemplatListService({
          page,
          search,
          processtype,
        });
        setProcessTemplates(res?.results);
      } catch (err) {
        console.error("Error fetching process templates", err);
      }
    };

    fetchCategories();
    fetchProcessTemplates();
  }, []);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const data = await getTaskTemplatDetailsService(id as string);

          // Extract process template IDs from the response
          let processTemplateIds: string[] = [];
          let processesForState: {
            process_template_id: string;
            order: number;
          }[] = [];

          if (
            data?.process_templates &&
            Array.isArray(data.process_templates)
          ) {
            processTemplateIds = data.process_templates.map((pt: any) => pt.id);
            processesForState = data.process_templates.map(
              (pt: any, index: number) => ({
                process_template_id: pt.id,
                order: index,
              })
            );
          }

          // Transform the data to match the form structure
          setTaskTemplat({
            title: data?.title || "",
            description: data?.description || "",
            image: data?.image || "",
            category_id: data?.category?.id || 0,
            is_active: data?.is_active ?? true,
            is_ready: data?.is_ready ?? true,
            order: data?.order || 0,
            priority: (data?.priority as Priority) || "low",
            fees: data?.fees || "",
            process_template_ids: processTemplateIds, // Changed field name
          });

          if (processesForState.length > 0) {
            setSelectedProcesses(processesForState);
          }
        } catch (error) {
          console.error("Error loading template details:", error);
          Swal.fire("Error", "Failed to load template details", "error");
        }
      })();
    }
  }, [id, isEdit]);

  const handleCreateTaskTemplate = async (formData: FormData) => {
    try {
      let response;

      // Extract process template IDs from selectedProcesses (only non-empty ones)
      const processTemplateIds = selectedProcesses
        .filter((process) => process.process_template_id.trim() !== "")
        .map((process) => process.process_template_id);

      // For edit mode
      if (isEdit) {
        const editPayload = {
          title: taskTemplat.title,
          description: taskTemplat.description,
          category_id: taskTemplat.category_id,
          is_active: taskTemplat.is_active,
          is_ready: taskTemplat.is_ready,
          order: taskTemplat.order,
          priority: taskTemplat.priority,
          process_template_ids: processTemplateIds, // Send as array of IDs
          fees: taskTemplat.fees,
        };

        // Only include image if it's a new file upload
        if (formData.has("image")) {
          // Use FormData for file upload
          const editFormData = new FormData();

          // Add all fields to FormData
          Object.entries(editPayload).forEach(([key, value]) => {
            if (key === "process_template_ids") {
              // Add each ID separately for FormData array handling
              if (Array.isArray(value)) {
                value.forEach((id) => {
                  editFormData.append(key, id);
                });
              }
            } else {
              editFormData.append(key, String(value));
            }
          });

          // Add the image file from the original formData
          editFormData.append("image", formData.get("image") as File);

          response = await updateTaskTemplatService(id as string, editFormData);
        } else {
          // Use JSON if no new image
          response = await updateTaskTemplatService(id as string, editPayload);
        }
      } else {
        // For add mode, we need to modify the FormData to use the correct field name
        const newFormData = new FormData();

        // Copy all fields from original FormData except process_template_ids
        for (const [key, value] of formData.entries()) {
          if (key !== "process_template_ids") {
            newFormData.append(key, value);
          }
        }

        // Add each process template ID separately (FormData array handling)
        processTemplateIds.forEach((id) => {
          newFormData.append("process_template_ids", id);
        });

        response = await addTaskTemplatService(newFormData);
        console.log(response, "response 9988");
      }

      if (response?.id) {
        await Swal.fire({
          icon: "success",
          title: isEdit ? "Task Template Updated" : "Task Template Created",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/task-templates-list");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Error creating/updating task template:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <TaskTemplatForm
      taskTemplat={taskTemplat}
      setTaskTemplat={setTaskTemplat}
      onSubmit={handleCreateTaskTemplate}
      editMode={isEdit}
      categoryList={categories}
      processTemplates={processTemplates}
      selectedProcesses={selectedProcesses}
      setSelectedProcesses={setSelectedProcesses}
    />
  );
}
