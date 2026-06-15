import { useEffect } from "react";
import { useContent } from "@/cms/useContent";

export function BrandColor() {
  const g = useContent("global");
  useEffect(() => {
    if (g.primaryColor && typeof document !== "undefined") {
      document.documentElement.style.setProperty("--lohix-green", g.primaryColor);
      document.documentElement.style.setProperty("--lohix-lime", g.primaryColor);
    }
  }, [g.primaryColor]);
  return null;
}
