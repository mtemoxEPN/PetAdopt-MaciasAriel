import { useMap } from '@features/map/presentation/hooks/useMap';
import { colors, spacing, typography, shadows, radius } from "@shared/presentation/styles/theme";
import { useState, useRef } from 'react';
import {
  ActivityIndicator, Linking, Modal, StyleSheet,
  Text, TouchableOpacity, View, Platform
} from 'react-native';
import { MapPin, Building2, Car, Navigation, Phone, AlertCircle } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

export default function MapScreen() {
  const { refugios, userLocation, locationError, isLoading } = useMap();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null); 
  const webViewRef = useRef<WebView>(null);

  const selected = refugios.find(r => r.id === selectedId);

  // Coordenadas fijas de Quito como respaldo
  const defaultLat = -0.1807;
  const defaultLng = -78.4678;

  const currentLat = userLocation?.lat ?? defaultLat;
  const currentLng = userLocation?.lng ?? defaultLng;

  // HTML inyectado con Leaflet, OpenStreetMap, Polylines y Geolocalización
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; height: 100%; width: 100%; }
        #map { height: 100vh; width: 100vw; }
        .marker-emoji { font-size: 26px; transform: translate(-4px, -4px); }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const userLat = ${currentLat};
        const userLng = ${currentLng};
        const hasLocation = ${!!userLocation};

        // Inicializar mapa centrado en la ubicación real o por defecto
        const map = L.map('map', { zoomControl: false }).setView([userLat, userLng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        L.control.zoom({ position: 'topleft' }).addTo(map);

        // Marcador del usuario (📍)
        if (hasLocation) {
          const userIcon = L.divIcon({
            html: '<div class="marker-emoji">📍</div>',
            iconSize: [30, 30],
            className: 'custom-icon'
          });
          L.marker([userLat, userLng], { icon: userIcon })
            .addTo(map)
            .bindPopup('<b>Tu ubicación actual</b>').openPopup();
        }

        // Cargar refugios del sistema
        const refugiosData = ${JSON.stringify(refugios)};
        
        refugiosData.forEach(refugio => {
          const refugioIcon = L.divIcon({
            html: '<div class="marker-emoji">🏥</div>',
            iconSize: [30, 30],
            className: 'custom-icon'
          });

          const marker = L.marker([refugio.lat, refugio.lng], { icon: refugioIcon }).addTo(map);
          
          let distText = "Refugio disponible";
          let kmCalculado = null;

          if (hasLocation) {
            // Cálculo métrico espacial mediante la API de Leaflet
            const pointUser = L.latLng(userLat, userLng);
            const pointRefugio = L.latLng(refugio.lat, refugio.lng);
            const distanceMeters = pointUser.distanceTo(pointRefugio);
            
            kmCalculado = (distanceMeters / 1000).toFixed(2);
            distText = "A " + kmCalculado + " km de ti";

            // Trazado de línea geométrica punteada entre el usuario y el refugio
            L.polyline([[userLat, userLng], [refugio.lat, refugio.lng]], {
              color: '#f97316',
              weight: 3,
              dashArray: '6, 8',
              opacity: 0.75
            }).addTo(map);
          }

          marker.bindPopup("<b>" + refugio.name + "</b><br>" + distText);
          
          // Enviar los datos del marcador pulsado hacia React Native
          marker.on('click', () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ 
              type: 'SELECT_REFUGIO', 
              id: refugio.id,
              distance: kmCalculado
            }));
          });
        });

        window.centerMapOn = function(lat, lng) {
          map.setView([lat, lng], 15, { animate: true, duration: 1 });
        };
      </script>
    </body>
    </html>
  `;

  const handleMapMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'SELECT_REFUGIO') {
        setSelectedId(message.id);
        setDistance(message.distance); 
      }
    } catch (e) {
      console.error("Error leyendo datos del mapa:", e);
    }
  };

  const centerOnUser = () => {
    if (!userLocation) return;
    const jsCode = `window.centerMapOn(${userLocation.lat}, ${userLocation.lng}); true;`;
    webViewRef.current?.injectJavaScript(jsCode);
  };

  // Lanzar intento de enrutamiento externo mediante mapas nativos del dispositivo
  const openExternalNavigation = () => {
    if (!selected) return;
    
    const lat = selected.lat;
    const lng = selected.lng;
    
    const url = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}&saddr=${currentLat},${currentLng}`,
      android: `google.navigation:q=${lat},${lng}`
    });

    Linking.openURL(url!).catch(() => {
      // Enlace universal de respaldo si fallan las aplicaciones nativas
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Cargando OpenStreetMap...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔑 LA CLAVE DEL FIX: Usar un key dinámico basado en si la ubicación existe o no.
        Esto fuerza al WebView a reiniciarse con el HTML correcto una vez que el GPS responde.
      */}
      <WebView
        key={userLocation ? 'map-ready' : 'map-seeking'}
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.map}
        onMessage={handleMapMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      <TouchableOpacity style={styles.myLocationBtn} onPress={centerOnUser} disabled={!userLocation} activeOpacity={0.85}>
        <Navigation size={22} color={userLocation ? colors.primary : colors.textTertiary} />
      </TouchableOpacity>

      {locationError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{locationError}</Text>
        </View>
      )}

      <View style={styles.countBadge}>
        <Text style={styles.countText}>{refugios.length} refugios activos</Text>
      </View>

      {/* Modal interactivo de información */}
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => { setSelectedId(null); setDistance(null); }}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => { setSelectedId(null); setDistance(null); }} />
          {selected && (
            <View style={styles.modalCard}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <Text style={styles.modalIcon}><Building2 size={40} color={colors.primary} /></Text>
                <View style={styles.modalHeaderInfo}>
                  <Text style={styles.modalName}>{selected.name}</Text>
                  {selected.address && <Text style={styles.modalAddress}>{selected.address}</Text>}
                  {distance ? (
                    <Text style={styles.distanceBadge}>A {distance} km de tu ubicación</Text>
                  ) : (
                    <Text style={styles.distanceBadgePending}>Ubicación de referencia</Text>
                  )}
                </View>
              </View>

              {selected.description && <Text style={styles.modalDescription}>{selected.description}</Text>}

              {/* Botón de ruteo externo */}
              <TouchableOpacity style={styles.modalNavigateBtn} onPress={openExternalNavigation} activeOpacity={0.85}>
                <Text style={styles.modalNavigateText}>Cómo llegar (Abrir en GPS)</Text>
              </TouchableOpacity>

              {selected.phone && (
                <TouchableOpacity style={styles.modalPhoneBtn} onPress={() => Linking.openURL(`tel:${selected.phone}`)}>
                  <Text style={styles.modalPhoneText}>Llamar: {selected.phone}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => { setSelectedId(null); setDistance(null); }}>
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
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.md, backgroundColor: colors.background },
  loadingText: { color: colors.textSecondary, fontSize: typography.size.bodySmall, fontWeight: typography.weight.medium },
  map: { flex: 1 },
  myLocationBtn: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.background,
    width: 50,
    height: 50,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  myLocationIcon: { fontSize: 22 },
  errorBanner: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
    right: 72,
    backgroundColor: colors.errorLight,
    borderRadius: radius.sm,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: { color: colors.error, fontSize: typography.size.caption },
  countBadge: {
    position: "absolute",
    bottom: 100,
    left: spacing.lg,
    backgroundColor: colors.textPrimary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  countText: { fontSize: typography.size.bodySmall, fontWeight: typography.weight.bold, color: colors.white },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(28,10,0,0.35)" },
  modalCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius["2xl"],
    borderTopRightRadius: radius["2xl"],
    padding: spacing["2xl"],
    gap: spacing.md,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  modalHandle: { width: 36, height: 4, borderRadius: radius.full, backgroundColor: colors.gray300, alignSelf: "center", marginBottom: spacing.xs },
  modalHeader: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  modalIcon: { fontSize: 40 },
  modalHeaderInfo: { flex: 1 },
  modalName: {
    fontSize: typography.size.h3,
    fontWeight: typography.weight.extrabold,
    color: colors.textPrimary,
  },
  modalAddress: { fontSize: typography.size.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  distanceBadge: { fontSize: typography.size.bodySmall, color: colors.primary, fontWeight: typography.weight.bold, marginTop: spacing.xs },
  distanceBadgePending: { fontSize: typography.size.bodySmall, color: colors.textSecondary, fontWeight: typography.weight.medium, marginTop: spacing.xs },
  modalDescription: { fontSize: typography.size.bodySmall, color: colors.textSecondary, lineHeight: 22, backgroundColor: colors.gray50, borderRadius: radius.sm, padding: spacing.md },
  modalNavigateBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: spacing.md,
    alignItems: "center",
    ...shadows.primary,
  },
  modalNavigateText: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: colors.white,
    letterSpacing: 0.3,
  },
  modalPhoneBtn: { backgroundColor: colors.successLight, borderRadius: radius.md, padding: spacing.md, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  modalPhoneText: { fontSize: typography.size.body, fontWeight: typography.weight.bold, color: colors.success },
  modalCloseBtn: { backgroundColor: colors.gray100, borderRadius: radius.full, paddingVertical: spacing.md, alignItems: "center" },
  modalCloseBtnText: { fontSize: typography.size.body, fontWeight: typography.weight.semibold, color: colors.textSecondary },
});