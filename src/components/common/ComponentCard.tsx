import { Link } from "react-router";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  addUnit?: string; // Additional unit or information to display
  route?: string; // Function to call when the add unit is clicked
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  addUnit,
  route,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between text-base font-medium text-gray-800 dark:text-white/90">
          <h3>{title}</h3>
          {addUnit && (
            <Link
              to={route || ""}
              className="px-4 border border-1 border-zinc-400 hover:bg-zinc-400 p-2 rounded-lg"
            >
              {" "}
              {addUnit}
            </Link>
          )}
        </div>
        {desc && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
