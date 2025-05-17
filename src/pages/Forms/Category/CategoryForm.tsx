import React, { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

interface CategoryFormProps {
  category: {
    name: string;
    description?: string;
    image?: File | null;
    imageUrl?: string;
  };
  setCategory: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  editMode?: boolean;
}

const CategoryForm = ({ category, setCategory, onSubmit, editMode = false }: CategoryFormProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; description?: string; image?: string }>({});

  useEffect(() => {
    if (category.image) {
      const filePreview = URL.createObjectURL(category.image);
      setPreview(filePreview);
      return () => URL.revokeObjectURL(filePreview);
    } else if (category.imageUrl) {
      setPreview(category.imageUrl);
    } else {
      setPreview(null);
    }
  }, [category.image, category.imageUrl]);

  const validate = () => {
    const newErrors: { name?: string; description?: string; image?: string } = {};

    if (!category.name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!category.description?.trim()) {
      newErrors.description = "Description is required.";
    }
    if (!category.image && !editMode) {
      newErrors.image = "Image is required.";
    }

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
      <ComponentCard title={editMode ? "Edit Category" : "Add New Category"}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={category.name}
              type="text"
              id="name"
              onChange={(e) =>
                setCategory((prev: any) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Input
              value={category.description}
              type="text"
              id="description"
              onChange={(e) =>
                setCategory((prev: any) => ({ ...prev, description: e.target.value }))
              }
              required
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="image">
              Image <span className="text-red-500">*</span>
            </Label>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border"
              />
            )}

            <Input
              type="file"
              id="image"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setCategory((prev: any) => ({
                  ...prev,
                  image: file,
                }));
              }}
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editMode ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </ComponentCard>
    </form>
  );
};

export default CategoryForm;
