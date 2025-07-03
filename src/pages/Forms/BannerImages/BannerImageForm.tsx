import React, { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { useNavigate } from "react-router";

interface BannerFormProps {
  banner: {
    title: string;
    is_active: boolean;
    image: File | null;
    imageUrl: string;
  };
  setBanner: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  editMode?: boolean;
}

const BannerForm = ({
  banner,
  setBanner,
  onSubmit,
  editMode = false,
}: BannerFormProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; image?: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (banner.image) {
      const filePreview = URL.createObjectURL(banner.image);
      setPreview(filePreview);
      return () => URL.revokeObjectURL(filePreview);
    } else if (banner.imageUrl) {
      setPreview(banner.imageUrl);
    } else {
      setPreview(null);
    }
  }, [banner.image, banner.imageUrl]);

  const validate = () => {
    const newErrors: { title?: string; image?: string } = {};
    if (!banner.title.trim()) newErrors.title = "Title is required.";
    if (!banner.image && !editMode) newErrors.image = "Image is required.";
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
      <ComponentCard title={editMode ? "Edit Banner" : "Add New Banner"}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="title"
              value={banner.title}
              onChange={(e) =>
                setBanner((prev: any) => ({ ...prev, title: e.target.value }))
              }
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={banner.is_active}
                onChange={(e) =>
                  setBanner((prev: any) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
              />
              <span>Active</span>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">
              Image {editMode ? "" : <span className="text-red-500">*</span>}
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
              onChange={(e) =>
                setBanner((prev: any) => ({
                  ...prev,
                  image: e.target.files?.[0] || null,
                }))
              }
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <div className="mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editMode ? "Save Changes" : "Add Banner"}
            </button>
          </div>

          {editMode && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate("/banner-image-list")}
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

export default BannerForm;
