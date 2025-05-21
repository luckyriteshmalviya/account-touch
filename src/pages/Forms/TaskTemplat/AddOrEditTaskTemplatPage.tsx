import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import TaskTemplatForm from "./TaskTemplatForm";
import {
  addTaskTemplatService,
  updateTaskTemplatService,
  getTaskTemplatDetailsService,
  getTaskTemplatCategory
} from "../../../services/restApi/taskTemplat";
import {
  getProcessTemplatListService,
} from "../../../services/restApi/processTemplat";

interface ProcessTemplate {
  id: number;
  name: string;
  process_type: string;
  title: string
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
    priority: "low" as Priority, // cast here if needed
    fees: "",
    process_templates: ''
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [processtype, setprocesstype] = useState("");
  const [processTemplates, setProcessTemplates] = useState<ProcessTemplate[]>([]);

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
        const res = await getProcessTemplatListService({ page, search, processtype });
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
          let obj = '[{"title":"GST Ret Q P","process_type":"questionnaire","process_template_id":"26b62df7-4f91-48d8-8ddd-22515857869d","order":1},{"title":"IT RETURN User Document PT","process_type":"documentation","process_template_id":"b3c8c87d-3f0d-47bd-b665-415c49da7304","order":2},{"title":"IT RETURN Payment","process_type":"payment","process_template_id":"2e1002d8-e83e-426b-a641-71bd8bf769db","order":3},{"title":"IT RETURN Final Document PT","process_type":"document_preparation","process_template_id":"e4e9bbeb-211a-4274-854e-ecccbb38b85f","order":4}]';
          setTaskTemplat({
            title: data?.title || "",
            description: data?.description || "",
            image: data?.image || "",
            category_id: data?.category?.id || 0,
            is_active: data?.is_active,
            is_ready: data?.is_ready,
            order: data?.order || 0,
            priority: (data?.priority as Priority) || "low",
            fees: data?.fees || "",
            process_templates: JSON.parse(data?.process_templates) || ""
          });
        } catch (error) {
          Swal.fire("Error", "Failed to load template details", "error");
        }
      })();
    }
  }, [id, isEdit]);

  const handleCreateTaskTemplate = async (formData: FormData) => {
    try {
      const service = isEdit
        ? updateTaskTemplatService(id as string, taskTemplat)
        : addTaskTemplatService(formData);

      const response = await service;

      if (response?.id) {
        await Swal.fire({
          icon: "success",
          title: `Task Template ${isEdit ? "Updated" : "Created"}`,
          timer: 2000,
          showConfirmButton: false
        });
        navigate("/task-templates-list");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
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
    />
  );
}
