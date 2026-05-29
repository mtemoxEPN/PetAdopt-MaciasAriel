import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { ThemedButton } from "@shared/presentation/components/ThemedButton";
import { ThemedInput } from "@shared/presentation/components/ThemedInput";
import { colors, spacing, typography, shadows, radius, validators, validationMessages } from "@shared/presentation/styles/theme";
import { Link, useRouter } from "expo-router";
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
import Animated, {
  FadeInUp,
  FadeIn,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, loginWithGoogle, isLoading, error } = useAuth();
  const router = useRouter();

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!validators.required(email)) newErrors.email = validationMessages.required;
    else if (!validators.email(email)) newErrors.email = validationMessages.email;
    if (!validators.required(password)) newErrors.password = validationMessages.required;
    else if (!validators.password(password)) newErrors.password = validationMessages.password;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleLogin = useCallback(() => {
    if (validate()) login({ email, password });
  }, [validate, login, email, password]);

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
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.header}>
          <LottieView
            source={require("../../assets/animations/pet-walk.json")}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
          />
          <Text style={styles.brand}>PetAdopt</Text>
          <Text style={styles.tagline}>Encuentra a tu compañero ideal</Text>
        </Animated.View>

        {/* Card */}
        <Animated.View entering={FadeInUp.duration(600).delay(250)} style={styles.card}>
          <Text style={styles.titleLight}>Bienvenido</Text>
          <Text style={styles.titleBold}>de vuelta.</Text>

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
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email}
            />

            <ThemedInput
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
              secureTextEntry
              error={errors.password}
            />

            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <ThemedButton
              variant="primary"
              size="lg"
              onPress={handleLogin}
              isLoading={isLoading}
            >
              Iniciar Sesión
            </ThemedButton>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <ThemedButton
              variant="outline"
              size="md"
              onPress={loginWithGoogle}
            >
              🌐 Continuar con Google
            </ThemedButton>

            <Link href="/(auth)/register" asChild>
              <TouchableOpacity style={styles.registerLink} activeOpacity={0.7}>
                <Text style={styles.registerText}>
                  ¿No tienes cuenta?{" "}
                  <Text style={styles.registerHighlight}>Crear una</Text>
                </Text>
              </TouchableOpacity>
            </Link>
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

  forgotText: {
    fontSize: typography.size.bodySmall,
    color: colors.primary,
    textAlign: "right",
    fontWeight: typography.weight.medium,
  },

  divider: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textTertiary, fontSize: typography.size.bodySmall },

  registerLink: { alignItems: "center", paddingVertical: spacing.sm },
  registerText: { color: colors.textSecondary, fontSize: typography.size.bodySmall },
  registerHighlight: { color: colors.primary, fontWeight: typography.weight.semibold },

  footer: {
    textAlign: "center",
    marginTop: spacing["2xl"],
    fontSize: typography.size.caption,
    color: colors.textTertiary,
  },
});
