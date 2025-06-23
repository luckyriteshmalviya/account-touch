import React, { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";
import { useNavigate, useParams } from "react-router";

interface DocumentTypeFormProps {
  documentType: {
    name: string;
    description?: string;
    isActive: boolean;
  };
  setDocumentType: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  editMode?: boolean;
}

const DocumentTypeForm = ({
  documentType,
  setDocumentType,
  onSubmit,
  editMode = false,
}: DocumentTypeFormProps) => {
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {}
  );

  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { name?: string; description?: string } = {};
    if (!documentType.name.trim()) newErrors.name = "Name is required.";
    if (!documentType.description?.trim())
      newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ComponentCard
        title={editMode ? "Edit Document Type" : "Add Document Type"}
      >
        {/* Name */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="name">
            Name<span className="text-red-500">*</span>
          </Label>
          <Input
            value={documentType.name}
            type="text"
            id="name"
            onChange={(e) =>
              setDocumentType((prev: any) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            required
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="description">
            Description<span className="text-red-500">*</span>
          </Label>
          <textarea
            value={documentType.description || ""}
            id="description"
            onChange={(e) =>
              setDocumentType((prev: any) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            required
            className={`w-full p-2 border rounded ${
              errors.description ? "border-red-500" : ""
            }`}
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Is Active */}
        {id && (
          <div className="mb-6">
            <Checkbox
              id="isActive"
              checked={documentType.isActive}
              onChange={(isChecked: boolean) =>
                setDocumentType((prev: any) => ({
                  ...prev,
                  isActive: isChecked,
                }))
              }
              label="Active"
              subLabel="Whether this document type is currently active"
            />
          </div>
        )}

        {/* Action Buttons */}
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
              onClick={() => navigate("/document-type-list")}
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

export default DocumentTypeForm;
