import { ReactNode } from "react";

type SettingSectionProp = {
  header?: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  variant?: "default" | "compact" | "elevated";
  className?: string;
};

export const SettingSection: React.FC<SettingSectionProp> = ({
  header,
  content,
  footer,
  variant = "default",
  className = "",
}) => {
  const baseClasses = "flex flex-col transition-all duration-200 ease-in-out";

  const variantClasses = {
    default:
      "border-b border-gray-200 dark:border-gray-700 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0",
    compact:
      "border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0",
    elevated:
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-sm hover:shadow-md transition-shadow",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {header && (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
            {header}
          </div>
        </div>
      )}

      <div className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed">
        {content}
      </div>

      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {footer}
          </div>
        </div>
      )}
    </div>
  );
};
