import React, { useEffect, useState } from "react";
import { UserForm } from "./userForm";
import {
  addUserService,
  fetchAssignedToList,
} from "../../services/restApi/user";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

export const AddUserForm = () => {
  const navigate = useNavigate();
  const localStorageProfile = localStorage.getItem("auth");
  const parsedProfile = JSON.parse(localStorageProfile || "{}");

  const [user, setUser] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    profile_picture: "",
    bio: "",
    country: "india",
    password: "",
    pan_card: "",
    name_as_per_pan_card: "",
    aadhar_card: "",
    gst_number: "",
    gst_site_login: "",
    gst_site_password: "",
    is_active: true,
    created_by: {
      first_name: parsedProfile?.user?.first_name || "",
      last_name: parsedProfile?.user?.last_name || "",
      email: parsedProfile?.user?.email || "",
    },
  });

  const [selectedRoles, setSelectedRoles] = React.useState({
    value: "",
    label: "",
  });
  const [assignedTo, setAssignedTo] = React.useState<any>([]);

  const submitForm = async () => {
    // Check if 'Maker' role (represented by value "3") is selected and AssignedTo is empty
    if (selectedRoles.value === "maker" && assignedTo.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please assign at least one user to the 'Assigned To' field when selecting 'Maker' as a role.",
      });
      return;
    }

    const payload = {
      ...user,
      role_names: selectedRoles.value,
      assigned_to_id: assignedTo.value,
    };
    if (payload.role_names !== "maker" && payload.role_names !== "client") {
      delete payload.assigned_to_id;
    }

    const res = await addUserService(payload);

    if (res && res.id) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User added successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/user-list");
    } else {
      // Validation error handle here
      if (res && typeof res === "object") {
        const errorMessages = Object.values(res).flat().join("\n"); // join all errors with new line
        Swal.fire({
          icon: "error",
          title: "Add Failed!",
          text: errorMessages || "Something went wrong while adding the user!",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Add Failed!",
          text: "Something went wrong while adding the user!",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    }
  };

  const [assignedToOptions, setAssignedToOptions] = useState<any[]>([]);

  useEffect(() => {
    if (selectedRoles.value === "maker") {
      // If 'Maker' role is selected, fetch users for 'Assigned To'
      const fetchAssignedToUsers = async () => {
        try {
          const response = await fetchAssignedToList("Checker");
          setAssignedToOptions(response.results || []); // Assuming the API returns an array of users in 'results'
        } catch (error) {
          console.error("Error fetching assigned users:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch users for 'Assigned To'. Please remove 'Maker' role and try again.",
          });
        }
      };
      fetchAssignedToUsers();
    }

    if (selectedRoles.value === "client") {
      // If 'Maker' role is selected, fetch users for 'Assigned To'
      const fetchAssignedToUsers = async () => {
        try {
          const response = await fetchAssignedToList("Franchise");
          setAssignedToOptions(response.results || []); // Assuming the API returns an array of users in 'results'
        } catch (error) {
          console.error("Error fetching assigned users:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch users for 'Assigned To'. Please remove 'Client' role and try again.",
          });
        }
      };
      fetchAssignedToUsers();
    }
  }, [selectedRoles]);

  return (
    <UserForm
      user={user}
      setUser={setUser}
      selectedRoles={selectedRoles}
      setSelectedRoles={setSelectedRoles}
      assignedTo={assignedTo}
      setAssignedTo={setAssignedTo}
      submitForm={submitForm}
      assignedToOptions={assignedToOptions}
    />
  );
};
