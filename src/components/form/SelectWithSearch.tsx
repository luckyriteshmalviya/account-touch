import ReactSelect from "react-select";

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
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  onSearch?: (query: string) => void;
  formatOptionLabel?: (option: Option) => React.ReactNode;
  isMulti?: boolean;
  isClearable?: boolean;
  showDetails?: boolean;
  customStyles?: any;
}

const defaultFormatOptionLabel = ({ label, email, phone }: Option, { context }: any) => {
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
  defaultValue = "",
  value,
  disabled = false,
  onSearch,
  formatOptionLabel,
  isMulti = false,
  isClearable = true,
  showDetails = false,
  customStyles = {},
}) => {
  const selectedOption = options.find(opt => opt.value === value) || null;

  const handleChange = (selected: Option | null) => {
    onChange(selected?.value || "");
  };

  const handleInputChange = (inputValue: string, { action }: { action: string }) => {
    if (action === "input-change" && onSearch) {
      onSearch(inputValue);
    }
  };

  const defaultStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: '44px', // Exact height of other inputs (h-11 = 2.75rem = 44px)
      height: '44px',
      padding: '0',
      backgroundColor: 'transparent',
      borderColor: state.isFocused ? 'var(--brand-300, #A5B4FC)' : 'var(--border-color, #E5E7EB)',
      boxShadow: state.isFocused ? '0 0 0 1px var(--brand-300, #A5B4FC)' : 'none',
      '&:hover': {
        borderColor: 'var(--border-hover-color, #D1D5DB)'
      },
      '.react-select__input': {
        border: 'none !important',
        outline: 'none !important',
        boxShadow: 'none !important'
      }
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '0 1rem',
      height: '42px', // Account for borders
      position: 'relative'
    }),
    input: (base: any) => ({
      ...base,
      color: 'var(--text-color, #111827)',
      margin: 0,
      padding: 0,
      height: '42px',
      position: 'absolute',
      left: '1rem'
    }),
    menu: (base: any) => ({
      ...base,
      marginTop: '0.25rem',
      backgroundColor: 'var(--bg-color, white)',
      border: '1px solid var(--border-color, #E5E7EB)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 50
    }),
    option: (base: any, state: any) => ({
      ...base,
      padding: '0.5rem 1rem',
      backgroundColor: state.isSelected 
        ? 'var(--selected-bg, #EEF2FF)' 
        : state.isFocused 
          ? 'var(--hover-bg, #F3F4F6)' 
          : 'transparent',
      color: state.isSelected ? 'var(--brand-600, #4F46E5)' : 'var(--text-color, #111827)',
      '&:hover': {
        backgroundColor: 'var(--hover-bg, #F3F4F6)'
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'var(--text-color, #111827)',
      margin: 0,
      padding: 0
    }),
    placeholder: (base: any) => ({
      ...base,
      color: 'var(--placeholder-color, #9CA3AF)',
      margin: 0
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      padding: '0 0.75rem'
    })
  };

  return (
    <ReactSelect
      className={`${className}`}
      classNamePrefix="react-select"
      options={options}
      value={selectedOption}
      onChange={(selected) => handleChange(selected?.values || "")}
      onInputChange={handleInputChange}
      isDisabled={disabled}
      placeholder={placeholder}
      formatOptionLabel={showDetails ? defaultFormatOptionLabel : formatOptionLabel}
      isMulti={isMulti}
      isClearable={isClearable}
      styles={{ ...defaultStyles, ...customStyles }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: 'var(--brand-500, #6366F1)',
          primary75: 'var(--brand-400, #818CF8)',
          primary50: 'var(--brand-300, #A5B4FC)',
          primary25: 'var(--brand-100, #E0E7FF)',
          danger: 'var(--red-500, #EF4444)',
          dangerLight: 'var(--red-100, #FEE2E2)',
        },
      })}
    />
  );
};

export default SelectWithSearch;
