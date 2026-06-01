import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { colors, radius, typography, spacing, shadows } from "../styles/theme";

interface ThemedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

export const ThemedInput: React.FC<ThemedInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(colors.border);
  const bgColor = useSharedValue(colors.background);
  const glowOpacity = useSharedValue(0);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
    backgroundColor: bgColor.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withTiming(colors.borderFocus, { duration: 180 });
    bgColor.value = withTiming("rgba(255,240,237,0.50)", { duration: 180 });
    glowOpacity.value = withTiming(1, { duration: 200 });
    onFocus?.(undefined as any);
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withTiming(error ? colors.error : colors.border, { duration: 180 });
    bgColor.value = withTiming(colors.background, { duration: 180 });
    glowOpacity.value = withTiming(0, { duration: 200 });
    onBlur?.(undefined as any);
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={styles.label}>
          {label}
          {props.required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View>
        <Animated.View style={[styles.glow, glowStyle]} />
        <Animated.View
          style={[
            styles.container,
            animatedContainerStyle,
            error && !isFocused && styles.errorContainer,
          ]}
        >
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <TextInput
            style={[styles.input, style]}
            placeholderTextColor={colors.textMuted}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </Animated.View>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.size.overline,
    fontWeight: typography.weight.semibold,
    color: colors.textTertiary,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: "uppercase",
    marginLeft: spacing.xs + 2,
  },
  required: { color: colors.primary },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    minHeight: 54,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.full,
    backgroundColor: colors.primaryGlow,
    zIndex: -1,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.size.body,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
    backgroundColor: "transparent",
  },
  iconLeft: { marginRight: spacing.xs },
  iconRight: { marginLeft: spacing.xs },
  errorContainer: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  errorText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.size.caption,
    color: colors.error,
    marginLeft: spacing.lg,
    marginTop: 2,
  },
});
