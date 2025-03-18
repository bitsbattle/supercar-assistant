import React, { ReactElement } from "react";

type ButtonSecondaryProps = {
  text?: string;
  icon?: ReactElement | null;
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  buttonClickForm?: string;
  title?: string;
  style?: object;
  danger?: boolean;
  className?: string;
  iconPosition?: "LEFT" | "RIGHT";
  loading?: boolean;
  iconOnly?: boolean;
  showTooltip?: boolean;
  tooltipText?: string;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "md";
};

export const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  text,
  icon,
  onClick,
  fullWidth = false,
  disabled = false,
  type = "button",
  buttonClickForm,
  title,
  style,
  danger,
  iconPosition = "RIGHT",
  className,
  loading,
  iconOnly = false,
  showTooltip = false,
  tooltipText,
  tooltipPlacement = "top",
  size = "md",
  ...props
}) => {
  return (
      <button
        type={type}
        form={buttonClickForm}
        onClick={onClick}
        disabled={disabled}
        title={title}
        {...props}
        {...style}
        className={`inline-flex items-center justify-center gap-2 ${size === 'sm' ? 'px-3' : 'px-[14px]'} py-[8px] rounded-lg
        text-[14px] font-[590] leading-none tracking-[-0.14px] text-[#060C18]
       ${fullWidth ? "w-full" : "w-auto"}
       ${danger
            ? (disabled ? "bg-[#FECDCA]" : "bg-danger hover:bg-red-700")
            : disabled
              ? "bg-[#F6FAFF] opacity-80 cursor-not-allowed"
              : "bg-[#F6FAFF] border border-[#E1E1E1] text-shadow-[0_0_1px_rgba(255,255,255,0.5)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1/2 before:bg-[#FFFFFF] before:transition-transform before:duration-300 hover:before:translate-y-[-100%]"
          }
       relative overflow-hidden transition-all duration-300
       ${className}`}
      >
        <div className="relative z-10 inline-flex items-center justify-center gap-2">
          {icon && iconPosition == "LEFT" && (
            <span className="mr-0 flex items-center">{icon}</span>
          )}
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          ) : text && <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} w-max`}>{text}</span>}
          {icon && iconPosition == "RIGHT" && (
            <span className="mr-0 flex items-center">{icon}</span>
          )}
        </div>
      </button>
  );
};

export default ButtonSecondary;