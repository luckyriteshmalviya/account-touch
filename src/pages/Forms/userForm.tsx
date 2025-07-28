import React, { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Switch from "../../components/form/switch/Switch";
import { rolesOptions } from "../../constants/arrays";
import Select from "react-select";
import { useNavigate, useParams } from "react-router";

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
  created_by?: {
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

interface UserFormProps {
  id?: string | undefined;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  selectedRoles: RoleOption | null;
  setSelectedRoles: React.Dispatch<React.SetStateAction<RoleOption | any>>;
  assignedTo?: AssignedToOption | null;
  setAssignedTo: React.Dispatch<React.SetStateAction<AssignedToOption | null>>;
  submitForm?: () => void;
  assignedToOptions?: any[];
  currentUserRole?: string;
  currentUser?: any;
}

interface FormErrors {
  first_name?: string;
  email?: string;
  phone_number?: string;
  roles?: string;
  assigned_to?: string;
}

export const UserForm = ({
  id,
  user,
  setUser,
  selectedRoles,
  setSelectedRoles,
  assignedTo,
  setAssignedTo,
  submitForm,
  assignedToOptions,
  currentUserRole,
  currentUser,
}: UserFormProps) => {
  const [editMode, setEditMode] = React.useState(false);
  const param = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Filter out inactive checkers from assignedToOptions
  const activeAssignedToOptions = assignedToOptions
    ? assignedToOptions
        .filter((user) => user.is_active !== false) // Only show active users
        .map((user) => ({
          label: user.full_name || user.first_name || user.email,
          value: user.id,
        }))
    : [];

  // Compute disabled logic once
  const isDisabled = !!id && !editMode;

  // Local state for switches
  const [isActive, setIsActive] = useState(user.is_active);

  // Error state for validation
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setIsActive(user.is_active);
  }, [user.is_active]);

  // Filter roles based on current user's role
  const getFilteredRolesOptions = (): RoleOption[] => {
    if (
      currentUserRole === "super-admin" ||
      currentUserRole === "admin" ||
      currentUserRole === "super_admin"
    ) {
      return rolesOptions; // Admin can assign all roles
    }
    // Non-admin users can only add Clients
    return rolesOptions.filter((role) => role.value === "client");
  };

  // Check if assigned to should be shown - UPDATED
  const shouldShowAssignedTo = (): boolean => {
    if (!selectedRoles?.value) return false;

    // Show for maker role
    if (selectedRoles.value === "maker") return true;

    // Show for franchise role
    if (selectedRoles.value === "franchise") return true;

    // Show for client role based on current user role
    if (selectedRoles.value === "client") {
      if (currentUserRole === "franchise") return true;
      if (
        currentUserRole === "super-admin" ||
        currentUserRole === "admin" ||
        currentUserRole === "super_admin"
      ) {
        return true;
      }
    }

    // Hide for other combinations
    return false;
  };

  // Check if assigned to should be editable
  const isAssignedToEditable = (): boolean => {
    // If Franchise user is adding a Client, assigned to should be self (non-editable)
    if (selectedRoles?.value === "client" && currentUserRole === "franchise") {
      return false;
    }
    // Super admin and admin can always edit
    if (
      currentUserRole === "super-admin" ||
      currentUserRole === "admin" ||
      currentUserRole === "super_admin"
    ) {
      return true;
    }
    return true;
  };

  // Check if assigned to is mandatory
  const isAssignedToMandatory = (): boolean => {
    // Mandatory for maker role
    if (selectedRoles?.value === "maker") return true;

    // Mandatory for franchise role
    if (selectedRoles?.value === "franchise") return true;

    // Mandatory for franchise adding client
    if (selectedRoles?.value === "client" && currentUserRole === "franchise") {
      return true;
    }

    // NOT mandatory for admin/super-admin/maker/checker adding client
    if (
      selectedRoles?.value === "client" &&
      (currentUserRole === "super-admin" ||
        currentUserRole === "super_admin" ||
        currentUserRole === "admin" ||
        currentUserRole === "maker" ||
        currentUserRole === "checker")
    ) {
      return false;
    }

    return false;
  };

  // Get assigned to value based on role logic
  const getAssignedToValue = (): AssignedToOption | null => {
    if (selectedRoles?.value === "client" && currentUserRole === "franchise") {
      // Auto-assign to current user (franchise)
      return {
        label:
          currentUser?.full_name ||
          currentUser?.first_name ||
          currentUser?.email,
        value: currentUser?.id,
      };
    }
    return assignedTo || null;
  };

  // Effect to handle auto-assignment for franchise users
  useEffect(() => {
    if (
      selectedRoles?.value === "client" &&
      currentUserRole === "franchise" &&
      currentUser
    ) {
      const autoAssignValue: AssignedToOption = {
        label:
          currentUser.full_name || currentUser.first_name || currentUser.email,
        value: currentUser.id,
      };
      setAssignedTo(autoAssignValue);
    }
  }, [selectedRoles, currentUserRole, currentUser, setAssignedTo]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate required fields
    if (!user.first_name) newErrors.first_name = "First Name is required";

    if (!user.phone_number) newErrors.phone_number = "Phone Number is required";

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (user.email && !emailRegex.test(user.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Phone number validation: must contain 9 to 15 digits
    const phoneRegex = /^[0-9]{9,15}$/;
    if (user.phone_number && !phoneRegex.test(user.phone_number)) {
      newErrors.phone_number = "Phone number must contain 9-15 digits.";
    }

    // Roles validation
    if (!selectedRoles || !selectedRoles.value) {
      newErrors.roles = "Please select a role.";
    }

    // Assigned to validation - only if mandatory
    if (isAssignedToMandatory() && (!assignedTo || !assignedTo.value)) {
      if (selectedRoles?.value === "maker") {
        newErrors.assigned_to =
          "Please assign at least one user to the 'Assigned To' field when selecting 'Maker' as a role.";
      } else if (selectedRoles?.value === "franchise") {
        newErrors.assigned_to =
          "Please assign at least one user to the 'Assigned To' field when selecting 'Franchise' as a role.";
      } else if (
        selectedRoles?.value === "client" &&
        currentUserRole === "franchise"
      ) {
        newErrors.assigned_to = "Assignment is required for client role.";
      }
    }

    setErrors(newErrors);

    // Scroll to first error
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleInputChange = (field: keyof User, value: string | boolean) => {
    if (field === "phone_number" && typeof value === "string") {
      const onlyDigits = value.replace(/\D/g, "");
      if (onlyDigits.length > 10) return; // Limit to 10 digits
      setUser((prev) => ({
        ...prev,
        [field]: onlyDigits, // keep it string of digits
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error for this field as user types
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (validateForm() && submitForm) {
            submitForm();
          }
        }}
        encType="multipart/form-data"
      >
        <ComponentCard title="Personal Details">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={user.first_name}
                type="text"
                id="firstName"
                onChange={(e) =>
                  handleInputChange("first_name", e.target.value)
                }
                disabled={isDisabled}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm" id="first_name">
                  {errors.first_name}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                value={user.last_name}
                type="text"
                id="lastName"
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                disabled={isDisabled}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 ">
            <div className="space-y-6">
              <Label htmlFor="email">Email</Label>
              <Input
                value={user.email}
                type="text"
                id="email"
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isDisabled}
              />
              {errors.email && (
                <p className="text-red-500 text-sm" id="email">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <Label htmlFor="phoneNumber">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                value={user.phone_number}
                type="text"
                id="phoneNumber"
                onChange={(e) =>
                  handleInputChange("phone_number", e.target.value)
                }
                disabled={isDisabled}
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm" id="phone_number">
                  {errors.phone_number}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                value={user.date_of_birth}
                type="date"
                id="dateOfBirth"
                onChange={(e) =>
                  handleInputChange("date_of_birth", e.target.value)
                }
                disabled={isDisabled}
              />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Roles and Responsibilities">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <Label htmlFor="roles">
                Roles<span className="text-red-500">*</span>
              </Label>
              <Select
                id="roles"
                name="roles"
                value={selectedRoles}
                options={getFilteredRolesOptions()}
                onChange={(values: RoleOption | null) => {
                  setSelectedRoles(values);
                  // Clear assigned to when role changes
                  if (
                    values?.value !== "client" ||
                    currentUserRole !== "franchise"
                  ) {
                    setAssignedTo(null);
                  }
                }}
                closeMenuOnSelect={true}
                isSearchable
                isDisabled={isDisabled}
              />

              {errors.roles && (
                <p className="text-red-500 text-sm" id="roles">
                  {errors.roles}
                </p>
              )}
            </div>

            {/* Show Assigned To field based on conditions - UPDATED */}
            {
              // Show in edit/add mode if shouldShowAssignedTo returns true
              ((!isDisabled && shouldShowAssignedTo()) ||
                // Show in view mode if there's an assigned value and label
                (isDisabled &&
                  assignedTo &&
                  assignedTo.value &&
                  assignedTo.label) ||
                // Also show in view mode for roles that typically have assignments (even if null)
                (isDisabled &&
                  selectedRoles?.value &&
                  ["maker", "franchise"].includes(selectedRoles.value))) && (
                <div className="space-y-6">
                  <Label htmlFor="assignedTo">
                    Assigned To
                    {!isDisabled && isAssignedToMandatory() && (
                      <span className="text-red-500"> *</span>
                    )}
                    {!isAssignedToEditable() && (
                      <span className="text-sm text-gray-500 ml-2">
                        (Auto-assigned)
                      </span>
                    )}
                  </Label>
                  <Select
                    id="assignedTo"
                    value={getAssignedToValue()}
                    name="Assigned To"
                    options={activeAssignedToOptions}
                    onChange={(values: AssignedToOption | null) => {
                      if (isAssignedToEditable()) {
                        setErrors((prev) => ({
                          ...prev,
                          assigned_to: undefined,
                        }));
                        setAssignedTo(values);
                      }
                    }}
                    closeMenuOnSelect={true}
                    isSearchable
                    isDisabled={isDisabled || !isAssignedToEditable()}
                    placeholder={
                      assignedTo && assignedTo.label
                        ? assignedTo.label
                        : "Select"
                    }
                  />

                  {errors.assigned_to && (
                    <p className="text-red-500 text-sm" id="assigned_to">
                      {errors.assigned_to}
                    </p>
                  )}
                </div>
              )
            }
          </div>
        </ComponentCard>

        {param.id && (
          <ComponentCard title="Status">
            <div className="flex gap-4 justify-between items-center">
              <Switch
                label={
                  <span
                    className={`font-medium ${
                      isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                }
                checked={isActive}
                onChange={() => {
                  const newActiveStatus = !isActive;
                  setIsActive(newActiveStatus);
                  handleInputChange("is_active", newActiveStatus);
                }}
                disabled={isDisabled}
              />
            </div>
          </ComponentCard>
        )}

        <ComponentCard title="PAN Details">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "PAN Card Number", field: "pan_card" as keyof User },
              {
                label: "Name as per PAN Card",
                field: "name_as_per_pan_card" as keyof User,
              },
              {
                label: "Aadhar Card Number",
                field: "aadhar_card" as keyof User,
              },
            ].map(({ label, field }) => (
              <div className="space-y-6" key={field}>
                <Label htmlFor={field}>{label}</Label>
                <Input
                  value={user[field] as string}
                  type="text"
                  id={field}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  disabled={isDisabled}
                />
              </div>
            ))}
          </div>
        </ComponentCard>

        {selectedRoles?.value === "client" && (
          <ComponentCard title="GST Details">
            <div className="grid grid-cols-2 gap-6 ">
              {[
                { label: "GST Number", field: "gst_number" as keyof User },
                {
                  label: "GST Portal Login",
                  field: "gst_site_login" as keyof User,
                },
                {
                  label: "GST Portal Password",
                  field: "gst_site_password" as keyof User,
                },
              ].map(({ label, field }) => (
                <div className="space-y-6" key={field}>
                  <Label htmlFor={field}>{label}</Label>
                  <Input
                    value={user[field] as string}
                    type="text"
                    id={field}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
              ))}
            </div>
          </ComponentCard>
        )}

        {param.id && !editMode && (
          <ComponentCard title="Created By">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <Label htmlFor="creatorFirstName">Creator First Name</Label>
                <Input
                  value={user.created_by?.first_name || ""}
                  type="text"
                  disabled={isDisabled}
                  id="creatorFirstName"
                />
              </div>
              <div className="space-y-6">
                <Label htmlFor="creatorLastName">Creator Last Name</Label>
                <Input
                  value={user.created_by?.last_name || ""}
                  type="text"
                  id="creatorLastName"
                  disabled={isDisabled}
                />
              </div>
            </div>
          </ComponentCard>
        )}

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          {!id && (
            <button
              type="submit"
              className="px-8 p-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
            >
              Save
            </button>
          )}
          {id && !editMode && (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="px-8 p-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
            >
              Edit
            </button>
          )}
          {id && editMode && (
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-8 p-2 border border-1 border-green-600 bg-green-500 text-white rounded-lg"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  navigate("/user-list");
                }}
                className="px-8 p-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
