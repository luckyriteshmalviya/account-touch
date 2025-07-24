import React, { FC, useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router";
import {
  fetchAssignedToList,
  updateUserService,
  userDetailsService,
} from "../../services/restApi/user";
import { UserForm } from "../Forms/userForm";
import Swal from "sweetalert2";
import { rolesOptions } from "../../constants/arrays";

const UserDetails: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const localStorageProfile = localStorage.getItem("auth");
  const parsedProfile = JSON.parse(localStorageProfile || "{}");

  // Extract current user info
  const currentUser = parsedProfile?.user;
  const currentUserRole = currentUser?.roles?.[0]?.slug;

  if (!id) return <Navigate to="/user-list" />;

  const [selectedRoles, setSelectedRoles] = useState({
    value: "",
    label: "",
  });
  const [assignedTo, setAssignedTo] = useState<any>(null); // Changed from [] to null
  const [user, setUser] = React.useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    roles: [],
    is_active: false,
    date_joined: "",
    last_login: "",
    created_by: {
      id: 0,
      email: "",
      first_name: "",
      last_name: "",
      full_name: "",
    },
    assigned_to_id: "",
  });

  const [assignedToOptions, setAssignedToOptions] = useState<any[]>([]);

  const submitForm = async () => {
    // Clean user data and prepare payload
    const cleanedUser = { ...user };

    // Remove all UI-only fields that shouldn't go to backend
    delete cleanedUser.assigned_to;
    delete cleanedUser.roles;
    delete cleanedUser.full_name;
    delete cleanedUser.date_joined;
    delete cleanedUser.is_verified;
    delete cleanedUser.created_by;

    const payload: any = {
      ...cleanedUser,
      role_names: selectedRoles?.value ? [selectedRoles.value] : [],
    };

    // FIX: Only add assigned_to_id if assignedTo is selected and extract the VALUE as number
    if (assignedTo && assignedTo.value) {
      payload.assigned_to_id = parseInt(assignedTo.value);
    } else {
      payload.assigned_to_id = null; // Clear assignment if nothing selected
    }

    try {
      const res = await updateUserService(payload, id);

      if (res && res.id) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User updated successfully!",
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
            title: "Update Failed!",
            text:
              errorMessages || "Something went wrong while updating the user!",
            timer: 3000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Update Failed!",
            text: "Something went wrong while updating the user!",
            timer: 3000,
            showConfirmButton: false,
          });
        }
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: "Something went wrong while updating the user!",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchUsers = async () => {
      try {
        const res = await userDetailsService(id);

        if (res.id) {
          // Update user state with fetched data
          setUser(res);

          // Set role
          setSelectedRoles(
            rolesOptions.find((role) => role.value === res?.roles[0]?.slug) || {
              value: res?.roles[0]?.slug || "",
              label: res?.roles[0]?.name || res?.roles[0]?.slug || "",
            }
          );

          // FIX: Set assignedTo properly for React Select
          if (res.assigned_to) {
            const assignedToOption = {
              value: res.assigned_to.id?.toString(),
              label:
                res.assigned_to.full_name ||
                res.assigned_to.first_name ||
                res.assigned_to.email,
            };

            setAssignedTo(assignedToOption);
          } else {
            setAssignedTo(null);
          }

          // Fetch assignedTo options based on role
          const userRole = res?.roles[0]?.slug;
          if (userRole === "maker" || userRole === "franchise") {
            try {
              const response = await fetchAssignedToList("Checker");
              const activeCheckers = (response.results || []).filter(
                (checker: any) => checker.is_active !== false
              );
              setAssignedToOptions(activeCheckers);
            } catch (error) {
              console.error("Error fetching checkers:", error);
            }
          } else if (userRole === "client") {
            if (currentUserRole === "franchise") {
              // For franchise users, auto-assign to themselves
              const franchiseOption = [
                {
                  id: currentUser?.id,
                  first_name: currentUser?.first_name,
                  last_name: currentUser?.last_name,
                  full_name: currentUser?.full_name,
                  email: currentUser?.email,
                  is_active: true,
                },
              ];
              setAssignedToOptions(franchiseOption);
            } else if (
              currentUserRole === "super-admin" ||
              currentUserRole === "admin" ||
              currentUserRole === "super_admin"
            ) {
              try {
                const response = await fetchAssignedToList("Franchise");
                const activeFranchises = (response.results || []).filter(
                  (franchise: any) => franchise.is_active !== false
                );
                setAssignedToOptions(activeFranchises);
              } catch (error) {
                console.error("Error fetching franchises:", error);
              }
            }
          } else {
            setAssignedToOptions([]);
          }
        } else {
          console.error("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUsers();
  }, [id, currentUserRole]);

  return (
    <>
      <UserForm
        id={id}
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
    </>
  );
};

export default UserDetails;
