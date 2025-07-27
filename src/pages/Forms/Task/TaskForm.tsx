import React, { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import { priorityToOptions } from "../../../constants/arrays";
import Select from "../../../components/form/Select";
import SelectWithSearch from "../../../components/form/SelectWithSearch";
import { useNavigate, useParams } from "react-router";
import DatePicker from "../../../components/form/input/DatePickerInput";

const frequencyOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi_quarterly", label: "Semi Quarterly" },
  { value: "yearly", label: "Yearly" },
];

interface Category {
  id: number;
  name: string;
}

interface Template {
  id: number;
  title: string;
  description: string;
}

interface User {
  phone_number: any;
  id: number;
  full_name: string;
  is_active: boolean;
  assigned_to?: number;
  email?: string;
  phone?: string;
}

interface TaskFormProps {
  task: {
    title: string;
    description: string;
    category_id: string;
    template_id: string;
    priority: string;
    client_id: string;
    maker_id: string;
    // checker_id: string;
    completion_date: string;
    due_date: string;
    frequency_date?: string;
  };
  setTask: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  editMode?: boolean;
}

const TaskForm = ({
  task,
  setTask,
  onSubmit,
  editMode = false,
}: TaskFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [makers, setMakers] = useState<User[]>([]);

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        const accessToken = auth?.access;

        let categories: Category[] = [];
        let nextPage = `https://api.accountouch.com/api/tasks/categories/`;

        while (nextPage) {
          const response = await fetch(nextPage, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          categories = [...categories, ...(data.results || [])];
          nextPage = data.next;
        }

        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch templates based on selected category
  // Fetch templates based on selected category
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!task.category_id) return;

      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        const accessToken = auth?.access;

        let templates: Template[] = [];
        let nextPage = `https://api.accountouch.com/api/tasks/task-templates/?category=${task.category_id}`;

        while (nextPage) {
          const response = await fetch(nextPage, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          templates = [...templates, ...(data.results || [])];
          nextPage = data.next;
        }

        setTemplates(templates);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, [task.category_id]);

  // Fetch clients
  const fetchClients = async (search?: string) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      const accessToken = auth?.access;

      let clients: User[] = [];
      let nextPage = `https://api.accountouch.com/api/users/users/?roles__name=Client${
        search ? `&search=${search}` : ""
      }`;

      while (nextPage) {
        const response = await fetch(nextPage, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        clients = [...clients, ...(data.results || [])];
        nextPage = data.next; // API response me agar next page hai to yahan URL milega
      }

      setClients(clients.filter((client) => client.is_active));
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch makers
  useEffect(() => {
    // Fetch makers (with pagination)
    const fetchMakers = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        const accessToken = auth?.access;

        let makers: User[] = [];
        let nextPage = `https://api.accountouch.com/api/users/users/?roles__name=Maker`;

        while (nextPage) {
          const response = await fetch(nextPage, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          makers = [...makers, ...(data.results || [])];
          nextPage = data.next;
        }

        // Only include active makers
        setMakers(makers.filter((maker) => maker.is_active));
      } catch (error) {
        console.error("Error fetching makers:", error);
      }
    };

    fetchMakers();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <ComponentCard title={editMode ? "Edit Task" : "Add New Task"}>
        <div className="grid grid-cols-2 gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <Label htmlFor="client_id">
              Client<span className="text-red-500">*</span>
            </Label>
            <SelectWithSearch
              options={clients.map((client) => ({
                value: client.id.toString(),
                label: client.full_name,
                email: client.email,
                phone: client.phone_number,
              }))}
              placeholder="Search client..."
              value={task.client_id}
              onChange={(value) =>
                setTask((prev: any) => ({ ...prev, client_id: value }))
              }
              onSearch={fetchClients}
              showDetails={true}
              className="w-full mt-2"
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="maker_id">
              Maker<span className="text-red-500">*</span>
            </Label>
            <Select
              options={[
                ...makers.map((maker: any) => ({
                  value: maker.id.toString(),
                  label: maker.full_name,
                })),
              ]}
              onChange={(value) => {
                const selectedMaker: any = makers.find(
                  (maker: any) => maker.id.toString() === value
                );

                setTask((prev: any) => ({
                  ...prev,
                  maker_id: value,
                  checker_id: selectedMaker?.assigned_to?.id.toString(),
                }));
              }}
              value={task.maker_id}
              className="w-full mt-2"
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="category_id">
              Category<span className="text-red-500">*</span>
            </Label>
            <Select
              options={[
                ...categories.map((category) => ({
                  value: category.id.toString(),
                  label: category.name,
                })),
              ]}
              onChange={(value) => {
                setTask((prev: any) => ({
                  ...prev,
                  category_id: value,
                  // Reset template when category changes
                  template_id: "",
                }));
              }}
              value={task.category_id}
              className="w-full mt-2"
              placeholder="Select Category"
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="template_id">
              Template<span className="text-red-500">*</span>
            </Label>
            <Select
              options={[
                ...templates.map((template) => ({
                  value: template.id.toString(),
                  label: template.title,
                })),
              ]}
              onChange={(value) => {
                const selectedTemplate = templates.find(
                  (template) => template.id.toString() === value
                );

                setTask((prev: any) => ({
                  ...prev,
                  template_id: value,
                  title: selectedTemplate?.title || "",
                  description: selectedTemplate?.description || "",
                }));
              }}
              value={task.template_id}
              disabled={!task.category_id}
              className="w-full mt-2"
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="priority">Priority</Label>
            <Select
              options={[
                ...priorityToOptions.map((priority) => ({
                  value: priority.value,
                  label: priority.text,
                })),
              ]}
              onChange={(value) => {
                return setTask((prev: any) => ({ ...prev, priority: value }));
              }}
              value={task.priority}
              className="w-full mt-2"
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="completion_date">
              Completion Date<span className="text-red-500">*</span>
            </Label>
            <DatePicker
              value={task.completion_date}
              onChange={(date) =>
                setTask((prev: any) => ({ ...prev, completion_date: date }))
              }
              placeholder="Select completion date"
              className="w-full mt-2"
              required
              id="completion_date"
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="due_date">
              Due Date<span className="text-red-500">*</span>
            </Label>
            <DatePicker
              value={task.due_date}
              onChange={(date) =>
                setTask((prev: any) => ({
                  ...prev,
                  due_date: date,
                  frequency_date: date, // Auto-set frequency date same as due date
                }))
              }
              placeholder="Select due date"
              className="w-full mt-2"
              required
              id="due_date"
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="frequency_date">Frequency Date</Label>
            <DatePicker
              value={task.frequency_date || ""}
              onChange={(date) =>
                setTask((prev: any) => ({ ...prev, frequency_date: date }))
              }
              placeholder="Select frequency date"
              className="w-full mt-2"
              id="frequency_date"
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="frequency_span">Frequency Span</Label>
            <Select
              options={frequencyOptions}
              onChange={(value) =>
                setTask((prev: any) => ({ ...prev, frequency_span: value }))
              }
              placeholder="Choose frequency..."
              className="w-full mt-2"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editMode ? "Save Changes" : "Add Task"}
            </button>
          </div>

          {editMode && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate(`/tasks/view/${id}`)}
                className="px-6 p-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </ComponentCard>
    </form>
  );
};

export default TaskForm;
