import React, { useEffect, useState } from "react";
import { UserForm } from "./userForm";
import {
  addUserService,
  fetchAssignedToList,
} from "../../services/restApi/user";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  profile_picture: string;
  bio: string;
  country: string;
  password: string;
  pan_card: string;
  name_as_per_pan_card: string;
  aadhar_card: string;
  gst_number: string;
  gst_site_login: string;
  gst_site_password: string;
  is_active: boolean;
  created_by: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface RoleOption {
  value: string;
  label: string;
}

interface AssignedToOption {
  value: string;
  label: string;
}

export const AddUserForm = () => {
  const navigate = useNavigate();
  const localStorageProfile = localStorage.getItem("auth");
  const parsedProfile = JSON.parse(localStorageProfile || "{}");

  // Extract current user info
  const currentUser = parsedProfile?.user;
  const currentUserRole = currentUser?.roles?.[0]?.slug;

  const [user, setUser] = React.useState<any>({
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
      first_name: currentUser?.first_name || "",
      last_name: currentUser?.last_name || "",
      email: currentUser?.email || "",
    },
  });

  const [selectedRoles, setSelectedRoles] = React.useState<RoleOption | null>(
    null
  );
  const [assignedTo, setAssignedTo] = React.useState<AssignedToOption | null>(
    null
  );

  const submitForm = async () => {
    // Check if 'Maker' role is selected and AssignedTo is empty
    if (
      selectedRoles?.value === "maker" &&
      (!assignedTo || !assignedTo.value)
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please assign at least one user to the 'Assigned To' field when selecting 'Maker' as a role.",
      });
      return;
    }

    // Check if 'Client' role is selected by Franchise user and AssignedTo is empty
    if (
      selectedRoles?.value === "client" &&
      currentUserRole === "franchise" &&
      (!assignedTo || !assignedTo.value)
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Assignment is required when adding a Client.",
      });
      return;
    }

    const payload: any = {
      ...user,
      role_names: selectedRoles?.value,
      assigned_to_id: assignedTo?.value,
    };

    // Remove assigned_to_id for roles that don't need it
    if (
      selectedRoles?.value === "maker" ||
      selectedRoles?.value === "checker"
    ) {
      if (selectedRoles.value !== "maker") {
        delete payload.assigned_to_id;
      }
    }

    // For Maker/Checker adding client, remove assigned_to_id
    if (
      selectedRoles?.value === "client" &&
      (currentUserRole === "maker" || currentUserRole === "checker")
    ) {
      delete payload.assigned_to_id;
    }

    try {
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
          const errorMessages = Object.values(res).flat().join("\n");
          Swal.fire({
            icon: "error",
            title: "Add Failed!",
            text:
              errorMessages || "Something went wrong while adding the user!",
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
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire({
        icon: "error",
        title: "Add Failed!",
        text: "Something went wrong while adding the user!",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const [assignedToOptions, setAssignedToOptions] = useState<any[]>([]);

  useEffect(() => {
    if (selectedRoles?.value === "maker") {
      // If 'Maker' role is selected, fetch users for 'Assigned To'
      const fetchAssignedToUsers = async () => {
        try {
          const response = await fetchAssignedToList("Checker");
          setAssignedToOptions(response.results || []);
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

    if (selectedRoles?.value === "client") {
      if (currentUserRole === "franchise") {
        // For franchise users, auto-assign to themselves
        const franchiseOption = [
          {
            id: currentUser?.id,
            first_name: currentUser?.first_name,
            last_name: currentUser?.last_name,
            full_name: currentUser?.full_name,
            email: currentUser?.email,
          },
        ];
        setAssignedToOptions(franchiseOption);
      } else if (
        currentUserRole === "super-admin" ||
        currentUserRole === "admin"
      ) {
        // For admin roles, fetch franchise users for client assignment
        const fetchAssignedToUsers = async () => {
          try {
            const response = await fetchAssignedToList("Franchise");
            setAssignedToOptions(response.results || []);
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
      } else {
        // For Maker/Checker adding client, no assigned to options needed
        setAssignedToOptions([]);
      }
    }

    // Clear options when no role is selected or role doesn't need assignment
    if (
      !selectedRoles?.value ||
      (selectedRoles.value !== "maker" && selectedRoles.value !== "client")
    ) {
      setAssignedToOptions([]);
    }
  }, [selectedRoles, currentUserRole, currentUser]);

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
      currentUserRole={currentUserRole}
      currentUser={currentUser}
    />
  );
};
