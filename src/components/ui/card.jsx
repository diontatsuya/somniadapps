import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-md p-4 border border-gray-200 dark:bg-gray-900 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
