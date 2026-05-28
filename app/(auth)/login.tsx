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
import LottieView from 'lottie-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const { login, loginWithGoogle, isLoading, error } = useAuth();

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <LottieView
            source={require('../../assets/animations/pet-walk.json')}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
          />
          <Text style={styles.brand}>PetAdopt</Text>
          <Text style={styles.tagline}>Encuentra a tu compañero ideal</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.titleLight}>Bienvenido</Text>
          <Text style={styles.titleBold}>de vuelta.</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          )}

          <View style={styles.form}>
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
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
              />
            </View>

            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity>
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              style={[styles.btnPrimary, isLoading && styles.btnDisabled]}
              onPress={() => login({ email, password })}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnPrimaryText}>Iniciar Sesión</Text>
              }
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google */}
            <TouchableOpacity
              style={styles.btnGoogle}
              onPress={loginWithGoogle}
              activeOpacity={0.85}
            >
              <Text style={styles.btnGoogleText}>🌐  Continuar con Google</Text>
            </TouchableOpacity>

            <Link href="/(auth)/register" asChild>
              <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.7}>
                <Text style={styles.btnSecondaryText}>Crear una cuenta</Text>
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
const DARK = '#1c1917';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fef7f0' },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 },

  header: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 56, marginBottom: 8 },
  brand: { fontSize: 32, fontWeight: '700', color: DARK, letterSpacing: -1 },
  tagline: { fontSize: 14, color: '#78716c', marginTop: 4 },

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
  titleBold: { fontSize: 32, fontWeight: '700', color: DARK, letterSpacing: -1, marginTop: -4, marginBottom: 20 },

  errorBox: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 12, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#ef4444' },
  errorText: { color: '#dc2626', fontSize: 13 },

  form: { gap: 14 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 10, fontWeight: '700', color: '#78716c', letterSpacing: 2 },
  input: {
    borderWidth: 1.5,
    borderColor: '#e7e5e4',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: DARK,
    backgroundColor: '#fafaf9',
  },
  inputFocused: { borderColor: PRIMARY, backgroundColor: '#fff7ed' },

  forgotText: { fontSize: 13, color: PRIMARY, textAlign: 'right', fontWeight: '500' },

  btnPrimary: { backgroundColor: PRIMARY, borderRadius: 100, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e7e5e4' },
  dividerText: { color: '#a8a29e', fontSize: 13 },

  btnGoogle: { borderWidth: 1.5, borderColor: '#e7e5e4', borderRadius: 100, paddingVertical: 14, alignItems: 'center', backgroundColor: '#fff' },
  btnGoogleText: { color: DARK, fontWeight: '600', fontSize: 14 },

  btnSecondary: { borderRadius: 100, paddingVertical: 14, alignItems: 'center', backgroundColor: '#fef3c7', borderWidth: 1.5, borderColor: '#fde68a' },
  btnSecondaryText: { color: '#92400e', fontWeight: '600', fontSize: 14 },

  footer: { textAlign: 'center', marginTop: 32, fontSize: 13, color: '#a8a29e' },
});