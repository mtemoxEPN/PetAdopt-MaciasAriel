import { useMap } from '@features/map/presentation/hooks/useMap';
import { RefugioLocation } from '@features/map/domain/entities/RefugioLocation';
import { useRef, useState } from 'react';
import {
  ActivityIndicator, Linking, Modal, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import MapView, { Callout, Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';

const QUITO_DEFAULT: Region = {
  latitude:        -0.1807,
  longitude:       -78.4678,
  latitudeDelta:   0.05,
  longitudeDelta:  0.05,
};

export default function MapScreen() {
  const { refugios, userLocation, locationError, isLoading } = useMap();
  const [selected, setSelected] = useState<RefugioLocation | null>(null);
  const mapRef = useRef<MapView>(null);

  const initialRegion: Region = userLocation
    ? {
        latitude:       userLocation.lat,
        longitude:      userLocation.lng,
        latitudeDelta:  0.05,
        longitudeDelta: 0.05,
      }
    : QUITO_DEFAULT;

  const centerOnUser = () => {
    if (!userLocation) return;
    mapRef.current?.animateToRegion({
      latitude:       userLocation.lat,
      longitude:      userLocation.lng,
      latitudeDelta:  0.03,
      longitudeDelta: 0.03,
    }, 800);
  };

  const focusRefugio = (refugio: RefugioLocation) => {
    setSelected(refugio);
    mapRef.current?.animateToRegion({
      latitude:       refugio.lat,
      longitude:      refugio.lng,
      latitudeDelta:  0.01,
      longitudeDelta: 0.01,
    }, 800);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        showsScale
      >
        {/* Marcadores de refugios */}
        {refugios.map(refugio => (
          <Marker
            key={refugio.id}
            coordinate={{ latitude: refugio.lat, longitude: refugio.lng }}
            onPress={() => focusRefugio(refugio)}
          >
            {/* Marcador personalizado */}
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <Text style={styles.markerEmoji}>🏥</Text>
              </View>
              <View style={styles.markerTail} />
            </View>

            <Callout tooltip onPress={() => focusRefugio(refugio)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{refugio.name}</Text>
                {refugio.address && (
                  <Text style={styles.calloutAddress}>{refugio.address}</Text>
                )}
                <Text style={styles.calloutTap}>Toca para más info</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Botón centrar en usuario */}
      <TouchableOpacity
        style={styles.myLocationBtn}
        onPress={centerOnUser}
        disabled={!userLocation}
        activeOpacity={0.85}
      >
        <Text style={styles.myLocationIcon}>📍</Text>
      </TouchableOpacity>

      {/* Error de ubicación */}
      {locationError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠ {locationError}</Text>
        </View>
      )}

      {/* Contador de refugios */}
      <View style={styles.countBadge}>
        <Text style={styles.countText}>🏥 {refugios.length} refugios</Text>
      </View>

      {/* Lista de refugios abajo */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomHandle} />
        <Text style={styles.bottomTitle}>Refugios cercanos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.refugiosList}
        >
          {refugios.length === 0 ? (
            <View style={styles.noRefugios}>
              <Text style={styles.noRefugiosText}>No hay refugios registrados aún</Text>
            </View>
          ) : (
            refugios.map(refugio => (
              <TouchableOpacity
                key={refugio.id}
                style={[
                  styles.refugioChip,
                  selected?.id === refugio.id && styles.refugioChipActive,
                ]}
                onPress={() => focusRefugio(refugio)}
                activeOpacity={0.8}
              >
                <Text style={styles.refugioChipIcon}>🏥</Text>
                <View>
                  <Text style={[
                    styles.refugioChipName,
                    selected?.id === refugio.id && styles.refugioChipNameActive,
                  ]}>
                    {refugio.name}
                  </Text>
                  {refugio.address && (
                    <Text style={styles.refugioChipAddress} numberOfLines={1}>
                      {refugio.address}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* Modal detalle refugio */}
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setSelected(null)}
          />
          {selected && (
            <View style={styles.modalCard}>
              <View style={styles.modalHandle} />

              <View style={styles.modalHeader}>
                <Text style={styles.modalIcon}>🏥</Text>
                <View style={styles.modalHeaderInfo}>
                  <Text style={styles.modalName}>{selected.name}</Text>
                  {selected.address && (
                    <Text style={styles.modalAddress}>📍 {selected.address}</Text>
                  )}
                </View>
              </View>

              {selected.description && (
                <Text style={styles.modalDescription}>{selected.description}</Text>
              )}

              {selected.phone && (
                <TouchableOpacity
                  style={styles.modalPhoneBtn}
                  onPress={() => Linking.openURL(`tel:${selected.phone}`)}
                >
                  <Text style={styles.modalPhoneText}>📞 {selected.phone}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSelected(null)}
              >
                <Text style={styles.modalCloseBtnText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, backgroundColor: '#fef7f0' },
  loadingText: { color: '#78716c', fontSize: 14 },

  map: { flex: 1 },

  // Marcador personalizado
  markerContainer: { alignItems: 'center' },
  marker: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#f97316',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerEmoji: { fontSize: 20 },
  markerTail: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: '#f97316',
    marginTop: -1,
  },

  // Callout
  callout: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 12, minWidth: 150,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },
  calloutTitle:   { fontSize: 14, fontWeight: '700', color: '#1c1917' },
  calloutAddress: { fontSize: 12, color: '#78716c', marginTop: 2 },
  calloutTap:     { fontSize: 11, color: '#f97316', marginTop: 4, fontWeight: '600' },

  // Botón mi ubicación
  myLocationBtn: {
    position: 'absolute', top: 16, right: 16,
    backgroundColor: '#fff', width: 48, height: 48,
    borderRadius: 24, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },
  myLocationIcon: { fontSize: 22 },

  // Error banner
  errorBanner: {
    position: 'absolute', top: 16, left: 16, right: 72,
    backgroundColor: '#fef2f2', borderRadius: 12, padding: 10,
    borderLeftWidth: 3, borderLeftColor: '#ef4444',
  },
  errorText: { color: '#dc2626', fontSize: 12 },

  // Badge contador
  countBadge: {
    position: 'absolute', top: 16, left: 16,
    backgroundColor: '#fff', borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  countText: { fontSize: 13, fontWeight: '700', color: '#1c1917' },

  // Bottom sheet
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, paddingBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 8,
  },
  bottomHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#e7e5e4', alignSelf: 'center', marginBottom: 12,
  },
  bottomTitle: {
    fontSize: 15, fontWeight: '700', color: '#1c1917',
    paddingHorizontal: 20, marginBottom: 12,
  },
  refugiosList: { paddingHorizontal: 16, gap: 10 },

  refugioChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fafaf9', borderRadius: 16,
    padding: 12, borderWidth: 1.5, borderColor: '#e7e5e4', minWidth: 180,
  },
  refugioChipActive:     { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  refugioChipIcon:       { fontSize: 24 },
  refugioChipName:       { fontSize: 14, fontWeight: '600', color: '#1c1917' },
  refugioChipNameActive: { color: '#f97316' },
  refugioChipAddress:    { fontSize: 11, color: '#a8a29e', marginTop: 2, maxWidth: 140 },

  noRefugios:     { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  noRefugiosText: { color: '#a8a29e', fontSize: 14 },

  // Modal
  modalOverlay: {
    flex: 1, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, gap: 14,
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#e7e5e4', alignSelf: 'center', marginBottom: 4,
  },
  modalHeader:     { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  modalIcon:       { fontSize: 40 },
  modalHeaderInfo: { flex: 1 },
  modalName:       { fontSize: 20, fontWeight: '700', color: '#1c1917' },
  modalAddress:    { fontSize: 14, color: '#78716c', marginTop: 4 },
  modalDescription: { fontSize: 14, color: '#44403c', lineHeight: 22, backgroundColor: '#fafaf9', borderRadius: 12, padding: 14 },
  modalPhoneBtn:   { backgroundColor: '#dcfce7', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#86efac' },
  modalPhoneText:  { fontSize: 15, fontWeight: '700', color: '#16a34a' },
  modalCloseBtn:   { backgroundColor: '#f5f5f4', borderRadius: 100, paddingVertical: 14, alignItems: 'center' },
  modalCloseBtnText: { fontSize: 15, fontWeight: '600', color: '#78716c' },
});