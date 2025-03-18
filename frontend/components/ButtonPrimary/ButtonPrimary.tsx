import React, { ReactElement } from "react";

type ButtonPrimaryProps = {
  text?: string;
  icon?: ReactElement | null;
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  buttonClickForm?: string;
  title?: string;
  style?: object;
  danger?: boolean;
  className?: string;
  iconPosition?: "LEFT" | "RIGHT";
  loading?: boolean;
  size?: "sm" | "md";
};

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
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
         text-[14px] font-[590] leading-none tracking-[-0.14px] text-white
        ${fullWidth ? "w-full" : "w-auto"}
        ${danger 
          ? (disabled ? "bg-[#FECDCA]" : "bg-danger hover:bg-red-700") 
          : disabled 
            ? "bg-[#121F49] opacity-80 cursor-not-allowed" 
            : "bg-[#121F49] border border-[#121F49]/20 text-shadow-[0_0_1px_rgba(255,255,255,0.5)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1/2 before:bg-white/10 before:transition-transform before:duration-300 hover:before:translate-y-[-100%]"
        }
        relative overflow-hidden transition-all duration-300
        ${className}`}
    >
      {icon && iconPosition == "LEFT" && (
        <span className="mr-0 flex items-center">{icon}</span>
      )}
      {loading ?
       <div className="relative">
         <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} w-max opacity-50`}>Loading...</span>
         <div className="absolute -top-1 -right-1 h-3 w-3">
           <div className="animate-spin h-full w-full rounded-full border-2 border-gray-200 border-t-blue-500"></div>
         </div>
       </div>
      : text && <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} w-max`}>{text}</span>}
      {icon && iconPosition == "RIGHT" && (
        <span className="mr-0 flex items-center">{icon}</span>
      )}
    </button>
  );
};

export default ButtonPrimary;
