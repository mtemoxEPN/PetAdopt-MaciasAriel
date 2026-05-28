import { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { supabase } from '@shared/infrastructure/supabase/client';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const router                  = useRouter();

  const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL!;

  const handleSend = async () => {
    if (!email.trim()) return setError('Ingresa tu correo electrónico');
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
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>📧</Text>
        <Text style={styles.successTitle}>¡Revisa tu correo!</Text>
        <Text style={styles.successText}>
          Enviamos un enlace a{'\n'}
          <Text style={styles.successEmail}>{email}</Text>
          {'\n'}para restablecer tu contraseña.
        </Text>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.btnPrimaryText}>Ir al Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <Text style={styles.logo}>🐾</Text>
          <Text style={styles.brand}>PetAdopt</Text>
          <Text style={styles.tagline}>Recupera tu acceso</Text>
        </View>

        <View style={styles.card}>
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
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CORREO</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@correo.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <TouchableOpacity
              style={[styles.btnPrimary, isLoading && styles.btnDisabled]}
              onPress={handleSend}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnPrimaryText}>Enviar enlace 🐾</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.btnSecondaryText}>← Volver al login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>Cada mascota merece un hogar 🏠</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = '#f97316';
const DARK    = '#1c1917';

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#fef7f0' },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 },

  header:  { alignItems: 'center', marginBottom: 32 },
  logo:    { fontSize: 56, marginBottom: 8 },
  brand:   { fontSize: 32, fontWeight: '700', color: DARK, letterSpacing: -1 },
  tagline: { fontSize: 14, color: '#78716c', marginTop: 4 },

  card: {
    backgroundColor: '#fff', borderRadius: 24, padding: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },

  titleLight: { fontSize: 32, fontWeight: '300', color: '#a8a29e', letterSpacing: -1 },
  titleBold:  { fontSize: 32, fontWeight: '700', color: DARK, letterSpacing: -1, marginTop: -4, marginBottom: 12 },
  subtitle:   { fontSize: 14, color: '#78716c', lineHeight: 22, marginBottom: 20 },

  errorBox:  { backgroundColor: '#fef2f2', borderRadius: 12, padding: 12, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#ef4444' },
  errorText: { color: '#dc2626', fontSize: 13 },

  form:       { gap: 14 },
  fieldGroup: { gap: 6 },
  label:      { fontSize: 10, fontWeight: '700', color: '#78716c', letterSpacing: 2 },
  input: {
    borderWidth: 1.5, borderColor: '#e7e5e4', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: DARK, backgroundColor: '#fafaf9',
  },

  btnPrimary:     { backgroundColor: PRIMARY, borderRadius: 100, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  btnDisabled:    { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  btnSecondary:     { borderRadius: 100, paddingVertical: 14, alignItems: 'center', backgroundColor: '#fef3c7', borderWidth: 1.5, borderColor: '#fde68a' },
  btnSecondaryText: { color: '#92400e', fontWeight: '600', fontSize: 14 },

  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16, backgroundColor: '#fef7f0' },
  successIcon:      { fontSize: 64 },
  successTitle:     { fontSize: 28, fontWeight: '700', color: DARK },
  successText:      { fontSize: 15, color: '#78716c', textAlign: 'center', lineHeight: 24 },
  successEmail:     { color: PRIMARY, fontWeight: '600' },

  footer: { textAlign: 'center', marginTop: 32, fontSize: 13, color: '#a8a29e' },
});