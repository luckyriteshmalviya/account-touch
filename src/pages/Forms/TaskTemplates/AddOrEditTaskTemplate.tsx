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

export default function AddOrEditTaskTemplatPage() {
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
    process_templates_list: [] as {
      process_template_id: string;
      order: number;
    }[],
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
          // Transform the data to match the form structure
          setTaskTemplat({
            title: data?.title || "",
            description: data?.description || "",
            image: data?.image || "", // Store the image URL as string for display
            category_id: data?.category?.id || 0,
            is_active: data?.is_active ?? true,
            is_ready: data?.is_ready ?? true,
            order: data?.order || 0,
            priority: (data?.priority as Priority) || "low",
            fees: data?.fees || "",
            process_templates_list: Array.isArray(data?.process_templates)
              ? data.process_templates
              : typeof data?.process_templates === "string" &&
                data.process_templates
              ? JSON.parse(data.process_templates)
              : [],
          });

          if (data.process_templates.length > 0) {
            const processTemplaes = data.process_templates.map(
              (elem: any, index: number) => ({
                process_template_id: elem.id,
                order: index,
              })
            );

            setSelectedProcesses(processTemplaes);
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
      // For edit mode
      if (isEdit) {
        // Create a new object without the image field
        const editPayload = {
          title: taskTemplat.title,
          description: taskTemplat.description,
          category_id: taskTemplat.category_id,
          is_active: taskTemplat.is_active,
          is_ready: taskTemplat.is_ready,
          order: taskTemplat.order,
          priority: taskTemplat.priority,
          process_templates_list: taskTemplat.process_templates_list,
          fees: taskTemplat.fees,
        };

        // Only include image if it's a new file upload
        if (formData.has("image")) {
          // Use FormData for file upload
          const editFormData = new FormData();

          // Add all fields to FormData
          Object.entries(editPayload).forEach(([key, value]) => {
            if (key === "process_templates_list") {
              editFormData.append(key, JSON.stringify(value));
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
        // For add mode, use the FormData directly
        response = await addTaskTemplatService(formData);

        console.log(response, "response 9988");

        if (response?.id) {
          updateTaskTemplatService(response.id, {
            // ...response, 
            category_id: taskTemplat.category_id,
            process_templates_list: selectedProcesses.map(
              (process: any, index) =>{ 
                console.log(process, "process");
                return ({
                process_template_id: process.process_template_id,
                order: index,
              })}
            ),
          });
        }
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
