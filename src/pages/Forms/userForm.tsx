import React, { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Switch from "../../components/form/switch/Switch";
import { rolesOptions } from "../../constants/arrays";
import Select from "react-select";
import { useNavigate, useParams } from "react-router";

interface UserFormProps {
  id?: string | undefined;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  selectedRoles: { value: string; label: string } | null;
  setSelectedRoles: any;
  assignedTo?: any;
  setAssignedTo: React.Dispatch<React.SetStateAction<string[]>>;
  submitForm?: () => void;
  assignedToOptions?: any[];
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
}: UserFormProps) => {
  const [editMode, setEditMode] = React.useState(false);

  const param = useParams<{ id: string }>();

  const navigate = useNavigate();
  const transformedAssignedToOptions = assignedToOptions
    ? assignedToOptions?.map((user) => ({
        label: user.full_name || user.first_name || user.email,
        value: user.id,
      }))
    : [];

  // Compute disabled logic once
  const isDisabled = !!id && !editMode;
  // Local state for switches
  const [isActive, setIsActive] = useState(user.is_active);

  // Error state for validation
  const [errors, setErrors] = useState<any>({});

  // Validation function
  const validateForm = () => {
    const newErrors: any = {};

    // Validate required fields
    if (!user.first_name) newErrors.first_name = "First Name is required";
    if (!user.email) newErrors.email = "Email is required";
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

    // If 'Maker' role is selected, ensure at least one user is assigned
    if (selectedRoles?.value === "maker" && assignedTo.length === 0) {
      newErrors.assigned_to =
        "Please assign at least one user to the 'Assigned To' field when selecting 'Maker' as a role.";
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
              <Label htmlFor="First Name">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={user.first_name}
                type="text"
                id="firstName"
                onChange={(e) =>
                  setUser((prev: any) => ({
                    ...prev,
                    first_name: e.target.value,
                  }))
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
              <Label htmlFor="Last Name">Last Name</Label>
              <Input
                value={user.last_name}
                type="text"
                id="lastName"
                onChange={(e) =>
                  setUser((prev: any) => ({
                    ...prev,
                    last_name: e.target.value,
                  }))
                }
                disabled={isDisabled}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 ">
            <div className="space-y-6">
              <Label htmlFor="Email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                value={user.email}
                type="text"
                id="email"
                onChange={(e) =>
                  setUser((prev: any) => ({ ...prev, email: e.target.value }))
                }
                disabled={isDisabled}
              />
              {errors.email && (
                <p className="text-red-500 text-sm" id="email">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <Label htmlFor="Phone Number">
                {" "}
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                value={user.phone_number}
                type="text"
                id="phoneNumber"
                onChange={(e) => {
                  // console.log("Phone number input:",e.target.value, Number(e.target.value));
                  // if (Number(e.target.value)) {
                  //   setErrors((prev: any) => ({
                  //     ...prev,
                  //     phone_number: "Phone number must be numerical",
                  //   }));
                  //   return;
                  // }

                  setUser((prev: any) => ({
                    ...prev,
                    phone_number: e.target.value,
                  }));
                }}
                disabled={isDisabled}
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm" id="phone_number">
                  {errors.phone_number}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <Label htmlFor="Date of Birth">Date of Birth</Label>
              <Input
                value={user.date_of_birth}
                type="date"
                id="dateOfBirth"
                onChange={(e) =>
                  setUser((prev: any) => ({
                    ...prev,
                    date_of_birth: e.target.value,
                  }))
                }
                disabled={isDisabled}
              />
            </div>
          </div>
          {/* {!hideFields && (
            <div className="space-y-6">
              <Label htmlFor="Bio">Bio</Label>
              <Input
                value={user.bio}
                type="text"
                id="bio"
                onChange={(e) =>
                  setUser((prev: any) => ({
                    ...prev,
                    bio: e.target.value,
                  }))
                }
                disabled={isDisabled}
              />
            </div>
          )} */}
          {/* {!hideFields && (
            <div className="space-y-6">
              <Label htmlFor="Country">Country</Label>
              <select
                id="country"
                value={user.country}
                onChange={(e) =>
                  setUser((prev: any) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
                disabled={isDisabled}
                className="border p-2 w-full rounded"
              >
                <option value="">Select Country</option>
                <option value="india">india</option>
                <option value="united states">united states</option>
                <option value="united kingdom">united kingdom</option>
                <option value="canada">canada</option>
                <option value="australia">australia</option>
                <option value="germany">germany</option>
                <option value="france">france</option>
                <option value="italy">italy</option>
                <option value="spain">spain</option>
                <option value="japan">japan</option>
                <option value="china">china</option>
                <option value="russia">russia</option>
                <option value="brazil">brazil</option>
                <option value="mexico">mexico</option>
                <option value="singapore">singapore</option>
                <option value="malaysia">malaysia</option>
                <option value="indonesia">indonesia</option>
                <option value="thailand">thailand</option>
                <option value="vietnam">vietnam</option>
                <option value="philippines">philippines</option>
                <option value="south korea">south korea</option>
                <option value="new zealand">new zealand</option>
                <option value="united arab emirates">
                  united arab emirates
                </option>
                <option value="saudi arabia">saudi arabia</option>
              </select>
            </div>
          )} */}
        </ComponentCard>

        <ComponentCard title="Roles and Responsibilities">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <Label htmlFor="roles">Roles</Label>
              <Select
                id="roles"
                name="roles"
                value={selectedRoles}
                options={rolesOptions}
                onChange={(values: any) => setSelectedRoles(values)}
                closeMenuOnSelect={true}
                isSearchable
              />

              {errors.roles && (
                <p className="text-red-500 text-sm" id="first_name">
                  {errors.roles}
                </p>
              )}
            </div>
            { (selectedRoles?.value === "client" || selectedRoles?.value === "maker")  && (
              <div className="space-y-6">
                <Label htmlFor="Assigned To">
                  Assigned To <span className="text-red-500">*</span>
                </Label>
                <Select
                  id="assignedTo"
                  // value={transformedAssignedToOptions.filter((option: any) =>
                  //   assignedTo.includes(option.value)
                  // )}
                  value={assignedTo}
                  name="Assigned To"
                  options={transformedAssignedToOptions}
                  onChange={(values: any) => {
                    setErrors({});
                    setAssignedTo(values);
                  }}
                  closeMenuOnSelect={true}
                  isSearchable
                />

                {errors.assigned_to && (
                  <p className="text-red-500 text-sm" id="assigned_to">
                    {errors.assigned_to}
                  </p>
                )}
              </div>
            )}
          </div>
        </ComponentCard>

        {param.id && (
          <ComponentCard title="Status">
            <div className="flex gap-4 justify-between">
              <Switch
                label="Active"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
                disabled={isDisabled}
              />
            </div>
          </ComponentCard>
        )}

        <ComponentCard title="PAN Details">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "PAN Card Number", field: "pan_card" },
              // { label: "Password", field: "password" },
              { label: "Name as per PAN Card", field: "name_as_per_pan_card" },
              { label: "Aadhar Card Number", field: "aadhar_card" },
            ]
              .filter(({ field }) => !(field === "password"))
              .map(({ label, field }) => (
                <div className="space-y-6" key={field}>
                  <Label htmlFor={field}>{label}</Label>
                  <Input
                    value={user[field]}
                    type="text"
                    id={field}
                    onChange={(e) =>
                      setUser((prev: any) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    disabled={isDisabled}
                  />
                </div>
              ))}
          </div>
        </ComponentCard>

        <ComponentCard title="GST Details">
          <div className="grid grid-cols-2 gap-6 ">
            {[
              { label: "GST Number", field: "gst_number" },
              { label: "GST Portal Login", field: "gst_site_login" },
              { label: "GST Portal Password", field: "gst_site_password" },
            ].map(({ label, field }) => (
              <div className="space-y-6" key={field}>
                <Label htmlFor={field}>{label}</Label>
                <Input
                  value={user[field]}
                  type="text"
                  id={field}
                  onChange={(e) =>
                    setUser((prev: any) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  disabled={isDisabled}
                />
              </div>
            ))}
          </div>
        </ComponentCard>

        {param.id && (
          <ComponentCard title="Created By">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <Label htmlFor="Creator First Name">Creator First Name</Label>
                <Input
                  value={user.created_by?.first_name}
                  type="text"
                  disabled={isDisabled}
                  id="creatorFirstName"
                />
              </div>
              <div className="space-y-6">
                <Label htmlFor="Creator Last Name">Creator Last Name</Label>
                <Input
                  value={user.created_by?.last_name}
                  type="text"
                  id="creatorLastName"
                  disabled={isDisabled}
                />
              </div>
            </div>
            {/* {!hideFields && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="space-y-6">
                <Label htmlFor="Creator Email">Creator Email</Label>
                <Input
                  value={user?.created_by?.email}
                  type="text"
                  id="creatorEmail"
                  disabled={isDisabled}
                />
              </div>
            </div>
          )} */}
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
                onClick={() => setEditMode(true)}
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
