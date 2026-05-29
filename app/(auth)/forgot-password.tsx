import {
  colors,
  spacing,
  typography,
  shadows,
  radius,
  validators,
  validationMessages,
} from "@shared/presentation/styles/theme";
import { ThemedButton } from "@shared/presentation/components/ThemedButton";
import { ThemedInput } from "@shared/presentation/components/ThemedInput";
import { useState, useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "@shared/infrastructure/supabase/client";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState("");
  const router = useRouter();

  const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL!;

  const validate = useCallback(() => {
    if (!validators.required(email)) {
      setFieldError(validationMessages.required);
      return false;
    }
    if (!validators.email(email)) {
      setFieldError(validationMessages.email);
      return false;
    }
    setFieldError("");
    return true;
  }, [email]);

  const handleSend = async () => {
    if (!validate()) return;
    setError(null);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${WEB_URL}/reset-password` }
      );
      if (error) throw error;
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.root}>
        <Animated.View
          entering={FadeInUp.duration(600)}
          style={styles.successContainer}
        >
          <Text style={styles.successIcon}>📧</Text>
          <Text style={styles.successTitle}>¡Revisa tu correo!</Text>
          <Text style={styles.successText}>
            Enviamos un enlace a{"\n"}
            <Text style={styles.successEmail}>{email}</Text>
            {"\n"}para restablecer tu contraseña.
          </Text>
          <ThemedButton variant="primary" onPress={() => router.replace("/(auth)/login")}>
            Ir al Login
          </ThemedButton>
        </Animated.View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.header}>
          <Text style={styles.logo}>🐾</Text>
          <Text style={styles.brand}>PetAdopt</Text>
          <Text style={styles.tagline}>Recupera tu acceso</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(250)} style={styles.card}>
          <Text style={styles.titleLight}>Olvidé mi</Text>
          <Text style={styles.titleBold}>contraseña.</Text>

          <Text style={styles.subtitle}>
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <ThemedInput
              label="Correo electrónico"
              placeholder="tu@correo.com"
              value={email}
              onChangeText={(text: string) => {
                setEmail(text);
                if (fieldError) setFieldError("");
                if (error) setError(null);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              error={fieldError}
              required
            />

            <ThemedButton
              variant="primary"
              size="lg"
              onPress={handleSend}
              isLoading={isLoading}
            >
              Enviar enlace 🐾
            </ThemedButton>

            <TouchableOpacity
              style={styles.backLink}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.backText}>← Volver al login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.Text entering={FadeIn.duration(800).delay(500)} style={styles.footer}>
          Cada mascota merece un hogar 🏠
        </Animated.Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing["5xl"],
  },

  header: { alignItems: "center", marginBottom: spacing["2xl"] },
  logo: { fontSize: 56, marginBottom: 8 },
  brand: {
    fontFamily: typography.fontFamily.serif,
    fontSize: typography.size.h1,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
  tagline: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing["2xl"],
    ...shadows.lg,
  },

  titleLight: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.size.h1,
    fontWeight: typography.weight.light,
    color: colors.textTertiary,
    letterSpacing: typography.letterSpacing.tight,
  },
  titleBold: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.size.h1,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
    marginTop: -4,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },

  errorBox: {
    backgroundColor: colors.errorLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: { color: colors.error, fontSize: typography.size.caption },

  form: { gap: spacing.md },

  backLink: { alignItems: "center", paddingVertical: spacing.sm },
  backText: { color: colors.textSecondary, fontSize: typography.size.bodySmall },

  footer: {
    textAlign: "center",
    marginTop: spacing["2xl"],
    fontSize: typography.size.caption,
    color: colors.textTertiary,
  },

  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["3xl"],
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  successIcon: { fontSize: 64 },
  successTitle: {
    fontSize: typography.size.h2,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  successText: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  successEmail: { color: colors.primary, fontWeight: typography.weight.semibold },
});
