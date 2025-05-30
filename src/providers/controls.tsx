import { useLocalStorage } from "@/hooks/use-local-storage";
import { ControlsContext } from "./useControls";

export function ControlsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useLocalStorage("data-table-controls", true);

  return (
    <ControlsContext.Provider value={{ open, setOpen }}>
      <div
        // REMINDER: access the data-expanded state with tailwind via `group-data-[expanded=true]/controls:block`
        // In tailwindcss v4, we could even use `group-data-expanded/controls:block`
        className="group/controls"
        data-expanded={open}
      >
        {children}
      </div>
    </ControlsContext.Provider>
  );
}
