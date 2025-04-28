import React from 'react';

interface ToggleSwitchProps {
  id: string;
  label: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  label,
  isChecked,
  onChange,
  description,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={isChecked}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isChecked ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          onClick={() => onChange(!isChecked)}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isChecked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="ml-3 text-sm">
          <span className="font-medium text-gray-900">{label}</span>
        </span>
      </div>
      {description && (
        <p className="mt-1 text-xs text-gray-500 pl-14">{description}</p>
      )}
    </div>
  );
};

export default ToggleSwitch;