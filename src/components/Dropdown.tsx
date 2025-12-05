import { useState, useRef, useEffect } from "react";

/**
 * Universal Dropdown Component
 *
 * A reusable dropdown component that can be used anywhere in the application.
 *
 * Features:
 * - Customizable options
 * - Optional placeholder
 * - Controlled/uncontrolled modes
 * - Click outside to close
 * - Keyboard navigation support
 * - Custom styling support
 */

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string | number;
  placeholder?: string;
  onChange?: (value: string | number, option: DropdownOption) => void;
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
  placeholderClassName?: string;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  required?: boolean;
}

export default function Dropdown({
  options,
  value,
  placeholder = "Select an option",
  onChange,
  disabled = false,
  className = "",
  optionClassName = "",
  placeholderClassName = "",
  error = false,
  errorMessage,
  label,
  required = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<
    string | number | undefined
  >(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update selectedValue when value prop changes (controlled mode)
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  // Handle option selection
  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;

    setSelectedValue(option.value);
    setIsOpen(false);
    onChange?.(option.value, option);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Base classes
  const baseClasses = `
    relative w-full
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `;

  const triggerClasses = `
    w-full px-4 py-2
    border rounded-lg
    bg-white
    text-left
    focus:outline-none focus:ring-2
    transition-all
    ${
      error
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }
    ${disabled ? "cursor-not-allowed" : "hover:border-gray-400"}
    ${className}
  `;

  const dropdownMenuClasses = `
    absolute z-50 w-full mt-1
    bg-white border border-gray-300 rounded-lg shadow-lg
    max-h-60 overflow-auto
    ${isOpen ? "block" : "hidden"}
  `;

  const optionBaseClasses = `
    px-4 py-2 cursor-pointer
    hover:bg-gray-100
    transition-colors
    ${optionClassName}
  `;

  return (
    <div className={baseClasses} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Dropdown Trigger */}
      <div
        className={triggerClasses}
        onClick={toggleDropdown}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleDropdown();
          }
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className={
              selectedOption
                ? "text-gray-900"
                : `text-gray-500 ${placeholderClassName}`
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={dropdownMenuClasses} role="listbox">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-gray-500 text-sm">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`
                  ${optionBaseClasses}
                  ${
                    option.value === selectedValue
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-900"
                  }
                  ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
                role="option"
                aria-selected={option.value === selectedValue}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}

      {/* Error Message */}
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
