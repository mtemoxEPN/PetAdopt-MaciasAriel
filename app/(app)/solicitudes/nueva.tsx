import { useSolicitudes } from '@features/solicitudes/presentation/hooks/useSolicitudes';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import LottieView from 'lottie-react-native';

export default function NuevaSolicitudScreen() {
  const { petId, refugioId } = useLocalSearchParams<{ petId: string; refugioId: string }>();
  const { createSolicitud, isCreating } = useSolicitudes();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Solicitud de Adopción</Text>
      <Text style={styles.subtitle}>
        Cuéntale al refugio por qué serías un buen hogar para esta mascota.
      </Text>

      <Text style={styles.label}>TU MENSAJE (opcional)</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Ej: Tengo un jardín grande, experiencia con mascotas, vivo solo..."
        placeholderTextColor="#a8a29e"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={6}
        maxLength={500}
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
          : <Text style={styles.btnPrimaryText}>Enviar Solicitud 🐾</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7f0' },
  content: { padding: 24, gap: 14 },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16, backgroundColor: '#fef7f0' },
  successIcon: { fontSize: 64 },
  successTitle: { fontSize: 26, fontWeight: '700', color: '#1c1917' },
  successText: { fontSize: 15, color: '#78716c', textAlign: 'center', lineHeight: 24 },
  title: { fontSize: 26, fontWeight: '700', color: '#1c1917' },
  subtitle: { fontSize: 14, color: '#78716c', lineHeight: 22 },
  label: { fontSize: 10, fontWeight: '700', color: '#78716c', letterSpacing: 2 },
  textarea: {
    borderWidth: 1.5, borderColor: '#e7e5e4', borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: '#1c1917', backgroundColor: '#fff',
    height: 140, textAlignVertical: 'top',
  },
  charCount: { fontSize: 12, color: '#a8a29e', textAlign: 'right', marginTop: -8 },
  btnPrimary: { backgroundColor: '#f97316', borderRadius: 100, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});