import { Platform } from "react-native";

export const colors = {
  // Base — Pure & Pearl
  white: "#FFFFFF",
  background: "#FEFCFA",
  surface: "#FEFCFA",           // antes: "rgba(255,255,255,0.82)"
  surfaceSolid: "#FEFAF7",
  surfaceWarm: "#FFF9F5",
  surfacePearl: "#F8F4F0",

  // Primario — Tomate Vibrante
  primary: "#E54D2E",
  primaryLight: "#FFF0ED",
  primaryGlow: "rgba(229,77,46,0.12)",
  primaryHover: "#C73E21",
  primaryDark: "#9F2D16",

  // Secundario — Café Espresso / Latte
  secondary: "#5C3D2E",
  secondaryLight: "#F5EDE8",
  secondaryHover: "#3E2A1E",

  // Acento — Mocha
  accent: "#8B6E52",
  accentLight: "#F0E6DC",
  accentHover: "#6B5340",

  // Texto — Café Jerarquía
  textPrimary: "#1C0A00",
  textSecondary: "#6B4F3A",
  textTertiary: "#A8896C",
  textInverse: "#FFFFFF",
  textMuted: "#C4A882",

  // Estados
  success: "#16A34A",
  successLight: "#ECFDF5",
  warning: "#D97706",
  warningLight: "#FFFBEB",
  error: "#DC2626",
  errorLight: "#FEF2F2",
  info: "#7C3AED",
  infoLight: "#F3EEFF",

  // Bordes — Ultra finos
  border: "rgba(14, 14, 14, 0.1)",
  borderLight: "rgba(139,110,82,0.06)",
  borderFocus: "rgba(229,77,46,0.30)",
  divider: "rgba(139,110,82,0.08)",

  // Grises cálidos Café
  gray50: "#FDFAF7",
  gray100: "#F8F4F0",
  gray200: "#F0E6DC",
  gray300: "#DFC9B5",
  gray400: "#C4A882",
  gray500: "#A8896C",
  gray600: "#8B6E52",
};

export const typography = {
  fontFamily: {
    sans: Platform.select({ ios: "Inter", android: "Inter", default: "Inter, system-ui, sans-serif" }),
    serif: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    body: Platform.select({ ios: "Inter", android: "Inter", default: "Inter, system-ui, sans-serif" }),
  },
  size: {
    hero: 44,
    h1: 34,
    h2: 26,
    h3: 20,
    h4: 17,
    body: 15,
    bodySmall: 13,
    caption: 11,
    overline: 9,
  },
  weight: {
    light: "300" as const,
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },
  lineHeight: { tight: 1.15, normal: 1.45, relaxed: 1.7 },
  letterSpacing: { tight: -1, normal: 0, wide: 0.5, wider: 2 },
};

export const shadows = {
  // Sombras difusas café — nunca negro
  xs: {
    shadowColor: "#8B6E52",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: "#8B6E52",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: "#8B6E52",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: "#8B6E52",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 8,
  },
  xl: {
    shadowColor: "#8B6E52",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 12,
  },
  primary: {
    shadowColor: "#E54D2E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 8,
  },
  primarySm: {
    shadowColor: "#E54D2E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  glass: {
    shadowColor: "#8B6E52",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 0,
  },
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20,
  "2xl": 24, "3xl": 32, "4xl": 40, "5xl": 48, "6xl": 64, "7xl": 80,
};

export const radius = {
  sm: 12, md: 16, lg: 20, xl: 24, "2xl": 32, "3xl": 40, full: 9999,
};

export const transitions = {
  fast: { duration: 120 },
  normal: { duration: 220 },
  slow: { duration: 380 },
  spring: { type: "spring" as const, stiffness: 320, damping: 24 },
};

export const validators = {
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  password: (v: string) => v.length >= 8,
  username: (v: string) => /^[a-zA-Z0-9_]{3,20}$/.test(v),
  required: (v: string) => v.trim().length > 0,
  phone: (v: string) => /^\+?[0-9\s-]{8,}$/.test(v),
};

export const validationMessages = {
  email: "Ingresa un correo válido",
  password: "Mínimo 8 caracteres",
  username: "3-20 caracteres alfanuméricos",
  required: "Este campo es obligatorio",
  phone: "Teléfono inválido",
};
