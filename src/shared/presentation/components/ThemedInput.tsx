import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors, radius, typography, spacing } from "../styles/theme";

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
  const bgColor = useSharedValue(colors.gray100);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
    backgroundColor: bgColor.value,
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withTiming(colors.primary, { duration: 200 });
    bgColor.value = withTiming(colors.primaryLight, { duration: 200 });
    onFocus?.(undefined as any);
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withTiming(error ? colors.error : colors.border, {
      duration: 200,
    });
    bgColor.value = withTiming(colors.gray100, { duration: 200 });
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
          placeholderTextColor={colors.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.size.overline,
    fontWeight: typography.weight.bold,
    color: colors.textSecondary,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: "uppercase",
    marginLeft: spacing.xs,
  },
  required: {
    color: colors.error,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.size.body,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
  errorContainer: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  errorText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.size.caption,
    color: colors.error,
    marginLeft: spacing.xs,
    marginTop: 2,
  },
});
