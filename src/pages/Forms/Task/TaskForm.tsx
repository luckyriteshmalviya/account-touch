import React from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import MultiSelect from "../../../components/form/MultiSelect";
import { priorityToOptions } from "../../../constants/arrays";

interface TaskFormProps {
  task: {
    title: string;
    description: string;
    category_id: string;
    template_id: string;
    status: string;
    priority: string;
    client_id: string;
    maker_id: string;
    checker_id: string;
    due_date: string;
    started_at: string;
    completed_at: string;
    maker_notes: string;
    checker_notes: string;
  };
  setTask: React.Dispatch<React.SetStateAction<any>>;
  setPriorityTo: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit: () => void;
  editMode?: boolean;
}

const formatDateForInput = (dateString: string) => {
  // Ensure dateString is in ISO 8601 format
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const TaskForm = ({ task, setTask, onSubmit, setPriorityTo, editMode = false }: TaskFormProps) => {
  console.log(task.due_date,'task1');
  console.log(task.completed_at,'task1');
  console.log(task.started_at,'task3');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <ComponentCard title={editMode ? "Edit Task" : "Add New Task"}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <Label htmlFor="title">Title</Label>
            <Input
              value={task.title}
              type="text"
              id="title"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="description">Description</Label>
            <Input
              value={task.description}
              type="text"
              id="description"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, description: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="category_id">Category ID</Label>
            <Input
              value={task.category_id}
              type="string"
              id="category_id"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, category_id: Number(e.target.value) }))
              }
              required
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="template_id">Template ID</Label>
            <Input
              value={task.template_id}
              type="string"
              id="template_id"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, template_id: Number(e.target.value) }))
              }
              required
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="status">Status</Label>
            <Input
              value={task.status}
              type="text"
              id="status"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, status: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-6">
            <MultiSelect
                label="Priority"
                options={priorityToOptions}
                defaultSelected={["2"]}
                onChange={(values) => setPriorityTo(values)}
              />
          </div>

          <div className="space-y-6">
            <Label htmlFor="client_id">Client ID</Label>
            <Input
              value={task.client_id}
              type="string"
              id="client_id"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, client_id: Number(e.target.value) }))
              }
              required
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="maker_id">Maker ID</Label>
            <Input
              value={task.maker_id}
              type="string"
              id="maker_id"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, maker_id: Number(e.target.value) }))
              }
              required
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="checker_id">Checker ID</Label>
            <Input
              value={task.checker_id}
              type="string"
              id="checker_id"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, checker_id: Number(e.target.value) }))
              }
              required
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              value={formatDateForInput(task.due_date)}  // Format the date before passing it to the input
              type="datetime-local"
              id="due_date"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, due_date: e.target.value }))
              }
              required
            />
          </div>

          {/* Started At Field */}
          <div className="space-y-6">
            <Label htmlFor="started_at">Started At</Label>
            <Input
              value={formatDateForInput(task.started_at)}  // Format the date before passing it to the input
              type="datetime-local"
              id="started_at"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, started_at: e.target.value }))
              }
              required
            />
          </div>

          {/* Completed At Field */}
          <div className="space-y-6">
            <Label htmlFor="completed_at">Completed At</Label>
            <Input
              value={formatDateForInput(task.completed_at)}  // Format the date before passing it to the input
              type="datetime-local"
              id="completed_at"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, completed_at: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="maker_notes">Maker Notes</Label>
            <Input
              value={task.maker_notes}
              type="text"
              id="maker_notes"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, maker_notes: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="checker_notes">Checker Notes</Label>
            <Input
              value={task.checker_notes}
              type="text"
              id="checker_notes"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, checker_notes: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editMode ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </ComponentCard>
    </form>
  );
};

export default TaskForm;
