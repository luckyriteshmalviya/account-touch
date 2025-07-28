import React, { useEffect, useState } from "react";
import { UserForm } from "./userForm";
import {
  addUserService,
  fetchAssignedToList,
} from "../../services/restApi/user";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

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
      // last_name: currentUser?.last_name || "",
      // email: currentUser?.email || "",
    },
  });

  const [selectedRoles, setSelectedRoles] = React.useState<RoleOption | null>(
    null
  );
  const [assignedTo, setAssignedTo] = React.useState<AssignedToOption | null>(
    null
  );

  const submitForm = async () => {
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

    if (
      selectedRoles?.value === "franchise" &&
      (!assignedTo || !assignedTo.value)
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please assign at least one user to the 'Assigned To' field when selecting 'Franchise' as a role.",
      });
      return;
    }

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
    const requiredFields = ["first_name", "phone_number", ""]; // add any other always-required fields here

    const cleanedUserData = Object.fromEntries(
      Object.entries(user).filter(([key, value]) => {
        const isRequired = requiredFields.includes(key);
        if (isRequired) return true; // Keep required fields even if empty
        return value !== "" && value !== null && value !== undefined;
      })
    );

    const payload: any = {
      ...cleanedUserData,
      role_names: selectedRoles?.value ? [selectedRoles.value] : [],
    };

    // FIX: Only add assigned_to_id for roles that actually need it
    // Super Admin and Admin roles should NOT have assigned_to_id
    const rolesThatNeedAssignment = ["maker", "franchise"];
    const rolesThatCanHaveOptionalAssignment = ["client"];
    const rolesWithNoAssignment = [
      "super-admin",
      "super_admin",
      "admin",
      "checker",
    ];

    // Get the current role value safely
    const currentRoleValue = selectedRoles?.value || "";

    if (rolesThatNeedAssignment.includes(currentRoleValue)) {
      // For maker and franchise, assignment is mandatory (already validated above)
      if (assignedTo && assignedTo.value) {
        payload.assigned_to_id = parseInt(assignedTo.value);
      }
    } else if (rolesThatCanHaveOptionalAssignment.includes(currentRoleValue)) {
      // For client, assignment is optional depending on current user role
      if (assignedTo && assignedTo.value) {
        payload.assigned_to_id = parseInt(assignedTo.value);
      }
      // Don't send assigned_to_id field if not assigned for client role
    }
    // For super-admin, admin, checker roles: DON'T send assigned_to_id field at all

    // console.log("Final payload:", JSON.stringify(payload, null, 2));

    try {
      const res = await addUserService(payload);
      // console.log("API Response:", JSON.stringify(res, null, 2));

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
    if (
      selectedRoles?.value === "maker" ||
      selectedRoles?.value === "franchise"
    ) {
      // If 'Maker' or 'Franchise' role is selected, fetch active Checkers for 'Assigned To'
      const fetchAssignedToUsers = async () => {
        try {
          const response = await fetchAssignedToList("Checker");
          // Filter only active checkers
          const activeCheckers = (response.results || []).filter(
            (checker: any) => checker.is_active !== false
          );
          setAssignedToOptions(activeCheckers);
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
            is_active: true, // Assuming current user is active
          },
        ];
        setAssignedToOptions(franchiseOption);
      } else if (
        currentUserRole === "super-admin" ||
        currentUserRole === "admin" ||
        currentUserRole === "super_admin"
      ) {
        // For admin roles, fetch active franchise users for client assignment
        const fetchAssignedToUsers = async () => {
          try {
            const response = await fetchAssignedToList("Franchise");
            // Filter only active franchise users
            const activeFranchises = (response.results || []).filter(
              (franchise: any) => franchise.is_active !== false
            );
            setAssignedToOptions(activeFranchises);
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
      (selectedRoles.value !== "maker" &&
        selectedRoles.value !== "client" &&
        selectedRoles.value !== "franchise")
    ) {
      setAssignedToOptions([]);
    }
  }, [selectedRoles, currentUserRole]);

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
