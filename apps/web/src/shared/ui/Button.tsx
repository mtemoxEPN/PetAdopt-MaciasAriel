import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { CSSProperties } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  disabled?: boolean;
  isLoading?: boolean;
}

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  isLoading,
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  const base: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "15px 28px",
    borderRadius: 18,
    fontSize: "16px",
    fontWeight: 600,
    cursor: isDisabled ? "not-allowed" : "pointer",
    border: "none",
    width: "100%",
    opacity: isDisabled ? 0.5 : 1,
    outline: "none",
    fontFamily: "inherit",
    position: "relative",
    background: "rgba(255, 255, 255, 0.01)",
    backgroundBlendMode: "luminosity",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1)",
    color: "#fff",
    letterSpacing: "0.2px",
    overflow: "hidden",
  };

  const glowBorder: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 18,
    padding: "1.4px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, transparent 40%, transparent 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%)",
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    pointerEvents: "none",
  };

  const hoverAnimation =
    !isDisabled
      ? {
          scale: 1.03,
          boxShadow:
            "inset 0 1px 1px rgba(255,255,255,0.18), 0 4px 24px rgba(255,255,255,0.06)",
          background: "rgba(255, 255, 255, 0.025)",
        }
      : {};

  const tapAnimation = !isDisabled
    ? {
        scale: 0.96,
      }
    : {};

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 22,
        mass: 0.8,
      }}
      style={base}
    >
      {/* Liquid glass border pseudo-element */}
      <div style={glowBorder} />

      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
          style={{ display: "inline-flex", position: "relative", zIndex: 1 }}
        >
          <Loader2 size={20} strokeWidth={1.8} color="#fff" />
        </motion.div>
      ) : (
        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      )}
    </motion.button>
  );
};
