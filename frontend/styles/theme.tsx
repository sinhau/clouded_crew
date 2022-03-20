import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { mode, createBreakpoints } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
  sm: "380px",
  md: "720px",
  lg: "968px",
  xl: "1350px",
  "2xl": "1536px",
});

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

export const customTheme = {
  config,
  breakpoints,
  styles: {
    global: {
      html: {
        scrollBehavior: "smooth",
        fontDisplay: "swap",
      },
      body: {
        minHeight: "100vh",
      },
      svg: {
        display: "inline",
        verticalAlign: "bottom",
      },
    },
  },
  fonts: {
    heading: "McKloud Black, Inter",
    body: "Inter",
  },
  colors: {
    transparent: "transparent",
    black: "#161616",
    white: "#FCFCFC",
    secondary: "#9935ff",
    tertiary: "#3639ff",
    pink: "#F9589C",
    blue: "#58c6f9",
    gray: {
      100: "#d9d5d0",
      200: "#D7E0DD",
    },
  },
  components: {
    Heading: {
      variants: {
        large: {
          fontFamily: "McKloud Black",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "4.5rem",
          lineHeight: "4.5rem",
        },
        medium: {
          fontFamily: "McKloud Black",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "1rem",
          lineHeight: "1rem",
        },
        small: {
          fontFamily: "McKloud Black",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "0.875rem",
          lineHeight: "0.875rem",
        },
      },
    },
    Text: {
      variants: {
        large: {
          fontFamily: "Inter",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "1rem",
          lineHeight: "1.5rem",
        },
        medium: {
          fontFamily: "Inter",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "0.875rem",
          lineHeight: "1.5rem",
        },
        small: {
          fontFamily: "Inter",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "0.75rem",
          lineHeight: "1.25rem",
        },
      },
    },
    Button: {
      variants: {
        primary: {
          bg: "linear-gradient(180deg, white 0%, #FFFFFF 100%)",
          borderRadius: "8px",
          border: "3px solid",
          borderColor: "#678BC7",
          p: "16px",
          color: "black",
          fontFamily: "Inter",
          _hover: {
            textDecoration: "none !important",
          },
          _focus: {
            boxShadow: "none",
          },        },
      },
    },
  },
};

const theme = extendTheme(customTheme);

export default theme;
