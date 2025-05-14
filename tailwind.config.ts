import type { Config } from "tailwindcss";

import colors from "tailwindcss/colors";
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./stores/**/*.{js,ts}",
    "./app.vue",
    "./nuxt.config.{js,ts}",
    // './node_modules/@my-company/tailwind-components/**/*.js',
  ],
  theme: {
    colors: {
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      primaryOpacity: "var(--color-primary-opacity)",
      primaryOpacity4: "var(--color-primary-opacity4)",
      primaryOpacity30: "var(--color-primary-opacity30)",

      // Theme Colors
      themeBg: "var(--theme_bg_clr)",
      themeText: "var(--theme_text_clr)",
      themeSecondaryText: "var(--theme_secondary_text_clr)",
      mainTheme: "var(--main_theme_clr)",
      veryLightTheme: "var(--very_light_theme_clr)",
      softMainTheme: "var(--soft_main_theme_clr)",
      themeLightBlue: "var(--theme_lightblue_color)",
      themeBlue: "var(--theme_blue_color)",
      secondaryTheme: "var(--secondary_theme_clr)",
      lightTheme: "var(--light-theme-clr)",
      themeInputs: "var(--theme_inputs_clr)",
      simpleShadow: "var(--simple_shadow_clr)",
      skeletonLoader: "var(--skeleton_loader_card_clr)",

      // Base Colors
      white: "var(--white_clr)",
      lighterGray: "var(--lighter_gray_clr)",
      lightGray: "var(--light_gray_clr)",
      midGray: "var(--mid_gray_clr)",
      darkGray: "var(--dark_gray_clr)",
      midBlue: "var(--mid_blue_clr)",
      midGreen: "var(--mid_green_clr)",
      deepRed: "var(--deep_red-clr)",
      midRed: "var(--mid_red_clr)",
      lightRed: "var(--light_red_clr)",
      softRed: "var(--soft_red_clr)",
      gold: "var(--gold_clr)",
      softYellow: "var(--soft_yellow_clr)",

      // Brand Colors
      facebook: "var(--facebook_clr)",
      twitter: "var(--twitter_clr)",
      whatsApp: "var(--whatsApp_clr)",
      telegram: "var(--telegram_clr)",
      linkedin: "var(--linkedin_clr)",
      youtube: "var(--youtube_clr)",

      // Dark Theme Support
      dark: {
        themeBg: "var(--theme_bg_clr)",
        themeText: "var(--theme_text_clr)",
        themeSecondaryText: "var(--theme_secondary_text_clr)",
        veryLightTheme: "var(--very_light_theme_clr)",
        softMainTheme: "var(--soft_main_theme_clr)",
        secondaryTheme: "var(--secondary_theme_clr)",
        themeInputs: "var(--theme_inputs_clr)",
        simpleShadow: "var(--simple_shadow_clr)",
      },
      text: "#000000",
      sub: "#7C8089",
      footer: "#E3E7EE",
      textsub: "#303030",
      bordersub: "#D4D9E3",
      // white: colors.white,
      black: colors.black,
      gray: colors.gray,
      red: colors.red,
      blue: colors.blue,
      transparent: colors.transparent,
      green: colors.green,
      yellow: colors.yellow,
      // darkblue: colors.darkblue,
    },
    screens: {
      xs: "425px",
      sm: "576px",
      // => @media (min-width: 640px) { ... }
      md: "768px",
      // => @media (min-width: 768px) { ... }
      lg: "992px",
      // => @media (min-width: 992px) { ... }
      xl: "1200px",
      // => @media (min-width: 1280px) { ... }
      "2xl": "1400px",
      // '3xl': '1600px',
    },
    minHeight: {
      "3/4": "75%",
    },
    maxWidth: {
      "3/4": "75%",
      "2xl": "42rem", // Add max-w-2xl manually
      xs: "2rem", // Add max-w-2xl manually
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "2rem",
        // sm: '1rem',
        // lg: '1rem',
        // xl: '1rem',
        // '2xl': '4rem',
      },
      screens: {
        xs: "100%",
        sm: "100%",
        // => @media (min-width: 640px) { ... }
        md: "100%",
        // => @media (min-width: 768px) { ... }
        lg: "992px",
        // => @media (min-width: 992px) { ... }
        xl: "1200px",
        // => @media (min-width: 1280px) { ... }
        "2xl": "1400px",
      },
    },
    fontFamily: {
      // switzer: ["Switzer", "sans-serif"],
      // din: ["Din", "sans-serif"],
      // poppins: ["Poppins", "sans-serif"],
      // montserrat: ["Montserrat", "sans-serif"],
      arb: ["Arb", "sans-serif"],
      // alumni: ['Alumni', 'sans-serif'],
    },
    opacity: {
      "0": "0",
      "2": ".2",
      "25": ".25",
      "50": ".5",
      "75": ".75",
      "10": ".1",
      "20": ".2",
      "30": ".3",
      "40": ".4",
      "60": ".6",
      "70": ".7",
      "80": ".8",
      "90": ".9",
      "100": "1",
    },
    borderWidth: {
      DEFAULT: "1px",
      "0": "0px",
      "1": "1px",
      "2": "2px",
      "3": "3px",
      "4": "4px",
      "5": "5px",
      "6": "6px",
      "7": "7px",
      "8": "8px",
      "9": "9px",
      "10": "10px",
      "11": "11px",
      "12": "12px",
      "13": "13px",
      "14": "14px",
      "15": "15px",
      "16": "16px",
    },
    extend: {
      // typography: {
      //   DEFAULT: {
      //     css: {
      //       h1: {
      //         fontSize: "2.25rem", // text-4xl
      //         fontWeight: "bold",
      //         color: "var(--theme-text-clr)",
      //       },
      //       h2: {
      //         fontSize: "2rem", // text-3xl
      //         fontWeight: "semibold",
      //         color: "rgba(0, 0, 0, .85)",
      //       },
      //       h3: {
      //         fontSize: "1.5rem", // text-2xl
      //         fontWeight: "medium",
      //         color: "var(--theme-text-clr)",
      //       },
      //       p: {
      //         fontSize: "1.125rem", // text-lg
      //         color: "#4B5563", // gray-700
      //         lineHeight: "1.75",
      //       },
      //       strong: {
      //         fontWeight: "bold",
      //         color: "#000",
      //       },
      //     },
      //   },
      // },
      boxShadow: {
        "custom-shadow": "0 4px 50px 0px rgba(0, 0, 0, 0.6)",
      },

      backgroundImage: {
        "custom-gradient": "linear-gradient(180deg, #1E3A81 0%, #0E45D0 73.5%)",
        "custom-gradient1":
          "linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)",
      },
      keyframes: {
        accordionUp: {
          "0%": { height: "var(--radix-accordion-content-height)" },
          "100%": { height: "0" },
        },
        accordionDown: {
          "0%": { height: "0" },
          "100%": { height: "var(--radix-accordion-content-height)" },
        },
      },
      animation: {
        "accordion-up": "accordionUp 0.3s ease-out",
        "accordion-down": "accordionDown 0.3s ease-out",
      },
      transitionProperty: {
        "font-weight": "font-weight",
      },
    },
  },
  darkMode: "class", // Enables Dark Mode

  plugins: [],
} satisfies Config;
