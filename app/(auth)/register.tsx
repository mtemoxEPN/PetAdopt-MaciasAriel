import { useAuth } from '@features/auth/presentation/hooks/useAuth';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RegisterScreen() {
  const [emailSent, setEmailSent]   = useState(false);
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [username, setUsername]     = useState('');
  const [fullName, setFullName]     = useState('');
  const [role, setRole]             = useState<'adoptante' | 'refugio'>('adoptante');
  const [focused, setFocused]       = useState<string | null>(null);
  const { register, isLoading, error } = useAuth();

  if (emailSent) {
    return (
      <View style={styles.root}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✉️</Text>
          <Text style={styles.successTitle}>¡Revisa tu correo!</Text>
          <Text style={styles.successText}>
            Enviamos un enlace de verificación a{'\n'}
            <Text style={styles.successEmail}>{email}</Text>
          </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={styles.btnPrimary}>
              <Text style={styles.btnPrimaryText}>Ir al Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
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
          <Text style={styles.tagline}>Únete y ayuda a los animales</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.titleLight}>Crear</Text>
          <Text style={styles.titleBold}>cuenta.</Text>

          {/* Selector de rol */}
          <Text style={styles.sectionLabel}>SOY UN</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'adoptante' && styles.roleBtnActive]}
              onPress={() => setRole('adoptante')}
              activeOpacity={0.8}
            >
              <Text style={styles.roleIcon}>🏠</Text>
              <Text style={[styles.roleLabel, role === 'adoptante' && styles.roleLabelActive]}>Adoptante</Text>
              <Text style={styles.roleDesc}>Busco una mascota</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'refugio' && styles.roleBtnActive]}
              onPress={() => setRole('refugio')}
              activeOpacity={0.8}
            >
              <Text style={styles.roleIcon}>🏥</Text>
              <Text style={[styles.roleLabel, role === 'refugio' && styles.roleLabelActive]}>Refugio</Text>
              <Text style={styles.roleDesc}>Doy mascotas en adopción</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {role === 'refugio' ? 'NOMBRE DEL REFUGIO' : 'NOMBRE COMPLETO'}
              </Text>
              <TextInput
                style={[styles.input, focused === 'fullName' && styles.inputFocused]}
                placeholder={role === 'refugio' ? 'Refugio Esperanza' : 'Tu nombre'}
                placeholderTextColor="#9ca3af"
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocused('fullName')}
                onBlur={() => setFocused(null)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>USUARIO</Text>
              <TextInput
                style={[styles.input, focused === 'username' && styles.inputFocused]}
                placeholder="sin espacios"
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                onFocus={() => setFocused('username')}
                onBlur={() => setFocused(null)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CORREO</Text>
              <TextInput
                style={[styles.input, focused === 'email' && styles.inputFocused]}
                placeholder="tu@correo.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CONTRASEÑA</Text>
              <TextInput
                style={[styles.input, focused === 'password' && styles.inputFocused]}
                placeholder="mín. 6 caracteres"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
              />
            </View>

            <TouchableOpacity
              style={[styles.btnPrimary, isLoading && styles.btnDisabled]}
              onPress={() =>
                register(
                  { email, password, username, role, fullName },
                  { onSuccess: () => setEmailSent(true) }
                )
              }
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnPrimaryText}>Crear Cuenta</Text>
              }
            </TouchableOpacity>

            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.7}>
                <Text style={styles.btnSecondaryText}>Ya tengo cuenta</Text>
              </TouchableOpacity>
            </Link>
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

  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16 },
  successIcon:      { fontSize: 64 },
  successTitle:     { fontSize: 28, fontWeight: '700', color: DARK },
  successText:      { fontSize: 15, color: '#78716c', textAlign: 'center', lineHeight: 24 },
  successEmail:     { color: PRIMARY, fontWeight: '600' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  titleLight: { fontSize: 32, fontWeight: '300', color: '#a8a29e', letterSpacing: -1 },
  titleBold:  { fontSize: 32, fontWeight: '700', color: DARK, letterSpacing: -1, marginTop: -4, marginBottom: 20 },

  sectionLabel: { fontSize: 10, fontWeight: '700', color: '#78716c', letterSpacing: 2, marginBottom: 10 },
  roleRow:      { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleBtn: {
    flex: 1, borderRadius: 16, padding: 16,
    alignItems: 'center', borderWidth: 1.5,
    borderColor: '#e7e5e4', backgroundColor: '#fafaf9',
  },
  roleBtnActive:  { borderColor: PRIMARY, backgroundColor: '#fff7ed' },
  roleIcon:       { fontSize: 28, marginBottom: 6 },
  roleLabel:      { fontSize: 13, fontWeight: '600', color: '#a8a29e' },
  roleLabelActive: { color: PRIMARY },
  roleDesc:       { fontSize: 11, color: '#a8a29e', marginTop: 2, textAlign: 'center' },

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
  inputFocused: { borderColor: PRIMARY, backgroundColor: '#fff7ed' },

  btnPrimary:     { backgroundColor: PRIMARY, borderRadius: 100, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  btnDisabled:    { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnSecondary:     { borderRadius: 100, paddingVertical: 14, alignItems: 'center', backgroundColor: '#fef3c7', borderWidth: 1.5, borderColor: '#fde68a' },
  btnSecondaryText: { color: '#92400e', fontWeight: '600', fontSize: 14 },

  footer: { textAlign: 'center', marginTop: 32, fontSize: 13, color: '#a8a29e' },
});