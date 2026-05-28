import { useSolicitudes } from '@features/solicitudes/presentation/hooks/useSolicitudes';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { Solicitud } from '@features/solicitudes/domain/entities/Solicitud';
import {
  ActivityIndicator, Alert, FlatList, Image,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

export default function SolicitudesScreen() {
  const user                               = useAuthStore((s) => s.user);
  const { solicitudes, isLoading, updateStatus, isUpdating } = useSolicitudes();
  const isRefugio                          = user?.role === 'refugio';

  const handleUpdateStatus = (id: string, action: 'aprobada' | 'rechazada', petName: string) => {
    Alert.alert(
      action === 'aprobada' ? '✅ Aprobar solicitud' : '❌ Rechazar solicitud',
      `¿Confirmas ${action === 'aprobada' ? 'aprobar' : 'rechazar'} la solicitud para ${petName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => updateStatus({ id, status: action }) },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === 'aprobada')  return '#22c55e';
    if (status === 'rechazada') return '#ef4444';
    return '#f59e0b';
  };

  const getStatusEmoji = (status: string) => {
    if (status === 'aprobada')  return '✅';
    if (status === 'rechazada') return '❌';
    return '⏳';
  };

  const renderSolicitud = ({ item }: { item: Solicitud }) => (
    <View style={styles.card}>
      {/* Foto mascota */}
      {item.mascotaPhoto ? (
        <Image source={{ uri: item.mascotaPhoto }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoEmoji}>🐾</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.petName}>{item.mascotaName ?? 'Mascota'}</Text>

        <Text style={styles.detail}>
          {isRefugio
            ? `👤 ${item.adoptanteUsername ?? 'Adoptante'}`
            : `🏥 ${item.refugioUsername ?? 'Refugio'}`
          }
        </Text>

        {item.message && (
          <Text style={styles.message} numberOfLines={2}>"{item.message}"</Text>
        )}

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusEmoji(item.status)} {item.status}
          </Text>
        </View>

        {/* Botones para refugio en solicitudes pendientes */}
        {isRefugio && item.status === 'pendiente' && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.btnApprove}
              onPress={() => handleUpdateStatus(item.id, 'aprobada', item.mascotaName ?? '')}
              disabled={isUpdating}
            >
              <Text style={styles.btnApproveText}>✅ Aprobar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnReject}
              onPress={() => handleUpdateStatus(item.id, 'rechazada', item.mascotaName ?? '')}
              disabled={isUpdating}
            >
              <Text style={styles.btnRejectText}>❌ Rechazar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={solicitudes}
        keyExtractor={(s) => s.id}
        renderItem={renderSolicitud}
        contentContainerStyle={solicitudes.length === 0 ? { flex: 1 } : { padding: 16, gap: 12 }}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>
              {isRefugio ? 'No hay solicitudes aún' : 'No has hecho solicitudes'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isRefugio
                ? 'Cuando alguien solicite adoptar una de tus mascotas, aparecerá aquí'
                : 'Explora las mascotas disponibles y solicita adoptar una'
              }
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7f0' },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 8 },

  card: {
    flexDirection: 'row', gap: 12,
    backgroundColor: '#fff', borderRadius: 20,
    padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  photo:            { width: 80, height: 80, borderRadius: 16 },
  photoPlaceholder: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  photoEmoji:       { fontSize: 32 },

  info:        { flex: 1, gap: 6 },
  petName:     { fontSize: 17, fontWeight: '700', color: '#1c1917' },
  detail:      { fontSize: 13, color: '#78716c' },
  message:     { fontSize: 13, color: '#a8a29e', fontStyle: 'italic' },

  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  statusText:  { fontSize: 12, fontWeight: '700' },

  actionRow:      { flexDirection: 'row', gap: 8, marginTop: 4 },
  btnApprove:     { flex: 1, backgroundColor: '#dcfce7', borderRadius: 100, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#86efac' },
  btnApproveText: { color: '#16a34a', fontWeight: '700', fontSize: 13 },
  btnReject:      { flex: 1, backgroundColor: '#fef2f2', borderRadius: 100, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#fca5a5' },
  btnRejectText:  { color: '#dc2626', fontWeight: '700', fontSize: 13 },

  emptyIcon:     { fontSize: 48, marginBottom: 8 },
  emptyTitle:    { fontSize: 18, fontWeight: '700', color: '#1c1917', textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: '#a8a29e', textAlign: 'center', lineHeight: 22 },
});