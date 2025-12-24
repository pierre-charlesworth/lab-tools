import React from 'react';
import { HelpCircle } from 'lucide-react';

interface M3TextFieldProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  disabled?: boolean;
  type?: string;
  inputMode?: "text" | "decimal" | "numeric";
  step?: string;
  suffix?: string;
  tooltip?: string;
  icon?: React.ElementType;
  // Multiline support
  multiline?: boolean;
  rows?: number;
  // Select support
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group/tooltip relative inline-flex items-center justify-center align-middle normal-case z-50">
    <div className="cursor-help text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)] transition-colors p-1.5 -m-1.5 rounded-full hover:bg-[var(--md-surface-container)]">
      <HelpCircle className="w-4 h-4" />
    </div>
    <div className="
      absolute bottom-full right-0 mb-2 w-48
      px-3 py-2
      bg-[var(--md-on-surface)] dark:bg-[var(--md-surface-container-highest)]
      text-[var(--md-surface)] dark:text-[var(--md-on-surface)]
      text-xs font-normal tracking-wide leading-5
      rounded-[var(--md-radius)] shadow-[var(--md-shadow-md)]
      opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible
      transition-all duration-200 ease-out transform scale-95 group-hover/tooltip:scale-100 origin-bottom-right
      pointer-events-none text-left z-50
    ">
      {text}
    </div>
  </div>
);

// M3 Compliant Outlined Text Field
export const M3TextField: React.FC<M3TextFieldProps> = ({
  label,
  value,
  onChange,
  disabled,
  type = "number",
  inputMode = "decimal",
  step,
  suffix,
  tooltip,
  icon: Icon,
  multiline,
  rows = 4,
  options,
  placeholder: customPlaceholder
}) => {
  // Shared classes for input/textarea/select
  // Note: Borders are handled by the sibling fieldset, so we remove them here
  const baseElementClasses = `
    peer block w-full rounded-[var(--md-radius)] bg-transparent px-4
    text-base text-[var(--md-on-surface)]
    placeholder-transparent
    focus:outline-none focus:ring-0
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
    ${Icon ? 'pl-11' : ''}
    ${suffix || tooltip ? 'pr-12' : ''}
  `;

  const renderInput = () => {
    if (options) {
      return (
        <select
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseElementClasses} h-14 py-2.5 appearance-none`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (multiline) {
      return (
        <textarea
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder=" "
          className={`${baseElementClasses} py-3 resize-none font-mono`}
        />
      );
    }

    return (
      <input
        type={type}
        inputMode={inputMode}
        step={step}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className={`
          ${baseElementClasses} h-14 py-2.5 font-mono
          appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]
        `}
      />
    );
  };

  return (
    <div className="relative hover:z-30 transition-z duration-0 bg-transparent">
      {renderInput()}

      {/* Floating Label (Visible) */}
      <label className={`
        absolute left-3 top-0 -translate-y-1/2 px-1 text-xs text-[var(--md-on-surface-variant)] transition-all duration-200
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[var(--md-on-surface-variant)]
        peer-focus:top-0 peer-focus:text-xs peer-focus:text-[var(--md-primary)]
        peer-disabled:opacity-50
        ${Icon ? 'peer-placeholder-shown:left-11' : ''}
        pointer-events-none select-none truncate max-w-[calc(100%-2rem)]
        z-20
      `}>
        {label}
      </label>

      {/* Fieldset Border & Notch (The trick for transparency) */}
      <fieldset className={`
        absolute inset-0 -top-2.5 rounded-[var(--md-radius)] pointer-events-none
        border border-[var(--md-outline)]
        peer-focus:border-[var(--md-primary)] peer-focus:border-2
        peer-disabled:border-[var(--md-surface-container)]
        transition-colors duration-200
        px-2.5
      `}>
        {/* Legend creates the gap in the border. Content matches label but is invisible. */}
        <legend className={`
           h-2 p-0 invisible overflow-hidden whitespace-nowrap border-0
           text-xs font-medium transition-all duration-200
           max-w-[0.01px]
           peer-focus:max-w-full peer-focus:px-1
           peer-[:not(:placeholder-shown)]:max-w-full peer-[:not(:placeholder-shown)]:px-1
         `}>
          <span className="opacity-0 visible">{label}</span>
        </legend>
      </fieldset>

      {/* Leading Icon */}
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--md-on-surface-variant)] pointer-events-none peer-focus:text-[var(--md-primary)] transition-colors duration-200 z-10">
          <Icon className="w-5 h-5" />
        </div>
      )}

      {/* Trailing Suffix / Tooltip */}
      {(suffix || tooltip) && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
          {suffix && <span className="text-[var(--md-on-surface-variant)] text-sm font-medium pointer-events-none">{suffix}</span>}
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
      )}
    </div>
  );
};
