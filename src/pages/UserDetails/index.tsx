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
// import toast from "react-hot-toast";

const UserDetails: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) return <Navigate to="/user-list" />;

  const [selectedRoles, setSelectedRoles] = useState({
    value: "",
    label: "",
  });
  const [assignedTo, setAssignedTo] = useState<any>([]);
  const [user, setUser] = React.useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    roles: [],
    is_active: false,
    // is_staff: false,
    // is_superuser: false,
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
    const payload = {
      ...user,
      roles: selectedRoles,
      assigned_to_id: assignedTo,
    };

    //   const res = await updateUserService(payload, id);

    //   // Check if response is successful and has the 'id' field
    //   if (res && res.id) {
    //     // If update is successful, show success message from API
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Success!',
    //       text: `User updated successfully!`, // Show success message here
    //       timer: 2000, // 2 seconds
    //       showConfirmButton: false, // OK button hatana
    //     });
    //     navigate("/user-list");
    //   } else {
    //     // If API returns an error or fails to update, show error message
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Update Failed!',
    //       text: res?.detail || "Something went wrong while updating the user!",
    //       timer: 2000, // 2 seconds
    //       showConfirmButton: false, // OK button hatana // Display the error message from API if available
    //     });
    //     navigate("/user-list");
    //   }
    // };
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
        const errorMessages = Object.values(res).flat().join("\n"); // join all errors with new line
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
  };

  useEffect(() => {
    if (!id) return;

    const fetchUsers = async () => {
      try {
        const res = await userDetailsService(id);

        if (res.id) {
          // Update user state with fetched data
          setUser(res); // ✅ Fix
          setSelectedRoles(
            rolesOptions.find((role) => role.value === res?.roles[0]?.slug) || {
              value: res?.roles[0]?.slug || "",
              label: res?.roles[0]?.slug || "",
            }
          );

          const assignedPerson = {
            label: res.assigned_to.full_name || "",
            value: res.assigned_to.id || "",
          };

          setAssignedTo(assignedPerson);

          if (res.assigned_to) {
            try {
              const response = await fetchAssignedToList();
              setAssignedToOptions(response.results || []); // Assuming the API returns an array of users in 'results'
            } catch (error) {
              console.error("Error fetching assigned users:", error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to fetch users for 'Assigned To'. Please remove 'Maker' role and try again.",
              });
            }
          }
        } else {
          console.error("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUsers();
  }, [id]);

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
      />
    </>
  );
};

export default UserDetails;
