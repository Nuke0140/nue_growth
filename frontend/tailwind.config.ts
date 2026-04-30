import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--app-bg)",
        foreground: "var(--app-text)",
        card: {
          DEFAULT: "var(--app-card-bg)",
          foreground: "var(--app-text)",
        },
        popover: {
          DEFAULT: "var(--app-card-bg)",
          foreground: "var(--app-text)",
        },
        primary: {
          DEFAULT: "var(--app-accent)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--app-elevated)",
          foreground: "var(--app-text)",
        },
        muted: {
          DEFAULT: "var(--app-elevated)",
          foreground: "var(--app-text-muted)",
        },
        accent: {
          DEFAULT: "var(--app-accent-light)",
          foreground: "var(--app-accent)",
        },
        destructive: {
          DEFAULT: "var(--app-danger)",
          foreground: "#ffffff",
        },
        border: "var(--app-border)",
        input: "var(--app-input-bg)",
        ring: "var(--app-accent)",
        chart: {
          "1": "var(--app-module-erp)",
          "2": "var(--app-module-crm)",
          "3": "var(--app-module-analytics)",
          "4": "var(--app-module-finance)",
          "5": "var(--app-module-marketing)",
        },
        app: {
          bg: "var(--app-bg)",
          "card-bg": "var(--app-card-bg)",
          "card-bg-hover": "var(--app-card-bg-hover)",
          elevated: "var(--app-elevated)",
          "input-bg": "var(--app-input-bg)",
          accent: "var(--app-accent)",
          "accent-hover": "var(--app-accent-hover)",
          "accent-light": "var(--app-accent-light)",
          text: "var(--app-text)",
          "text-secondary": "var(--app-text-secondary)",
          "text-muted": "var(--app-text-muted)",
          "text-disabled": "var(--app-text-disabled)",
          border: "var(--app-border)",
          "border-light": "var(--app-border-light)",
          "border-strong": "var(--app-border-strong)",
          "hover-bg": "var(--app-hover-bg)",
          "active-bg": "var(--app-active-bg)",
          success: "var(--app-success)",
          warning: "var(--app-warning)",
          danger: "var(--app-danger)",
          info: "var(--app-info)",
          "success-bg": "var(--app-success-bg)",
          "warning-bg": "var(--app-warning-bg)",
          "danger-bg": "var(--app-danger-bg)",
          "info-bg": "var(--app-info-bg)",
          overlay: "var(--app-overlay)",
          "sidebar-bg": "var(--app-sidebar-bg)",
          "topbar-bg": "var(--app-topbar-bg)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
