import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { colors, shadows, radius } from "../styles/theme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ThemedCardProps extends ViewProps {
  variant?: "default" | "elevated" | "outlined";
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
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (pressable) {
      scale.value = withTiming(0.98, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (pressable) {
      scale.value = withTiming(1, { duration: 150 });
    }
  };

  const variantStyles = {
    default: {
      backgroundColor: colors.surface,
      borderColor: "transparent",
      shadow: shadows.md,
    },
    elevated: {
      backgroundColor: colors.surface,
      borderColor: "transparent",
      shadow: shadows.lg,
    },
    outlined: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadow: {},
    },
  };

  const vs = variantStyles[variant];

  return (
    <Animated.View
      style={[
        animatedStyle,
        styles.base,
        {
          backgroundColor: vs.backgroundColor,
          borderColor: vs.borderColor,
          ...vs.shadow,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    borderWidth: 1.5,
    overflow: "hidden",
  },
});
