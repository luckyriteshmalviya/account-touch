import React, { useEffect, useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div>
        <Label>Title *</Label>
        <Input
          type="text"
          value={banner.title}
          onChange={(e) =>
            setBanner((prev: any) => ({ ...prev, title: e.target.value }))
          }
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div>
        <Label>Status</Label>
        <input
          type="checkbox"
          checked={banner.is_active}
          onChange={(e) =>
            setBanner((prev: any) => ({
              ...prev,
              is_active: e.target.checked,
            }))
          }
        />{" "}
        Active
      </div>

      <div>
        <Label>Image {editMode ? "" : "*"}</Label>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border mb-2"
          />
        )}
        <Input
          type="file"
          onChange={(e) =>
            setBanner((prev: any) => ({
              ...prev,
              image: e.target.files?.[0] || null,
            }))
          }
        />
        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {editMode ? "Save Changes" : "Add Banner"}
      </button>
    </form>
  );
};

export default BannerForm;
