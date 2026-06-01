import { useSolicitudes } from '@features/solicitudes/presentation/hooks/useSolicitudes';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { PawPrint } from 'lucide-react-native';
import { colors, spacing, typography, shadows, radius } from "@shared/presentation/styles/theme";

export default function NuevaSolicitudScreen() {
  const { petId, refugioId } = useLocalSearchParams<{ petId: string; refugioId: string }>();
  const { createSolicitud, isCreating } = useSolicitudes();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setMessage('');
      setSent(false);
      setFocusedField(null);
    }, [])
  );

  if (!petId || !refugioId) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textSecondary }}>Parametros invalidos</Text>
      </View>
    );
  }

  if (sent) {
    return (
      <View style={styles.successContainer}>
        <LottieView
          source={require('../../../assets/animations/success.json')}
          autoPlay
          loop={false}
          style={{ width: 180, height: 180 }}
        />
        <Text style={styles.successTitle}>¡Solicitud enviada!</Text>
        <Text style={styles.successText}>
          El refugio revisará tu solicitud y te notificará pronto.
        </Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => router.replace('/(app)/solicitudes')}>
          <Text style={styles.btnPrimaryText}>Ver mis solicitudes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
    >
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Solicitud de Adopción</Text>
      <Text style={styles.subtitle}>
        Cuéntale al refugio por qué serías un buen hogar para esta mascota.
      </Text>

      <Text style={styles.label}>TU MENSAJE (opcional)</Text>
      <TextInput
        style={[styles.textarea, focusedField === "message" && styles.inputFocused]}
        placeholder="Ej: Tengo un jardín grande, experiencia con mascotas, vivo solo..."
        placeholderTextColor="#a8a29e"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={6}
        maxLength={500}
        onFocus={() => setFocusedField("message")}
        onBlur={() => setFocusedField(null)}
      />
      <Text style={styles.charCount}>{message.length}/500</Text>

      <TouchableOpacity
        style={[styles.btnPrimary, isCreating && styles.btnDisabled]}
        onPress={() =>
          createSolicitud(
            { mascotaId: petId, refugioId, message: message.trim() || undefined },
            { onSuccess: () => setSent(true) }
          )
        }
        disabled={isCreating}
        activeOpacity={0.85}
      >
        {isCreating
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnPrimaryText}>Enviar Solicitud</Text>
        }
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing["2xl"], gap: spacing.lg, paddingBottom: 120 },
  successContainer: {
    flex: 1, justifyContent: "center",
    alignItems: "center",
    padding: spacing["3xl"], gap: spacing.md,
    backgroundColor: colors.background,
  },
  successTitle: {
    fontSize: typography.size.h2,
    fontWeight: typography.weight.extrabold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
  successText: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
    textAlign: "center", lineHeight: 24,
  },
  title: {
    fontSize: typography.size.h2,
    fontWeight: typography.weight.extrabold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary, lineHeight: 22,
  },
  label: {
    fontSize: typography.size.overline,
    fontWeight: typography.weight.bold,
    color: colors.textSecondary, letterSpacing: 2,
  },
  textarea: {
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 30,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.size.body,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    height: 150, textAlignVertical: "top",
  },
  charCount: {
    fontSize: typography.size.caption,
    color: colors.textTertiary,
    textAlign: "right", marginTop: -8,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: spacing.sm,
    ...shadows.primary,
  },
  btnDisabled: { opacity: 0.55 },
  btnPrimaryText: {
    color: colors.white,
    fontWeight: typography.weight.bold, fontSize: 16,
    letterSpacing: 0.3,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: "rgba(255,240,237,0.50)",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    // elevation: 2,
  },
});