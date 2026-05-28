/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
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
        // Brand colors
        brand: {
          purple: {
            dark: "hsl(var(--brand-purple-dark))", // #5e18a4
            medium: "hsl(var(--brand-purple-medium))", // #9a65cb
            light: "hsl(var(--brand-purple-light))", // #c6afdd
            lightest: "hsl(var(--brand-purple-lightest))", // #eae6f6
            alt: {
              dark: "hsl(var(--brand-purple-alt-dark))", // #3814b2
              medium: "hsl(var(--brand-purple-alt-medium))", // #7d65cf
              light: "hsl(var(--brand-purple-alt-light))", // #c5b3e3
            }
          },
          yellow: {
            dark: "hsl(var(--brand-yellow-dark))", // #ffcf14
            medium: "hsl(var(--brand-yellow-medium))", // #ffdf64
            light: "hsl(var(--brand-yellow-light))", // #faefb6
            lightest: "hsl(var(--brand-yellow-lightest))", // #faf7e5
            bright: {
              DEFAULT: "hsl(var(--brand-yellow-bright))", // #fff718
              medium: "hsl(var(--brand-yellow-bright-medium))", // #fff768
              light: "hsl(var(--brand-yellow-bright-light))", // #fff5b2
              lightest: "hsl(var(--brand-yellow-bright-lightest))", // #fbfce4
            }
          }
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "text-gradient": "text-gradient 4s ease infinite",
      },
      keyframes: {
        "text-gradient": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
