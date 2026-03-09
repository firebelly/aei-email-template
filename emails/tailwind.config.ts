import { pixelBasedPreset, type TailwindConfig } from "@react-email/components";

export default {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        aei: {
          red: "#ef4734",
          black: "#282826",
          "quartz-gray": "#d1ccc1",
          "light-gray": "#f5f1ed",
          purple: "#8373a5",
          green: "#8EC150",
          teal: "#49B7B6",
          blue: "#5193BF",
          yellow: "#FCC947",
        },
      },
      fontSize: {
        h1: ["32px", { lineHeight: "1", fontWeight: "700" }],
        h2: ["14px", { lineHeight: "1", fontWeight: "700" }],
        h3: ["12px", { lineHeight: "1.3", fontWeight: "400" }],
        p: ["11px", { lineHeight: "1.3", fontWeight: "400" }],
        "p-small": ["10px", { lineHeight: "1.2", fontWeight: "400" }],
      },
      fontFamily: {
        sans: ["Arial", "Helvetica Neue", "Helvetica", "sans-serif"],
      },
    },
  },
} satisfies TailwindConfig;
