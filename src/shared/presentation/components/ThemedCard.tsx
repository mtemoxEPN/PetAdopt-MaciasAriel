import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { colors, radius } from "../styles/theme";

interface ThemedCardProps extends ViewProps {
  variant?: "default" | "elevated" | "outlined" | "glass";
  children: React.ReactNode;
  pressable?: boolean;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  children,
  variant = "default",
  pressable = false,
  style,
  ...props
}) => {
  const variantStyles = {
    default: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    elevated: {
      backgroundColor: colors.background,
      borderColor: "rgba(139,110,82,0.06)",
    },
    outlined: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    glass: {
      backgroundColor: colors.background,
      borderColor: "rgba(139,110,82,0.06)",
    },
  };

  const vs = variantStyles[variant];

  return (
    <View
      style={[
        styles.base,
        vs,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    borderWidth: 1,
  },
});