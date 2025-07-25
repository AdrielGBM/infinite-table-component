export function getColor(
  value: string
): Record<"text" | "shape" | "bg" | "border", string> {
  switch (value) {
    case "blue":
      return {
        text: "text-blue-500",
        shape: "bg-blue-500 dark:bg-blue-500",
        bg: "bg-blue-100 dark:bg-blue-900",
        border: "border-blue-200 dark:border-blue-800",
      };
    case "green":
      return {
        text: "text-green-500",
        shape: "bg-green-500 dark:bg-green-500",
        bg: "bg-green-100 dark:bg-green-900",
        border: "border-green-200 dark:border-green-800",
      };
    case "yellow":
      return {
        text: "text-yellow-500",
        shape: "bg-yellow-500 dark:bg-yellow-500",
        bg: "bg-yellow-100 dark:bg-yellow-900",
        border: "border-yellow-200 dark:border-yellow-800",
      };
    case "orange":
      return {
        text: "text-orange-500",
        shape: "bg-orange-500 dark:bg-orange-500",
        bg: "bg-orange-100 dark:bg-orange-900",
        border: "border-orange-200 dark:border-orange-800",
      };
    case "red":
      return {
        text: "text-red-500",
        shape: "bg-red-500 dark:bg-red-500",
        bg: "bg-red-100 dark:bg-red-900",
        border: "border-red-200 dark:border-red-800",
      };
    case "emerald":
      return {
        text: "text-emerald-500",
        shape: "bg-emerald-500 dark:bg-emerald-500",
        bg: "bg-emerald-100 dark:bg-emerald-900",
        border: "border-emerald-200 dark:border-emerald-800",
      };
    case "cyan":
      return {
        text: "text-cyan-500",
        shape: "bg-cyan-500 dark:bg-cyan-500",
        bg: "bg-cyan-100 dark:bg-cyan-900",
        border: "border-cyan-200 dark:border-cyan-800",
      };
    case "violet":
      return {
        text: "text-violet-500",
        shape: "bg-violet-500 dark:bg-violet-500",
        bg: "bg-violet-100 dark:bg-violet-900",
        border: "border-violet-200 dark:border-violet-800",
      };
    case "purple":
      return {
        text: "text-purple-500",
        shape: "bg-purple-500 dark:bg-purple-500",
        bg: "bg-purple-100 dark:bg-purple-900",
        border: "border-purple-200 dark:border-purple-800",
      };
    default:
      return {
        text: "",
        shape: "bg-gray-500 dark:bg-gray-500",
        bg: "bg-gray-100 dark:bg-gray-900",
        border: "border-gray-200 dark:border-gray-800",
      };
  }
}
