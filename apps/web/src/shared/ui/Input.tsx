import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}

export const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "100%",
      }}
    >
      <label
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#9ca3af",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginLeft: "4px",
        }}
      >
        {label}
      </label>
      <motion.input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        animate={{
          borderColor: error
            ? "rgba(239,68,68,0.5)"
            : isFocused
              ? "rgba(255,255,255,0.35)"
              : "rgba(255,255,255,0.08)",
          boxShadow:
            isFocused && !error
              ? "0 0 0 3px rgba(255,255,255,0.06), inset 0 1px 1px rgba(255,255,255,0.1)"
              : error
                ? "0 0 0 3px rgba(239,68,68,0.08)"
                : "inset 0 1px 1px rgba(255,255,255,0.06)",
        }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          padding: "16px 18px",
          border: "1.5px solid",
          borderRadius: 16,
          fontSize: "16px",
          color: "#fff",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          outline: "none",
          fontFamily: "inherit",
          width: "100%",
          letterSpacing: "0.3px",
        }}
      />
      <AnimatePresence mode="wait">
        {error && (
          <motion.span
            key="error-msg"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              fontSize: "13px",
              color: "#f87171",
              marginLeft: "4px",
              fontWeight: 500,
            }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
