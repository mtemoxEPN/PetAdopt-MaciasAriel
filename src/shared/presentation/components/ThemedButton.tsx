import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TouchableOpacityProps,
} from "react-native";
import { colors, shadows, radius, typography, spacing } from "../styles/theme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ThemedButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  onPressIn,
  onPressOut,
  style,
  ...props
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 80 });
    onPressIn?.(undefined as any);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 400, damping: 18 });
    onPressOut?.(undefined as any);
  };

  const isDisabled = disabled || isLoading;

  const variantStyles = {
    primary: {
      background: colors.primary,
      text: colors.textInverse,
      border: "transparent",
      shadow: shadows.primary,
    },
    secondary: {
      background: colors.secondaryLight,
      text: colors.secondary,
      border: "transparent",
      shadow: shadows.xs,
    },
    outline: {
      background: colors.background,
      text: colors.textPrimary,
      border: colors.border,
      shadow: shadows.glass,
    },
    ghost: {
      background: "transparent",
      text: colors.textSecondary,
      border: "transparent",
      shadow: {},
    },
  };

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 18, fontSize: 13 },
    md: { paddingVertical: 14, paddingHorizontal: 26, fontSize: 15 },
    lg: { paddingVertical: 17, paddingHorizontal: 32, fontSize: 16 },
  };

  const vs = variantStyles[variant];
  const sz = sizeStyles[size];

  return (
    <Animated.View style={[animatedStyle, vs.shadow]}>
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={isDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.base,
          {
            backgroundColor: vs.background,
            borderColor: vs.border,
            paddingVertical: sz.paddingVertical,
            paddingHorizontal: sz.paddingHorizontal,
            opacity: isDisabled ? 0.45 : 1,
          },
          style,
        ]}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator color={vs.text} size="small" />
        ) : (
          <>
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            <Text style={[styles.text, { color: vs.text, fontSize: sz.fontSize }]}>
              {children}
            </Text>
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    minHeight: 52,
  },
  text: {
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.2,
  },
  iconLeft: { marginRight: 4 },
  iconRight: { marginLeft: 4 },
});
