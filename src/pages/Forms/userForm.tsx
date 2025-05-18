import React, { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";

interface UserFormProps {
  id?: string | undefined;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setSelectedRoles: React.Dispatch<React.SetStateAction<string>>;
  setAssignedTo: React.Dispatch<React.SetStateAction<string>>;
  submitForm?: () => void;
}

export const UserForm = ({
  id,
  user,
  setUser,
  setSelectedRoles,
  setAssignedTo,
  submitForm,
}: UserFormProps) => {
  const [editMode, setEditMode] = React.useState(false);
  const [rolesOptions, setRolesOptions] = useState<{value: string, label: string}[]>([]);
  const [assignedToOptions, setAssignedToOptions] = useState<{value: string, label: string}[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [assignedTo, setLocalAssignedTo] = useState("");
  const [originalUser, setOriginalUser] = useState<any>(null);

  // Compute disabled logic once
  const isDisabled = !!id && !editMode;

  // Error state for validation
  const [errors, setErrors] = useState<any>({});

  // Set default active status for new users
  useEffect(() => {
    if (!id && user.is_active === undefined) {
      setUser((prev: any) => ({
        ...prev,
        is_active: true,
      }));
    }
  }, [id, user.is_active, setUser]);

  // Helper function to handle API calls with token refresh
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      // Get the current auth data
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      const accessToken = auth?.access;
      
      if (!accessToken) {
        throw new Error("No access token available");
      }
      
      // Set authorization header
      const headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      };
      
      // Make the request
      let response = await fetch(url, {
        ...options,
        headers,
      });
      
      // If token is invalid, try to refresh it
      if (response.status === 401) {
        // Try to refresh the token
        const refreshToken = auth?.refresh;
        
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        
        const refreshResponse = await fetch("https://api.accountouch.com/api/users/auth/token/refresh/", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        
        const refreshData = await refreshResponse.json();
        
        if (refreshData.access) {
          // Update the access token in localStorage
          const updatedAuth = {
            ...auth,
            access: refreshData.access,
          };
          localStorage.setItem("auth", JSON.stringify(updatedAuth));
          
          // Retry the request with new token
          const refreshedHeaders = {
            ...options.headers,
            'Authorization': `Bearer ${refreshData.access}`,
          };
          
          response = await fetch(url, {
            ...options,
            headers: refreshedHeaders,
          });
        } else {
          // If refresh fails, redirect to login
          window.location.href = "/signin";
          throw new Error("Token refresh failed");
        }
      }
      
      return response;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  };

  // Fetch roles for dropdown
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetchWithAuth("https://api.accountouch.com/api/users/roles/", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        // Handle paginated response (with results array)
        if (data && data.results && Array.isArray(data.results)) {
          const options = data.results.map((role: any) => ({
            value: role.id.toString(),
            label: role.name
          }));
          setRolesOptions(options);
          
          // Set selected role if user has roles
          if (user.roles && user.roles.length > 0 && user.roles[0]?.id) {
            const roleId = user.roles[0].id.toString();
            setSelectedRole(roleId);
            setSelectedRoles(roleId);
          }
        } 
        // Fallback for direct array response
        else if (Array.isArray(data)) {
          const options = data.map((role: any) => ({
            value: role.id.toString(),
            label: role.name
          }));
          setRolesOptions(options);
          
          // Set selected role if user has roles
          if (user.roles && user.roles.length > 0 && user.roles[0]?.id) {
            const roleId = user.roles[0].id.toString();
            setSelectedRole(roleId);
            setSelectedRoles(roleId);
          }
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    
    fetchRoles();
  }, [user.roles]);

  // Fetch assigned to users based on selected role
  useEffect(() => {
    const fetchAssignedToUsers = async () => {
      try {
        // If role is Maker, fetch only active Checkers
        let url = "https://api.accountouch.com/api/users/users/";
        if (selectedRole) {
          const selectedRoleObj = rolesOptions.find(role => role.value === selectedRole);
          if (selectedRoleObj?.label === "Maker") {
            url = "https://api.accountouch.com/api/users/users/?roles__name=Checker";
          }
        }
        
        const response = await fetchWithAuth(url, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        if (data && data.results && Array.isArray(data.results)) {
          const activeUsers = data.results.filter((user: any) => user.is_active);
          const options = activeUsers.map((user: any) => ({
            value: user.id.toString(),
            label: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim()
          }));
          setAssignedToOptions(options);
          
          // Set assigned_to if user has it
          if (user.assigned_to?.id) {
            setLocalAssignedTo(user.assigned_to.id.toString());
            setAssignedTo(user.assigned_to.id.toString());
          }
        }
      } catch (error) {
        console.error("Error fetching assigned to users:", error);
      }
    };
    
    fetchAssignedToUsers();
  }, [selectedRole, rolesOptions, user.assigned_to]);

  // Set original user data when entering edit mode
  useEffect(() => {
    if (editMode) {
      setOriginalUser({...user});
    }
  }, [editMode, user]);

  // Handle role change
  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setSelectedRoles(value);
    
    // Check if the selected role is "Client"
    const selectedRoleObj = rolesOptions.find(role => role.value === value);
    const isClient = selectedRoleObj?.label === "Client";
    
    // Update validation errors if role is Client
    if (isClient) {
      validateClientFields();
    }
  };

  // Validate client-specific fields
  const validateClientFields = () => {
    const newErrors = { ...errors };
    
    if (!user.pan_card) {
      newErrors.pan_card = "PAN Card Number is required for Client role";
    }
    
    if (!user.name_as_per_pan_card) {
      newErrors.name_as_per_pan_card = "Name as per PAN Card is required for Client role";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation function
  const validateForm = () => {
    const newErrors: any = {};

    // Validate required fields
    if (!user.first_name) newErrors.first_name = "First Name is required";
    if (!user.phone_number) newErrors.phone_number = "Phone Number is required";
    if (!user.email) newErrors.email = "Email is required";

    // Email validation - more comprehensive
    if (user.email) {
      // More comprehensive email regex that checks for:
      // - Valid characters before @ (alphanumeric, dots, underscores, hyphens)
      // - Valid domain name structure
      // - TLD between 2-6 characters
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      
      if (!emailRegex.test(user.email.toLowerCase())) {
        newErrors.email = "Please enter a valid email address";
      }
      
      // Check for common email domains to catch typos
      const commonDomainTypos: { [key: string]: string } = {
        'gmial': 'gmail',
        'gmal': 'gmail',
        'gamil': 'gmail',
        'gnail': 'gmail',
        'hotmial': 'hotmail',
        'hotmal': 'hotmail',
        'yaho': 'yahoo',
        'yhaoo': 'yahoo',
        'outloo': 'outlook',
        'outlok': 'outlook'
      };
      
      if (!newErrors.email) {
        const emailParts = user.email.split('@');
        if (emailParts.length === 2) {
          const domainParts = emailParts[1].split('.');
          if (domainParts.length >= 2) {
            const domain = domainParts[0].toLowerCase();
            if (commonDomainTypos[domain]) {
              newErrors.email = `Did you mean ${emailParts[0]}@${commonDomainTypos[domain]}.${domainParts.slice(1).join('.')}?`;
            }
          }
        }
      }
    }

    // Phone number validation: must contain 10 digits for India
    const phoneRegex = /^[0-9]{10}$/;
    if (user.phone_number && !phoneRegex.test(user.phone_number)) {
      newErrors.phone_number = "Phone number must be 10 digits";
    }

    // Check if the selected role is "Client"
    const selectedRoleObj = rolesOptions.find(role => role.value === selectedRole);
    const isClient = selectedRoleObj?.label === "Client";
    
    // Validate client-specific required fields
    if (isClient) {
      if (!user.pan_card) {
        newErrors.pan_card = "PAN Card Number is required for Client role";
      } else {
        // PAN card format validation (AAAAA0000A)
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(user.pan_card)) {
          newErrors.pan_card = "Enter a valid PAN Card Number (e.g., AAAAA0000A)";
        }
      }
      
      if (!user.name_as_per_pan_card) {
        newErrors.name_as_per_pan_card = "Name as per PAN Card is required for Client role";
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
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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

            <div className="space-y-6">
              <Label htmlFor="Email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                value={user.email}
                type="email"
                id="email"
                onChange={(e) =>
                  setUser((prev: any) => ({
                    ...prev,
                    email: e.target.value,
                  }))
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
                onChange={(e) =>
                  setUser((prev: any) => ({
                    ...prev,
                    phone_number: e.target.value,
                  }))
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
        </ComponentCard>

        <ComponentCard title="Roles and Responsibilities">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <Label htmlFor="Role">Role</Label>
              <Select
                disabled={isDisabled}
                options={rolesOptions}
                value={selectedRole}
                onChange={(value) => {
                  setSelectedRole(value);
                  setSelectedRoles(value);
                  
                  // Check if the selected role is "Client"
                  const selectedRoleObj = rolesOptions.find(role => role.value === value);
                  const isClient = selectedRoleObj?.label === "Client";
                  
                  // Update validation errors if role is Client
                  if (isClient) {
                    validateClientFields();
                  }
                }}
                placeholder="Select Role"
              />
            </div>
            <div className="space-y-6">
              <Label htmlFor="Assigned To">Assigned To</Label>
              <Select
                disabled={isDisabled}
                options={assignedToOptions}
                value={assignedTo}
                onChange={(value) => {
                  setLocalAssignedTo(value);
                  setAssignedTo(value);
                }}
                placeholder="Select Assigned To"
              />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Pan Details">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <Label htmlFor="pan_card">
                PAN Card Number
                {selectedRole && rolesOptions.find(role => role.value === selectedRole)?.label === "Client" && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Input
                value={user.pan_card || ""}
                type="text"
                id="pan_card"
                onChange={(e) =>
                  setUser((prev: any) => ({
                    ...prev,
                    pan_card: e.target.value,
                  }))
                }
                disabled={isDisabled}
              />
              {errors.pan_card && (
                <p className="text-red-500 text-sm" id="pan_card_error">
                  {errors.pan_card}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <Label htmlFor="name_as_per_pan_card">
                Name as per PAN Card
                {selectedRole && rolesOptions.find(role => role.value === selectedRole)?.label === "Client" && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Input
                value={user.name_as_per_pan_card || ""}
                type="text"
                id="name_as_per_pan_card"
                onChange={(e) =>
                  setUser((prev: any) => ({
                    ...prev,
                    name_as_per_pan_card: e.target.value,
                  }))
                }
                disabled={isDisabled}
              />
              {errors.name_as_per_pan_card && (
                <p className="text-red-500 text-sm" id="name_as_per_pan_card_error">
                  {errors.name_as_per_pan_card}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <Label htmlFor="aadhar_card">Aadhar Card Number</Label>
              <Input
                value={user.aadhar_card || ""}
                type="text"
                id="aadhar_card"
                onChange={(e) =>
                  setUser((prev: any) => ({
                    ...prev,
                    aadhar_card: e.target.value,
                  }))
                }
                disabled={isDisabled}
              />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="GST Details">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {[
              { label: "GST Number", field: "gst_number" },
              { label: "GST Portal Login", field: "gst_site_login" },
              { label: "GST Portal Password", field: "gst_site_password" },
            ].map(({ label, field }) => (
              <div className="space-y-6" key={field}>
                <Label htmlFor={field}>{label}</Label>
                <Input
                  value={user[field] || ""}
                  type={field === "gst_site_password" ? "password" : "text"}
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
            <>
              <button
                type="submit"
                className="px-8 p-2 border border-1 border-green-600 bg-green-500 text-white rounded-lg"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  // Reset form to original user data
                  if (originalUser) {
                    setUser(originalUser);
                  }
                  setEditMode(false);
                }}
                className="px-8 p-2 border border-1 border-red-600 hover:bg-red-400 rounded-lg"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
