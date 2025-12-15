import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "480px",
        md: "720px",
        lg: "960px",
        xl: "1140px",
        "2xl": "1320px",
      },
    },
    extend: {
      // Font families
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      // Color palette with semantic naming
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Primary colors (Forest Green)
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(var(--color-primary-50))",
          100: "hsl(var(--color-primary-100))",
          200: "hsl(var(--color-primary-200))",
          300: "hsl(var(--color-primary-300))",
          400: "hsl(var(--color-primary-400))",
          500: "hsl(var(--color-primary-500))",
          600: "hsl(var(--color-primary-600))",
          700: "hsl(var(--color-primary-700))",
          800: "hsl(var(--color-primary-800))",
          900: "hsl(var(--color-primary-900))",
        },
        // Secondary colors (Sunset Orange)
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "hsl(var(--color-secondary-50))",
          100: "hsl(var(--color-secondary-100))",
          200: "hsl(var(--color-secondary-200))",
          300: "hsl(var(--color-secondary-300))",
          400: "hsl(var(--color-secondary-400))",
          500: "hsl(var(--color-secondary-500))",
          600: "hsl(var(--color-secondary-600))",
          700: "hsl(var(--color-secondary-700))",
          800: "hsl(var(--color-secondary-800))",
          900: "hsl(var(--color-secondary-900))",
        },
        // Neutral colors (Warm Gray)
        neutral: {
          50: "hsl(var(--color-neutral-50))",
          100: "hsl(var(--color-neutral-100))",
          200: "hsl(var(--color-neutral-200))",
          300: "hsl(var(--color-neutral-300))",
          400: "hsl(var(--color-neutral-400))",
          500: "hsl(var(--color-neutral-500))",
          600: "hsl(var(--color-neutral-600))",
          700: "hsl(var(--color-neutral-700))",
          800: "hsl(var(--color-neutral-800))",
          900: "hsl(var(--color-neutral-900))",
        },
        // Semantic colors
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Semantic state colors
        success: "hsl(var(--color-success))",
        warning: "hsl(var(--color-warning))",
        error: "hsl(var(--color-error))",
        info: "hsl(var(--color-info))",
        // Chart colors
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      // Border radius scale
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      // Spacing scale (4px base unit)
      spacing: {
        "1": "var(--space-1)",
        "2": "var(--space-2)",
        "3": "var(--space-3)",
        "4": "var(--space-4)",
        "5": "var(--space-5)",
        "6": "var(--space-6)",
        "8": "var(--space-8)",
        "10": "var(--space-10)",
        "12": "var(--space-12)",
        "16": "var(--space-16)",
        "20": "var(--space-20)",
        "24": "var(--space-24)",
        // Touch targets
        "touch": "44px",
        "touch-lg": "52px",
        "touch-xl": "60px",
      },
      // Font sizes with line heights
      fontSize: {
        xs: ["var(--text-xs)", { lineHeight: "var(--leading-normal)" }],
        sm: ["var(--text-sm)", { lineHeight: "var(--leading-normal)" }],
        base: ["var(--text-base)", { lineHeight: "var(--leading-relaxed)" }],
        lg: ["var(--text-lg)", { lineHeight: "var(--leading-relaxed)" }],
        xl: ["var(--text-xl)", { lineHeight: "var(--leading-normal)" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "var(--leading-tight)" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "var(--leading-tight)" }],
        "4xl": ["var(--text-4xl)", { lineHeight: "var(--leading-tight)" }],
        "5xl": ["var(--text-5xl)", { lineHeight: "var(--leading-tight)" }],
      },
      // Line height scale
      lineHeight: {
        tight: "var(--leading-tight)",
        normal: "var(--leading-normal)",
        relaxed: "var(--leading-relaxed)",
      },
      // Box shadows
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-md)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        primary: "var(--shadow-primary)",
        secondary: "var(--shadow-secondary)",
        none: "none",
      },
      // Transition durations
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)",
      },
      // Transition timing functions
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
        spring: "var(--ease-spring)",
      },
      // Background images
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--color-primary-600)) 100%)",
        "gradient-secondary": "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--color-secondary-600)) 100%)",
      },
      // Keyframe animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      // Animation utilities
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up var(--duration-normal) var(--ease-out) forwards",
        "scale-in": "scale-in var(--duration-normal) var(--ease-spring) forwards",
        "slide-in-bottom": "slide-in-bottom var(--duration-slow) var(--ease-out) forwards",
        "slide-in-right": "slide-in-right var(--duration-slow) var(--ease-out) forwards",
        shimmer: "shimmer 1.5s ease-in-out infinite",
        "pulse-subtle": "pulse 2s ease-in-out infinite",
      },
      // Screens (mobile-first breakpoints)
      screens: {
        xs: "375px",
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      // Min/max width
      maxWidth: {
        "prose": "65ch",
      },
      // Z-index scale
      zIndex: {
        "dropdown": "50",
        "sticky": "100",
        "modal": "200",
        "popover": "300",
        "toast": "400",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
