import { cn } from "@/lib/utils";

export function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-all disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
