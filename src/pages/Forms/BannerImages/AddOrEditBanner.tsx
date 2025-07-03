import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  addBannerService,
  getBannerDetailsService,
  updateBannerServicePatch,
} from "../../../services/restApi/bannerImages";
import BannerForm from "./BannerImageForm";

export default function AddOrEditBannerPage() {
  const [banner, setBanner] = useState({
    title: "",
    is_active: true,
    image: null as File | null,
    imageUrl: "",
  });

  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const data = await getBannerDetailsService(id as string);
          setBanner({
            title: data.title || "",
            is_active: data.is_active,
            image: null,
            imageUrl: data.image || "",
          });
        } catch (error) {
          console.error("Error fetching banner details:", error);
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch banner details.",
          });
        }
      })();
    }
  }, [id, isEdit]);

  const handleSubmit = async () => {
    if (!banner.title.trim()) {
      await Swal.fire("Validation Error", "Banner title is required!", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", banner.title);
    formData.append("is_active", banner.is_active.toString());

    // For edit mode: only append image if a new one is selected
    // For add mode: append image if available
    if (banner.image) {
      formData.append("image", banner.image);
    } else if (!isEdit) {
      // For add mode, if no image selected, we might need to handle this
      // but let's see if the server accepts it
    }

    try {
      let result;

      if (isEdit) {
        // Try with PATCH first for partial updates
        result = await updateBannerServicePatch(id as string, formData);
      } else {
        result = await addBannerService(formData);
      }

      if (result?.id) {
        await Swal.fire(
          "Success",
          `Banner ${isEdit ? "updated" : "added"} successfully!`,
          "success"
        );
        navigate("/banner-images");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Error submitting banner:", error);
      await Swal.fire(
        "Error",
        "Something went wrong. Please try again.",
        "error"
      );
    }
  };

  return (
    <BannerForm
      banner={banner}
      setBanner={setBanner}
      onSubmit={handleSubmit}
      editMode={isEdit}
    />
  );
}
