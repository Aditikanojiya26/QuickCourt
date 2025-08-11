import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = (props) => {
  const { resolvedTheme = "light" } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      style={{
        "--normal-bg": isDark ? "#1e1e1e" : "var(--popover)",
        "--normal-text": isDark ? "#f1f1f1" : "var(--popover-foreground)",
        "--normal-border": isDark ? "#333" : "var(--border)",
      }}
      {...props}
    />
  );
};

export { Toaster };
