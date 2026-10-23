import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2.5rem",
        xl: "3rem",
      },
      screens: {
        "2xl": "1600px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          elevated: "hsl(var(--surface-elevated))",
        },
        ink: {
          DEFAULT: "hsl(var(--ink))",
          foreground: "hsl(var(--ink-foreground))",
          muted: "hsl(var(--ink-muted))",
          border: "hsl(var(--ink-border))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          active: "hsl(var(--primary-active))",
          soft: "hsl(var(--primary-soft))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          hover: "hsl(var(--secondary-hover))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        signal: "hsl(var(--signal))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.625rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        "display-xl": [
          "clamp(2.75rem, 6vw, 5rem)",
          { lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600" },
        ],
        display: [
          "clamp(2.25rem, 4.5vw, 3.75rem)",
          { lineHeight: "1.04", letterSpacing: "-0.035em", fontWeight: "600" },
        ],
        h1: [
          "clamp(1.875rem, 3vw, 2.5rem)",
          { lineHeight: "1.12", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        h2: [
          "clamp(1.5rem, 2.2vw, 1.875rem)",
          { lineHeight: "1.2", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        h3: [
          "1.125rem",
          { lineHeight: "1.35", letterSpacing: "-0.015em", fontWeight: "500" },
        ],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quart": "cubic-bezier(0.22, 1, 0.36, 1)",
        "out-quint": "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out-cubic": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(13, 23, 19, 0.04)",
        surface:
          "0 1px 2px 0 rgba(13, 23, 19, 0.03), 0 1px 1px -0.5px rgba(13, 23, 19, 0.04)",
        card:
          "0 2px 8px -2px rgba(13, 23, 19, 0.05), 0 1px 3px -1px rgba(13, 23, 19, 0.03)",
        elevated:
          "0 12px 32px -8px rgba(13, 23, 19, 0.08), 0 4px 12px -2px rgba(13, 23, 19, 0.03)",
        floating:
          "0 4px 12px -2px rgba(13, 23, 19, 0.06), 0 24px 48px -12px rgba(13, 23, 19, 0.12)",
        modal: "0 24px 64px -16px rgba(13, 23, 19, 0.16)",
        ink: "0 24px 48px -16px rgba(13, 23, 19, 0.35)",
      },
      keyframes: {
        "enter-subtle": {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.985)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "enter-subtle": "enter-subtle 220ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-up": "fade-up 480ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-in-right": "slide-in-right 260ms cubic-bezier(0.22, 1, 0.36, 1) both",
        marquee: "marquee 48s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
