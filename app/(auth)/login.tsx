import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { ThemedButton } from "@shared/presentation/components/ThemedButton";
import { ThemedInput } from "@shared/presentation/components/ThemedInput";
import { colors, spacing, typography, radius, validators, validationMessages } from "@shared/presentation/styles/theme";
import { supabase } from "@shared/infrastructure/supabase/client";
import { Link, useRouter } from "expo-router";
import { useState, useCallback } from "react";
import {
  Alert,
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
import { PawPrint, Home, Eye, EyeOff } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, isLoading, error } = useAuth();
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

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const redirectUrl = makeRedirectUri({ scheme: "petadopt" });
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: { prompt: "select_account" },
          skipBrowserRedirect: true,
        },
      });
      if (oauthError || !data?.url) {
        Alert.alert("Error", oauthError?.message ?? "No se pudo obtener la URL de Google.");
        return;
      }
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      if (result.type === "success") {
        const callbackUrl = result.url.includes("#")
          ? result.url.replace("#", "?")
          : result.url;
        const { params } = QueryParams.getQueryParams(callbackUrl);
        if (params?.access_token && params?.refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          if (sessionError) Alert.alert("Error", sessionError.message);
        } else {
          Alert.alert("Error", "No se recibieron tokens de Google. Intenta nuevamente.");
        }
      }
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Error en el inicio de sesión con Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

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
        <Animated.View
          entering={FadeInUp.duration(600).delay(250)}
          collapsable={false}
          style={{ backgroundColor: "transparent" }}
        >
          <View style={styles.card}>
            <View style={styles.accentBar} />
            <Text style={styles.titleLight}>Bienvenido</Text>
            <Text style={styles.titleBold}>de vuelta.</Text>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
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
                secureTextEntry={!showPassword}
                error={errors.password}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
                    {showPassword ? <EyeOff size={20} color={colors.textTertiary} /> : <Eye size={20} color={colors.textTertiary} />}
                  </TouchableOpacity>
                }
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
                <Text style={styles.dividerText}>— o continúa con —</Text>
                <View style={styles.dividerLine} />
              </View>

              <ThemedButton
                variant="outline"
                size="md"
                onPress={handleGoogleSignIn}
                isLoading={googleLoading}
              >
                {googleLoading ? "Conectando..." : "Continuar con Google"}
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
          </View>
        </Animated.View>

        <Animated.Text entering={FadeIn.duration(800).delay(500)} style={styles.footer}>
          Cada mascota merece un hogar
        </Animated.Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing["5xl"],
    backgroundColor: 'transparent',
  },
  header: { alignItems: "center", marginBottom: spacing["2xl"] },
  brand: {
    fontSize: typography.size.hero,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: -1,
    marginTop: spacing.md,
  },
  tagline: {
    fontSize: typography.size.body,
    color: colors.white,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radius["2xl"],
    padding: spacing["2xl"],
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleLight: {
    fontSize: typography.size.h1,
    fontWeight: typography.weight.light,
    color: colors.textTertiary,
    letterSpacing: -0.3,
  },
  titleBold: {
    fontSize: typography.size.h1,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -1,
    marginTop: -6,
    marginBottom: spacing.lg,
  },
  errorBox: {
    backgroundColor: "rgba(255,255,255,0.6)",
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
    fontWeight: typography.weight.semibold,
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
    color: colors.white,
  },
  accentBar: {
    height: 4,
    width: 48,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
});
