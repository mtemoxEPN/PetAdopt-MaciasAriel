/**
 * Light & Clean Design System for PetAdopt
 * Minimalista, profesional, inspirado en Apple.
 * Modo oscuro PROHIBIDO. Solo tema claro.
 */

import { Platform } from "react-native";

/* ─── Colores ─── */
export const colors = {
  // Base
  white: "#FFFFFF",
  offWhite: "#FAFAFA",
  background: "#F5F5F7",
  surface: "#FFFFFF",

  // Texto
  textPrimary: "#1D1D1F",
  textSecondary: "#6E6E73",
  textTertiary: "#A1A1A6",
  textInverse: "#FFFFFF",

  // Acento PetAdopt (naranja cálido)
  primary: "#F97316",
  primaryLight: "#FFF7ED",
  primaryHover: "#EA580C",

  // Estados
  success: "#22C55E",
  successLight: "#DCFCE7",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  error: "#EF4444",
  errorLight: "#FEF2F2",
  info: "#3B82F6",
  infoLight: "#EFF6FF",

  // Bordes y separadores
  border: "#E5E5EA",
  borderLight: "#F2F2F7",
  divider: "#D1D1D6",

  // Específicos
  dark: "#1C1917",
  gray100: "#F5F5F4",
  gray200: "#E7E5E4",
  gray300: "#D6D3D1",
  gray400: "#A8A29E",
  gray500: "#78716C",
  gray600: "#57534E",
};

/* ─── Tipografía ─── */
export const typography = {
  // Inter para UI (via Google Fonts en web o system-ui en nativo)
  fontFamily: {
    sans: Platform.select({
      ios: "Inter",
      android: "Inter",
      default: "Inter, system-ui, -apple-system, sans-serif",
    }),
    serif: Platform.select({
      ios: "Instrument Serif",
      android: "Instrument Serif",
      default: "Instrument Serif, Georgia, serif",
    }),
    body: Platform.select({
      ios: "Barlow",
      android: "Barlow",
      default: "Barlow, Inter, system-ui, sans-serif",
    }),
  },

  // Tamaños
  size: {
    hero: 40,
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 16,
    bodySmall: 14,
    caption: 12,
    overline: 10,
  },

  // Pesos
  weight: {
    light: "300" as const,
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },

  // Altura de línea
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Tracking
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1.5,
  },
};

/* ─── Sombras suaves (Soft Shadows) ─── */
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
  },
  primary: {
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};

/* ─── Espaciado ─── */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
};

/* ─── Radios de borde ─── */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999,
};

/* ─── Transiciones / Animaciones ─── */
export const transitions = {
  fast: { duration: 150, easing: "easeOut" as const },
  normal: { duration: 250, easing: "easeInOut" as const },
  slow: { duration: 400, easing: "easeInOut" as const },
  spring: { type: "spring" as const, stiffness: 300, damping: 24 },
};

/* ─── Helper: validación de formularios ─── */
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
