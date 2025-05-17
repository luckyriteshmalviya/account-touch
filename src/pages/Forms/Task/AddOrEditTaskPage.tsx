import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskForm from "./TaskForm";
import Swal from "sweetalert2";
import {
  addTaskService,
  getTaskDetailsService,
  updateTaskService,
} from "../../../services/restApi/task";

export default function AddOrEditTaskPage() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    category_id: "",
    template_id: "",
    priority: "medium",
    client_id: "",
    maker_id: "",
    checker_id: "",
    due_date: "",
  });

const [Priority, setPriorityTo] = React.useState<string[]>([]);

  console.log("Priority", Priority);
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      (async () => {
        const data = await getTaskDetailsService(id as string);
        if (data) {
          setTask({
            title: data.title || "",
            description: data.description || "",
            category_id: data.category.id || "",
            template_id: data.template.id || "",
            priority: data.priority || "medium",
            client_id: data?.client?.id || "",
            maker_id: data?.maker?.id || "",
            checker_id: data?.checker?.id || "",
            due_date: data.due_date || "",
          });
        }
      })();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!task.title.trim()) {
      Swal.fire("Validation Error", "Task title is required!", "warning");
      return;
    }
    if (!task.description.trim()) {
      Swal.fire("Validation Error", "Task description is required!", "warning");
      return;
    }
    if (!task.due_date) {
      Swal.fire("Validation Error", "Due date is required!", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("title", task.title);
    formData.append("description", task.description);
    formData.append("category_id", task.category_id.toString());
    formData.append("template_id", task.template_id.toString());
    formData.append("priority", task.priority);
    formData.append("client_id", task.client_id.toString());
    formData.append("maker_id", task.maker_id.toString());
    formData.append("checker_id", task.checker_id.toString());
    formData.append("due_date", task.due_date);

    const result = isEdit
      ? await updateTaskService(id as string, formData)
      : await addTaskService(formData);

    if (result?.id) {
      Swal.fire("Success", `Task ${isEdit ? "updated" : "added"} successfully!`, "success");
      navigate("/task-list");
    } else {
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  return (
    <TaskForm
      task={task}
      setTask={setTask}
      setPriorityTo={setPriorityTo}
      onSubmit={handleSubmit}
      editMode={isEdit}
    />
  );
}
