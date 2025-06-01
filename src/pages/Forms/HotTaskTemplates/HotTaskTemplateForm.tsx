import React, { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { useNavigate } from "react-router";

interface ProcessTemplate {
  id: number;
  name: string;
  process_type: string;
  title: string;
}

type Priority = "low" | "medium" | "high";
interface TaskTemplatFormProps {
  taskTemplat: {
    title: string;
    description: string;
    image: string | File;
    category_id: number;
    is_active: boolean;
    is_ready: boolean;
    order: number;
    priority: Priority;
    fees: string;
    process_templates: any;
  };
  //   setTaskTemplat: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (formData: FormData) => void;
  editMode?: boolean;
  //   categoryList: Category[];
  processTemplates: ProcessTemplate[];
}

const HotTaskTemplatForm = ({
  taskTemplat,
  //   setTaskTemplat,
  onSubmit,
  editMode = false,
  //   categoryList,
  processTemplates,
}: TaskTemplatFormProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [timeStampToggle, setTimeStempToggle] = useState(false);

  const navigate = useNavigate();
  const [selectedProcesses, setSelectedProcesses] = useState<
    { title: any; process_type: any; process_template_id: any; order: any }[]
  >([
    {
      title: "GST Ret Q P",
      process_type: "questionnaire",
      process_template_id: 0,
      order: 0,
    },
    {
      title: "IT RETURN User Document PT",
      process_type: "documentation",
      process_template_id: 0,
      order: 0,
    },
    {
      title: "IT RETURN Payment",
      process_type: "payment",
      process_template_id: 0,
      order: 0,
    },
    {
      title: "IT RETURN Final Document PT",
      process_type: "document_preparation",
      process_template_id: 0,
      order: 0,
    },
  ]);
  const [processErrors, setProcessErrors] = useState<string>("");

  console.log(setSelectedProcesses, "setSelectedProcesses", processErrors);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!taskTemplat.title.trim()) newErrors.title = "Title is required.";
    if (!taskTemplat.description.trim())
      newErrors.description = "Description is required.";
    if (
      !taskTemplat.image ||
      (typeof taskTemplat.image === "string" && !taskTemplat.image.trim())
    ) {
      newErrors.image = "Image is required.";
    }
    if (!taskTemplat.category_id)
      newErrors.category_id = "Category is required.";
    if (!taskTemplat.priority) newErrors.priority = "Priority is required.";
    if (!taskTemplat.fees) newErrors.fees = "Fees is required.";
    if (taskTemplat.order === undefined || taskTemplat.order === null)
      newErrors.order = "Order is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProcessSelections = () => {
    // Define expected process types by index
    const expectedTypes = [
      "questionnaire",
      "documentation",
      "payment",
      "document_preparation",
    ];

    const selectedDetails = selectedProcesses.map((sel) =>
      processTemplates.find((pt) => pt.id === sel.process_template_id)
    );

    // Check for incorrect types per index
    for (let i = 0; i < expectedTypes.length; i++) {
      if (!selectedDetails[i]) {
        setProcessErrors(`Please select a process template for step ${i + 1}.`);
        return false;
      }

      if (selectedDetails[i]?.process_type !== expectedTypes[i]) {
        setProcessErrors(
          `Step ${i + 1} must be a "${expectedTypes[i]}" process type.`
        );
        return false;
      }
    }

    // Check for uniqueness
    const processTypes = selectedDetails.map((pt) => pt?.process_type);
    const orders = selectedProcesses.map((p) => p.order);

    const hasDuplicateTypes =
      new Set(processTypes).size !== processTypes.length;
    const hasDuplicateOrders = new Set(orders).size !== orders.length;

    if (hasDuplicateTypes || hasDuplicateOrders) {
      setProcessErrors("Each process type and order must be unique.");
      return false;
    }

    // All good
    setProcessErrors("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValidForm = validate();
    const isValidProcess = validateProcessSelections();

    if (isValidForm && isValidProcess) {
      const formData = new FormData();
      formData.append("title", taskTemplat.title);
      formData.append("description", taskTemplat.description);
      formData.append("category_id", taskTemplat.category_id.toString());
      formData.append("is_active", taskTemplat.is_active ? "true" : "false");
      formData.append("is_ready", taskTemplat.is_ready ? "true" : "false");
      formData.append("order", taskTemplat.order.toString());
      formData.append("priority", taskTemplat.priority);
      formData.append("fees", taskTemplat.fees);
      formData.append("process_templates", JSON.stringify(selectedProcesses));

      if (taskTemplat.image instanceof File) {
        formData.append("image", taskTemplat.image);
      }
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <ComponentCard
        title={editMode ? "Edit Task Template" : "Add New Task Template"}
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task template *</Label>

            <select
              // value={roleFilter}
              // onChange={(e) => {
              //     setRoleFilter(e.target.value);
              //     setPage(1);
              // }}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Select Role</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Checker">Checker</option>
              <option value="Maker">Maker</option>
              <option value="Franchise">Franchise</option>
              <option value="Client">Client</option>
            </select>
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Feature Order *</Label>

            <Input
              type="number"
              value={0}
              className="px-3 py-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Created By:*</Label>
            {/* <Input type="number" value={0} className="px-3 py-2 border rounded-md"/> */}
            --
          </div>

          <div className="backdrop-grayscale cursor-pointer">
            Timestamps{" "}
            <a onClick={() => setTimeStempToggle(!timeStampToggle)}>
              {timeStampToggle ? "Hide" : "Show"}
            </a>
          </div>

          {timeStampToggle ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="description">Submitted at:*</Label>
                {/* <Input type="number" value={0} className="px-3 py-2 border rounded-md"/> */}
                --
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Created at:*</Label>
                {/* <Input type="number" value={0} className="px-3 py-2 border rounded-md"/> */}
                --
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Updated at:*</Label>
                {/* <Input type="number" value={0} className="px-3 py-2 border rounded-md"/> */}
                --
              </div>
            </>
          ) : (
            <span></span>
          )}
        </div>

        {/* Submit */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editMode ? "Save Changes" : "Save"}
          </button>

          {editMode && (
            <button
              type="button"
              onClick={() => navigate("/hot-task-list")}
              className="px-6 py-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </ComponentCard>
    </form>
  );
};

export default HotTaskTemplatForm;
