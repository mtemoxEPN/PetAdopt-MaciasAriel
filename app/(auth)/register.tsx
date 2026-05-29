import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { ThemedButton } from "@shared/presentation/components/ThemedButton";
import { ThemedInput } from "@shared/presentation/components/ThemedInput";
import {
  colors,
  spacing,
  typography,
  shadows,
  radius,
  validators,
  validationMessages,
} from "@shared/presentation/styles/theme";
import { Link, useRouter } from "expo-router";
import { useState, useCallback } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { WebView } from "react-native-webview";

export default function RegisterScreen() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"adoptante" | "refugio">("adoptante");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [showMap, setShowMap] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const { register, isLoading, error } = useAuth();

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!validators.required(fullName)) newErrors.fullName = validationMessages.required;
    if (!validators.required(username)) newErrors.username = validationMessages.required;
    else if (!validators.username(username)) newErrors.username = validationMessages.username;
    if (!validators.required(email)) newErrors.email = validationMessages.required;
    else if (!validators.email(email)) newErrors.email = validationMessages.email;
    if (!validators.required(password)) newErrors.password = validationMessages.required;
    else if (!validators.password(password)) newErrors.password = validationMessages.password;
    if (role === "refugio" && !lat) newErrors.location = "Selecciona la ubicación del refugio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fullName, username, email, password, role, lat]);

  const handleRegister = useCallback(() => {
    if (validate()) {
      register(
        { email, password, username, role, fullName, lat, lng, address },
        { onSuccess: () => setEmailSent(true) }
      );
    }
  }, [validate, register, email, password, username, role, fullName, lat, lng, address]);

  const mapPickerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>body, html { margin: 0; padding: 0; height: 100%; width: 100%; }</style>
    </head>
    <body>
      <div id="map" style="height: 100vh; width: 100vw;"></div>
      <script>
        const map = L.map('map', { zoomControl: false }).setView([-0.1807, -78.4678], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        let currentMarker;
        map.on('click', function(e) {
          if (currentMarker) map.removeLayer(currentMarker);
          currentMarker = L.marker(e.latlng).addTo(map);
          window.ReactNativeWebView.postMessage(JSON.stringify({ lat: e.latlng.lat, lng: e.latlng.lng }));
        });
      </script>
    </body>
    </html>
  `;

  if (emailSent) {
    return (
      <View style={styles.root}>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.successContainer}>
          <Text style={styles.successIcon}>✉️</Text>
          <Text style={styles.successTitle}>¡Revisa tu correo!</Text>
          <Text style={styles.successText}>
            Enviamos un enlace de verificación a{"\n"}
            <Text style={styles.successEmail}>{email}</Text>
          </Text>
          <Link href="/(auth)/login" asChild>
            <ThemedButton variant="primary">Ir al Login</ThemedButton>
          </Link>
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
          <Text style={styles.tagline}>Únete y ayuda a los animales</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(250)} style={styles.card}>
          <Text style={styles.titleLight}>Crear</Text>
          <Text style={styles.titleBold}>cuenta.</Text>

          <Text style={styles.sectionLabel}>SOY UN</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[
                styles.roleBtn,
                role === "adoptante" && styles.roleBtnActive,
              ]}
              onPress={() => setRole("adoptante")}
            >
              <Text style={styles.roleIcon}>🏠</Text>
              <Text
                style={[
                  styles.roleLabel,
                  role === "adoptante" && styles.roleLabelActive,
                ]}
              >
                Adoptante
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleBtn,
                role === "refugio" && styles.roleBtnActive,
              ]}
              onPress={() => setRole("refugio")}
            >
              <Text style={styles.roleIcon}>🏥</Text>
              <Text
                style={[
                  styles.roleLabel,
                  role === "refugio" && styles.roleLabelActive,
                ]}
              >
                Refugio
              </Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <ThemedInput
              label={role === "refugio" ? "Nombre del refugio" : "Nombre completo"}
              placeholder={role === "refugio" ? "Refugio Esperanza" : "Tu nombre"}
              value={fullName}
              onChangeText={(text: string) => {
                setFullName(text);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              error={errors.fullName}
              required
            />

            <ThemedInput
              label="Usuario"
              placeholder="sin espacios"
              value={username}
              onChangeText={(text: string) => {
                setUsername(text);
                if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
              }}
              autoCapitalize="none"
              error={errors.username}
              required
            />

            <ThemedInput
              label="Correo electrónico"
              placeholder="tu@correo.com"
              value={email}
              onChangeText={(text: string) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email}
              required
            />

            <ThemedInput
              label="Contraseña"
              placeholder="Mín. 8 caracteres"
              value={password}
              onChangeText={(text: string) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
              secureTextEntry
              error={errors.password}
              required
            />

            {role === "refugio" && (
              <>
                <ThemedInput
                  label="Dirección del refugio"
                  placeholder="Ej: Av. Principal 123"
                  value={address}
                  onChangeText={setAddress}
                />
                <View>
                  <Text style={styles.mapLabel}>UBICACIÓN EN EL MAPA</Text>
                  <TouchableOpacity
                    style={[
                      styles.mapBtn,
                      errors.location && styles.mapBtnError,
                    ]}
                    onPress={() => setShowMap(true)}
                  >
                    <Text style={styles.mapBtnText}>
                      {lat && lng
                        ? "📍 Ubicación seleccionada"
                        : "🗺️ Toca para elegir en el mapa"}
                    </Text>
                  </TouchableOpacity>
                  {errors.location && (
                    <Text style={styles.mapError}>{errors.location}</Text>
                  )}
                </View>
              </>
            )}

            <ThemedButton
              variant="primary"
              size="lg"
              onPress={handleRegister}
              isLoading={isLoading}
            >
              Crear Cuenta
            </ThemedButton>

            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={styles.loginLink} activeOpacity={0.7}>
                <Text style={styles.loginText}>
                  ¿Ya tienes cuenta?{" "}
                  <Text style={styles.loginHighlight}>Inicia sesión</Text>
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Modal del Mapa */}
      <Modal visible={showMap} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeaderMap}>
            <View>
              <Text style={styles.modalTitle}>
                Toca el mapa para fijar tu refugio
              </Text>
              {isFetchingAddress && (
                <Text style={{ fontSize: 12, color: colors.primary }}>
                  📍 Buscando dirección...
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowMap(false);
                if (errors.location)
                  setErrors((prev) => ({ ...prev, location: "" }));
              }}
              style={styles.modalCloseBtn}
              disabled={!lat || !lng}
            >
              <Text
                style={[
                  styles.modalCloseText,
                  (!lat || !lng) && { opacity: 0.4 },
                ]}
              >
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>

          <WebView
            originWhitelist={["*"]}
            source={{ html: mapPickerHtml }}
            style={{ flex: 1 }}
            onMessage={async (event) => {
              const data = JSON.parse(event.nativeEvent.data);
              setLat(data.lat);
              setLng(data.lng);

              try {
                setIsFetchingAddress(true);
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${data.lat}&lon=${data.lng}`,
                  { headers: { "User-Agent": "PetAdoptApp/1.0" } }
                );
                const result = await response.json() as { display_name?: string };

                if (result?.display_name) {
                  const partes = result.display_name
                    .split(",")
                    .slice(0, 3)
                    .join(", ");
                  setAddress(partes);
                }
              } catch (error) {
                console.error("Error obteniendo la dirección:", error);
              } finally {
                setIsFetchingAddress(false);
              }
            }}
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing["4xl"],
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
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.size.overline,
    fontWeight: typography.weight.bold,
    color: colors.textSecondary,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  roleRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.md },
  roleBtn: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.gray100,
  },
  roleBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  roleIcon: { fontSize: 28, marginBottom: 4 },
  roleLabel: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.semibold,
    color: colors.textTertiary,
  },
  roleLabelActive: { color: colors.primary },

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

  mapLabel: {
    fontSize: typography.size.overline,
    fontWeight: typography.weight.bold,
    color: colors.textSecondary,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: "uppercase",
    marginLeft: spacing.xs,
    marginBottom: spacing.xs,
  },
  mapBtn: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    borderStyle: "dashed",
  },
  mapBtnError: { borderColor: colors.error, backgroundColor: colors.errorLight },
  mapBtnText: { color: colors.primary, fontWeight: typography.weight.semibold },
  mapError: {
    color: colors.error,
    fontSize: typography.size.caption,
    marginLeft: spacing.xs,
    marginTop: 2,
  },

  loginLink: { alignItems: "center", paddingVertical: spacing.sm },
  loginText: { color: colors.textSecondary, fontSize: typography.size.bodySmall },
  loginHighlight: { color: colors.primary, fontWeight: typography.weight.semibold },

  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: 50,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    ...shadows.xl,
  },
  modalHeaderMap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  modalCloseBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  modalCloseText: { color: colors.white, fontWeight: typography.weight.bold },

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
