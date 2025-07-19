import { useState, useRef, useEffect } from "react";
import { MdSort, MdExpandMore, MdCheck } from "react-icons/md";

const SortDropdown = ({ value, onChange, options, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:border-gray-400 transition-colors min-w-[200px] justify-between cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2">
          <MdSort className="text-gray-500" />
          <span className="text-gray-700">
            {selectedOption?.label || "Sort by"}
          </span>
        </div>
        <MdExpandMore
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="py-1" role="listbox">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer ${
                  value === option.value
                    ? "bg-orange-50 text-orange-700"
                    : "text-gray-700"
                }`}
                role="option"
                aria-selected={value === option.value}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <MdCheck className="text-orange-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
