import ReactSelect, {
  SingleValue,
  MultiValue,
  InputActionMeta,
  FilterOptionOption,
} from "react-select";
import { useCallback } from "react";

interface Option {
  value: string;
  label: string;
  email?: string;
  phone?: string;
  [key: string]: any; // Allow additional custom fields
}

interface SelectWithSearchProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string | string[]) => void;
  className?: string;
  defaultValue?: string;
  value?: string | string[];
  disabled?: boolean;
  onSearch?: (query: string) => void;
  formatOptionLabel?: (option: Option, labelMeta: any) => React.ReactNode;
  isMulti?: boolean;
  isClearable?: boolean;
  showDetails?: boolean;
  customStyles?: any;
}

const defaultFormatOptionLabel = (
  { label, email, phone }: Option,
  { context }: any
) => {
  if (context === "menu" && (email || phone)) {
    return (
      <div className="flex flex-col gap-0.5">
        <div className="font-medium text-gray-900 dark:text-white">{label}</div>
        <div className="flex flex-col gap-0.5 text-xs text-gray-500 dark:text-gray-400">
          {email && <div className="flex items-center gap-1">📧 {email}</div>}
          {phone && <div className="flex items-center gap-1">📱 {phone}</div>}
        </div>
      </div>
    );
  }
  return label;
};

const SelectWithSearch: React.FC<SelectWithSearchProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  value,
  disabled = false,
  onSearch,
  formatOptionLabel,
  isMulti = false,
  isClearable = true,
  showDetails = false,
  customStyles = {},
}) => {
  // Handle both single and multi-select values
  const getSelectedOption = () => {
    if (isMulti) {
      if (Array.isArray(value)) {
        return options.filter((opt) => value.includes(opt.value));
      }
      return [];
    } else {
      return options.find((opt) => opt.value === value) || null;
    }
  };

  const selectedOption = getSelectedOption();

  const handleChange = (selected: SingleValue<Option> | MultiValue<Option>) => {
    if (isMulti) {
      const multiSelected = selected as MultiValue<Option>;
      const values = multiSelected ? multiSelected.map((opt) => opt.value) : [];
      onChange(values);
    } else {
      const singleSelected = selected as SingleValue<Option>;
      onChange(singleSelected?.value || "");
    }
  };

  // Debounce the search with 600ms delay
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (value: string) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          if (onSearch) {
            onSearch(value);
          }
        }, 600);
      };
    })(),
    [onSearch]
  );

  const handleInputChange = (inputValue: string, meta: InputActionMeta) => {
    if (meta.action === "input-change") {
      // If input is empty or cleared, fetch full list immediately
      if (!inputValue.trim()) {
        onSearch && onSearch("");
        return;
      }
      // Otherwise use debounced search
      debouncedSearch(inputValue);
    }
  };

  const defaultStyles = {
    container: (base: any) => ({
      ...base,
      marginTop: "30px !important",
      padding: 0,
    }),
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "44px",
      height: "44px",
      margin: 0,
      padding: 0,
      backgroundColor: "transparent",
      borderRadius: "0.5rem",
      borderColor: state.isFocused
        ? "var(--brand-300, #A5B4FC)"
        : "var(--border-color, #E5E7EB)",
      boxShadow: state.isFocused ? "0 0 0 4px rgba(99, 102, 241, 0.1)" : "none",
      "&:hover": {
        borderColor: "var(--border-hover-color, #D1D5DB)",
      },
      ".react-select__input": {
        border: "none !important",
        outline: "none !important",
        boxShadow: "none !important",
      },
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: "0.625rem 1rem",
      height: "44px",
      margin: 0,
      position: "relative",
      display: "flex",
      alignItems: "center",
    }),
    input: (base: any) => ({
      ...base,
      color: "var(--text-color, #111827)",
      margin: 0,
      padding: 0,
      fontSize: "0.875rem",
      position: "absolute",
      left: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
    }),
    menu: (base: any) => ({
      ...base,
      marginTop: "0.25rem",
      backgroundColor: "var(--bg-color, white)",
      border: "1px solid var(--border-color, #E5E7EB)",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 50,
    }),
    option: (base: any, state: any) => ({
      ...base,
      padding: "0.5rem 1rem",
      backgroundColor: state.isSelected
        ? "var(--selected-bg, #EEF2FF)"
        : state.isFocused
        ? "var(--hover-bg, #F3F4F6)"
        : "transparent",
      color: state.isSelected
        ? "var(--brand-600, #4F46E5)"
        : "var(--text-color, #111827)",
      "&:hover": {
        backgroundColor: "var(--hover-bg, #F3F4F6)",
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "var(--text-color, #111827)",
      margin: 0,
      padding: 0,
      fontSize: "0.875rem",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "var(--placeholder-color, #9CA3AF)",
      margin: 0,
      fontSize: "0.875rem",
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      padding: "0 0.75rem",
    }),
  };

  return (
    <ReactSelect
      className={`${className}`}
      classNamePrefix="react-select"
      options={options}
      value={selectedOption}
      onChange={handleChange}
      onInputChange={handleInputChange}
      isDisabled={disabled}
      placeholder={placeholder}
      formatOptionLabel={
        showDetails ? defaultFormatOptionLabel : formatOptionLabel
      }
      isMulti={isMulti}
      isClearable={isClearable}
      styles={{ ...defaultStyles, ...customStyles }}
      filterOption={(
        option: FilterOptionOption<Option>,
        inputValue: string
      ) => {
        const optionData = option.data;
        const searchValue = inputValue?.toLowerCase() || "";
        return (
          !inputValue ||
          !!optionData.label?.toLowerCase().includes(searchValue) ||
          !!optionData.email?.toLowerCase().includes(searchValue) ||
          !!optionData.phone?.toString().toLowerCase().includes(searchValue)
        );
      }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: "var(--brand-500, #6366F1)",
          primary75: "var(--brand-400, #818CF8)",
          primary50: "var(--brand-300, #A5B4FC)",
          primary25: "var(--brand-100, #E0E7FF)",
          danger: "var(--red-500, #EF4444)",
          dangerLight: "var(--red-100, #FEE2E2)",
        },
      })}
    />
  );
};

export default SelectWithSearch;
