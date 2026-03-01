import { pixelBasedPreset, type TailwindConfig } from "@react-email/components";

export default {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        aei: {
          red: "#F14326",
          black: "#282D28",
          body: "#444444",
          muted: "#666666",
          border: "#DDDDDD",
          light: "#F2F2F2",
          bg: "#D4D4C4",
          "light-warm": "#F6F7F5",
          purple: "#8177A5",
          green: "#86C54C",
        },
      },
      fontSize: {
        h1: ["32px", { lineHeight: "1", fontWeight: "700" }],
        h2: ["14px", { lineHeight: "1", fontWeight: "700" }],
        h3: ["12px", { lineHeight: "1.2", fontWeight: "400" }],
        p: ["10px", { lineHeight: "1.2", fontWeight: "400" }],
        "p-small": ["9px", { lineHeight: "1.2", fontWeight: "400" }],
      },
      fontFamily: {
        sans: ["Arial", "Helvetica Neue", "Helvetica", "sans-serif"],
      },
    },
  },
} satisfies TailwindConfig;
