import { createContext, useContext } from "react";

interface ControlsContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ControlsContext = createContext<ControlsContextType | null>(null);

export function useControls() {
  const context = useContext(ControlsContext);

  if (!context) {
    throw new Error("useControls must be used within a ControlsProvider");
  }

  return context;
}
