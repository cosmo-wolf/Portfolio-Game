const THEMES = {
  JUNGLE: {
    DAY: {
      skyTop: "#f8f3de",
      skyBottom: "#c2c39a",
      ground: "#a5ac79",
      accent: "#6e7c3a",
      uiSurface: "rgba(248, 245, 229, 0.75)",
      uiText: "#42532a"
    },
    NIGHT: {
      skyTop: "#111a1f",
      skyBottom: "#1e2b2f",
      ground: "#2e3a32",
      accent: "#8ddf86",
      uiSurface: "rgba(16, 24, 20, 0.74)",
      uiText: "#b7e5bb"
    }
  },
  CITY: {
    DAY: {
      skyTop: "#dddfe6",
      skyBottom: "#aab0bb",
      ground: "#868d97",
      accent: "#08a8f0",
      uiSurface: "rgba(236, 238, 243, 0.78)",
      uiText: "#24343f"
    },
    NIGHT: {
      skyTop: "#0a0c18",
      skyBottom: "#181333",
      ground: "#151825",
      accent: "#19f7ff",
      uiSurface: "rgba(10, 12, 24, 0.72)",
      uiText: "#7cf5ff"
    }
  }
};

export class ThemeManager {
  constructor() {
    this.biome = "JUNGLE";
    this.time = "DAY";
    this.terminalMode = "ECO_LIGHT";
  }

  toggleBiome() {
    this.biome = this.biome === "JUNGLE" ? "CITY" : "JUNGLE";
  }

  toggleTime() {
    this.time = this.time === "DAY" ? "NIGHT" : "DAY";
  }

  toggleTerminalMode() {
    this.terminalMode = this.terminalMode === "ECO_LIGHT" ? "MATRIX_DARK" : "ECO_LIGHT";
  }

  getWorldTheme() {
    return THEMES[this.biome][this.time];
  }

  isNight() {
    return this.time === "NIGHT";
  }
}
