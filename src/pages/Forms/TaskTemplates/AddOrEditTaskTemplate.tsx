import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import TaskTemplatForm from "./TaskTemplateForm";
import {
  addTaskTemplatService,
  updateTaskTemplatService,
  getTaskTemplatDetailsService,
  getTaskTemplatCategory
} from "../../../services/restApi/taskTemplate";

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
    fees: ""
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getTaskTemplatCategory();
        setCategories(res?.results || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const data = await getTaskTemplatDetailsService(id as string);
          setTaskTemplat({
            title: data.title || "",
            description: data.description || "",
            image: data.image || "",
            category_id: data.category?.id || 0,
            is_active: data.is_active,
            is_ready: data.is_ready,
            order: data.order || 0,
            priority: (data.priority as Priority) || "low",
            fees: data.fees || ""
          });
        } catch (error) {
          Swal.fire("Error", "Failed to load template details", "error");
        }
      })();
    }
  }, [id, isEdit]);

  const handleCreateTaskTemplate  = async (formData: FormData) => {
    try {
      console.log(taskTemplat)
      const service = isEdit
        ? updateTaskTemplatService(id as string, formData)
        : addTaskTemplatService(taskTemplat);

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
    />
  );
}
