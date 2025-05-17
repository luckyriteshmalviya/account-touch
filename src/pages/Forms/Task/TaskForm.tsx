import React, { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import MultiSelect from "../../../components/form/MultiSelect";
import { priorityToOptions } from "../../../constants/arrays";
import Select from "../../../components/form/Select";

interface Category {
  id: number;
  name: string;
}

interface Template {
  id: number;
  title: string;
}

interface User {
  id: number;
  full_name: string;
  is_active: boolean;
  assigned_to?: number;
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
    checker_id: string;
    due_date: string;
  };
  setTask: React.Dispatch<React.SetStateAction<any>>;
  setPriorityTo: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit: () => void;
  editMode?: boolean;
}

const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";
  
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [makers, setMakers] = useState<User[]>([]);
  const [checkers, setCheckers] = useState<User[]>([]);
  const [selectedMaker, setSelectedMaker] = useState<User | null>(null);

  console.log("task while edit", task);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get the auth token from localStorage
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        const accessToken = auth?.access;
        
        // Use the token in the request
        const response = await fetch(
          'https://api.accountouch.com/api/tasks/categories/',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Categories API response:', data);
        // The data is in the results array
        setCategories(data.results || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch templates based on selected category
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!task.category_id) return;
      
      try {
        // Get the auth token from localStorage
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        const accessToken = auth?.access;
        
        // Use the token in the request
        const response = await fetch(
          `https://api.accountouch.com/api/tasks/task-templates/?category=${task.category_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        // The data is in the results array
        setTemplates(data.results || []);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, [task.category_id]);

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Get the auth token from localStorage
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        const accessToken = auth?.access;
        
        // Use the token in the request
        const response = await fetch(
          'https://api.accountouch.com/api/users/users/?roles__name=Client',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        // Filter only active clients (is_active) from the results array
        setClients((data.results || []).filter((client: User) => client.is_active));
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  // Fetch makers
  useEffect(() => {
    const fetchMakers = async () => {
      try {
        // Get the auth token from localStorage
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        const accessToken = auth?.access;
        
        // Use the token in the request
        const response = await fetch(
          'https://api.accountouch.com/api/users/users/?roles__name=Maker',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        // Filter only active makers (is_active) from the results array
        setMakers((data.results || []).filter((maker: User) => maker.is_active));
      } catch (error) {
        console.error("Error fetching makers:", error);
      }
    };

    fetchMakers();
  }, []);

  // Fetch checkers
  useEffect(() => {
    const fetchCheckers = async () => {
      try {
        // Get the auth token from localStorage
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        const accessToken = auth?.access;
        
        // Use the token in the request
        const response = await fetch(
          'https://api.accountouch.com/api/users/users/?roles__name=Checker',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        // Filter only active checkers from the results array
        setCheckers((data.results || []).filter((checker: User) => checker.is_active));
      } catch (error) {
        console.error("Error fetching checkers:", error);
      }
    };

    fetchCheckers();
  }, []);

  // Set checker based on selected maker
  useEffect(() => {
    if (task.maker_id && makers.length > 0) {
      const maker = makers.find(m => m.id.toString() === task.maker_id);
      setSelectedMaker(maker || null);
      
      if (maker && maker.assigned_to !== undefined && maker.assigned_to !== null) {
        // If assigned_to is populated, use it to set the checker_id
        setTask((prev: any) => ({ ...prev, checker_id: maker?.assigned_to?.toString() }));
      }
    }
  }, [task.maker_id, makers, setTask]);

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
            <Label htmlFor="category_id">Category</Label>
            {/* Debug output */}
            <div className="text-xs text-gray-500 mb-1">
              Current category_id: {task.category_id}, Categories loaded: {categories.length}
            </div>
            <Select
              options={[
                { value: "", label: "Select Category" },
                ...categories.map((category) => ({
                  value: category.id.toString(),
                  label: category.name
                }))
              ]}
              onChange={(value) => {
                console.log('Selected category:', value); // Debug log
                setTask((prev: any) => ({ 
                  ...prev, 
                  category_id: value,
                  // Reset template when category changes
                  template_id: "" 
                }));
              }}
              value={task.category_id}
              className="w-full"
              placeholder="Select Category"
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="template_id">Template</Label>
            <div className="text-xs text-gray-500 mb-1">
              Current template_id: {task.template_id}, Templates loaded: {templates.length}
            </div>
            <Select
              options={[
                { value: "", label: "Select Template" },
                ...templates.map((template) => ({
                  value: template.id.toString(),
                  label: template.title
                }))
              ]}
              onChange={(value) =>
                setTask((prev: any) => ({ ...prev, template_id: value }))
              }
              value={task.template_id}
              disabled={!task.category_id}
              className="w-full"
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
            <Label htmlFor="client_id">Client</Label>
            <div className="text-xs text-gray-500 mb-1">
              Current client_id: {task.client_id}, Clients loaded: {clients.length}
            </div>
            <Select
              options={[
                { value: "", label: "Select Client" },
                ...clients.map((client) => ({
                  value: client.id.toString(),
                  label: client.full_name
                }))
              ]}
              onChange={(value) =>
                setTask((prev: any) => ({ ...prev, client_id: value }))
              }
              value={task.client_id}
              className="w-full"
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="maker_id">Maker</Label>
            <div className="text-xs text-gray-500 mb-1">
              Current maker_id: {task.maker_id}, Makers loaded: {makers.length}
            </div>
            <Select
              options={[
                { value: "", label: "Select Maker" },
                ...makers.map((maker) => ({
                  value: maker.id.toString(),
                  label: maker.full_name
                }))
              ]}
              onChange={(value) =>
                setTask((prev: any) => ({ ...prev, maker_id: value }))
              }
              value={task.maker_id}
              className="w-full"
            />
          </div>

          <div className="space-y-6">
            <Label htmlFor="checker_id">Checker</Label>
            <div className="text-xs text-gray-500 mb-1">
              Current checker_id: {task.checker_id}, Checkers loaded: {checkers.length}
            </div>
            {selectedMaker?.assigned_to ? (
              // If maker has an assigned checker, show it as read-only
              <Input
                value={checkers.find(c => c.id === selectedMaker.assigned_to)?.full_name || "Auto-assigned"}
                type="text"
                id="checker_id"
                readOnly
                disabled
                className="bg-gray-100"
              />
            ) : (
              // Otherwise, show a dropdown for manual selection
              <Select
                options={[
                  { value: "", label: "Select Checker" },
                  ...checkers.map((checker) => ({
                    value: checker.id.toString(),
                    label: checker.full_name
                  }))
                ]}
                onChange={(value) =>
                  setTask((prev: any) => ({ ...prev, checker_id: value }))
                }
                value={task.checker_id}
                className="w-full"
              />
            )}
          </div>

          <div className="space-y-6">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              value={formatDateForInput(task.due_date)}
              type="datetime-local"
              id="due_date"
              onChange={(e) =>
                setTask((prev: any) => ({ ...prev, due_date: e.target.value }))
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
