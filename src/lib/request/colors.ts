export function getColor(
  value: string
): Record<"text" | "bg" | "border", string> {
  switch (value) {
    case "blue":
      return {
        text: "text-blue-500",
        bg: "bg-blue-100 dark:bg-blue-900/50",
        border: "border-blue-200 dark:border-blue-800",
      };
    case "green":
      return {
        text: "text-green-500",
        bg: "bg-green-100 dark:bg-green-900/50",
        border: "border-green-200 dark:border-green-800",
      };
    case "yellow":
      return {
        text: "text-yellow-500",
        bg: "bg-yellow-100 dark:bg-yellow-900/50",
        border: "border-yellow-200 dark:border-yellow-800",
      };
    case "orange":
      return {
        text: "text-orange-500",
        bg: "bg-orange-100 dark:bg-orange-900/50",
        border: "border-orange-200 dark:border-orange-800",
      };
    case "red":
      return {
        text: "text-red-500",
        bg: "bg-red-100 dark:bg-red-900/50",
        border: "border-red-200 dark:border-red-800",
      };
    default:
      return {
        text: "",
        bg: "bg-gray-100 dark:bg-gray-900/50",
        border: "border-gray-200 dark:border-gray-800",
      };
  }
}
