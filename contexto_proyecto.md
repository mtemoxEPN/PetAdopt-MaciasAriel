# Contexto Completo del Proyecto CV-CREATOR-APP


================================================
📄 ARCHIVO: .claude\settings.json
================================================

{
  "enabledPlugins": {
    "expo@claude-plugins-official": true
  }
}


================================================
📄 ARCHIVO: .env
================================================

EXPO_PUBLIC_SUPABASE_URL=https://vauleodjbthbocismnqb.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_hDgFcwVt46uPDegLkC2xSg_L2T5nnv9
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyD5YyKwBeckypXRZpzb58G-CtJJVCDwy4k

================================================
📄 ARCHIVO: .gitignore
================================================

# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

app-example

# generated native folders
/ios
/android
.env



================================================
📄 ARCHIVO: AGENTS.md
================================================

# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.


================================================
📄 ARCHIVO: app\(app)\ai-chat.tsx
================================================

import { useAiChat } from '@features/ai/presentation/hooks/useAiChat';
import { AiMessage } from '@features/ai/domain/entities/AiMessage';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, KeyboardAvoidingView,
  Platform, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';

const SUGGESTIONS = [
  '¿Qué debo darle de comer a un cachorro?',
  '¿Con qué frecuencia debo vacunar a mi gato?',
  '¿Cómo adapto una mascota adoptada a mi hogar?',
  '¿Cuáles son señales de que mi perro está enfermo?',
];

export default function AiChatScreen() {
  const { messages, sendMessage, isLoading, error, clearChat } = useAiChat();
  const [input, setInput]   = useState('');
  const listRef             = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length, isLoading]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  }, [input, isLoading, sendMessage]);

  const renderMessage = ({ item }: { item: AiMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleModel]}>
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
            {item.content}
          </Text>
          <Text style={[styles.time, isUser && styles.timeUser]}>
            {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header info */}
      <View style={styles.headerBanner}>
        <Text style={styles.headerBannerIcon}>🐾</Text>
        <View style={styles.headerBannerInfo}>
          <Text style={styles.headerBannerTitle}>Asistente PetAdopt</Text>
          <Text style={styles.headerBannerSub}>Especialista en salud y cuidado animal</Text>
        </View>
        {messages.length > 0 && (
          <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de mensajes o sugerencias */}
      {messages.length === 0 ? (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>¿En qué puedo ayudarte hoy?</Text>
          <Text style={styles.suggestionsSubtitle}>
            Pregúntame sobre salud, cuidados, alimentación o el proceso de adopción.
          </Text>
          <View style={styles.suggestionsList}>
            {SUGGESTIONS.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={styles.suggestionChip}
                onPress={() => sendMessage(s)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionText}>{s}</Text>
                <Text style={styles.suggestionArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Typing indicator */}
      {isLoading && (
        <View style={styles.typingRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color="#f97316" />
            <Text style={styles.typingText}>Pensando...</Text>
          </View>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠ {error}</Text>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Pregunta sobre tu mascota..."
          placeholderTextColor="#a8a29e"
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || isLoading) && styles.sendBtnOff]}
          onPress={handleSend}
          disabled={!input.trim() || isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.sendIcon}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = '#f97316';
const styles  = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7f0' },

  headerBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#f5f5f4',
  },
  headerBannerIcon:  { fontSize: 36 },
  headerBannerInfo:  { flex: 1 },
  headerBannerTitle: { fontSize: 15, fontWeight: '700', color: '#1c1917' },
  headerBannerSub:   { fontSize: 12, color: '#78716c', marginTop: 1 },
  clearBtn:          { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fef3c7', borderRadius: 100 },
  clearBtnText:      { fontSize: 12, color: '#92400e', fontWeight: '600' },

  suggestionsContainer: { flex: 1, padding: 24, gap: 16 },
  suggestionsTitle:     { fontSize: 22, fontWeight: '700', color: '#1c1917' },
  suggestionsSubtitle:  { fontSize: 14, color: '#78716c', lineHeight: 22 },
  suggestionsList:      { gap: 10 },
  suggestionChip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: 1.5, borderColor: '#e7e5e4',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  suggestionText:  { flex: 1, fontSize: 14, color: '#44403c', lineHeight: 20 },
  suggestionArrow: { fontSize: 16, color: PRIMARY, marginLeft: 8 },

  messagesList: { padding: 16, gap: 12 },

  msgRow:     { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { justifyContent: 'flex-end' },

  avatar:     { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff7ed', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fed7aa' },
  avatarText: { fontSize: 16 },

  bubble:          { maxWidth: '78%', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleUser:      { backgroundColor: PRIMARY, borderBottomRightRadius: 4 },
  bubbleModel:     { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#e7e5e4' },
  bubbleText:      { fontSize: 15, color: '#1c1917', lineHeight: 22 },
  bubbleTextUser:  { color: '#fff' },
  time:            { fontSize: 10, color: '#a8a29e', marginTop: 4, alignSelf: 'flex-end' },
  timeUser:        { color: 'rgba(255,255,255,0.7)' },

  typingRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#e7e5e4' },
  typingText:   { fontSize: 13, color: '#a8a29e' },

  errorBox:  { marginHorizontal: 16, marginBottom: 8, backgroundColor: '#fef2f2', borderRadius: 12, padding: 12, borderLeftWidth: 3, borderLeftColor: '#ef4444' },
  errorText: { color: '#dc2626', fontSize: 13 },

  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#f5f5f4',
  },
  input: {
    flex: 1, borderWidth: 1.5, borderColor: '#e7e5e4', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    maxHeight: 100, fontSize: 15, color: '#1c1917', backgroundColor: '#fafaf9',
  },
  sendBtn:    { width: 42, height: 42, borderRadius: 21, backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center' },
  sendBtnOff: { backgroundColor: '#e7e5e4' },
  sendIcon:   { color: '#fff', fontSize: 20, fontWeight: '700' },
});

================================================
📄 ARCHIVO: app\(app)\chat\[roomId].tsx
================================================

import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Message } from "@features/chat/domain/entities/Message";
import { useChat } from "@features/chat/presentation/hooks/useChat";
import { pickAndUploadImage } from "@shared/infrastructure/supabase/StorageService";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { VideoView, useVideoPlayer } from "expo-video";

export default function ChatScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { messages, sendMessage, isLoading } = useChat(roomId);
  const user = useAuthStore((s) => s.user);
  const isSeller = user?.role === "seller";
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const player = useVideoPlayer(
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4",
    (p) => {
      p.loop = true;
      p.muted = true;
      p.play();
    }
  );

  useEffect(() => {
    if (messages.length > 0) listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    sendMessage({ content: input.trim() });
    setInput("");
  }, [input, sendMessage]);

  const handleImagePick = useCallback(async () => {
    try {
      setIsUploading(true);
      const imageUrl = await pickAndUploadImage();
      if (imageUrl) sendMessage({ content: "", imageUrl });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsUploading(false);
    }
  }, [sendMessage]);

  const renderMsg = ({ item }: { item: Message }) => {
    const isOwn = item.userId === user?.id;
    const initials = (item.authorUsername ?? "?").charAt(0).toUpperCase();

    return (
      <View style={[styles.row, isOwn && styles.rowOwn]}>
        {/* Avatar de otros usuarios */}
        {!isOwn && (
          <View style={[
            styles.avatar,
            item.authorRole === "seller" ? styles.avatarSeller : styles.avatarClient
          ]}>
            <Text style={styles.avatarText}>
              {item.authorRole === "seller" ? "🏪" : "🛒"}
            </Text>
          </View>
        )}

        <View style={[
          styles.bubble,
          isOwn
            ? (isSeller ? styles.sellerBubble : styles.clientBubble)
            : styles.otherBubble
        ]}>
          {!isOwn && (
            <Text style={styles.author}>{item.authorUsername}</Text>
          )}

          {item.imageUrl && (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.msgImage}
              resizeMode="cover"
            />
          )}

          {!!item.content && (
            <Text style={[styles.msgText, isOwn && styles.msgTextOwn]}>
              {item.content}
            </Text>
          )}

          <Text style={[styles.time, isOwn && styles.timeOwn]}>
            {item.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />
      <View style={styles.videoOverlay} pointerEvents="none" />

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderMsg}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Input bar */}
      <View style={styles.inputBar}>
        {/* Botón imagen */}
        <TouchableOpacity
          style={styles.attachBtn}
          onPress={handleImagePick}
          disabled={isUploading}
          activeOpacity={0.7}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color={DARK} />
          ) : (
            <Text style={styles.attachIcon}>⊕</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Message..."
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnOff]}
          onPress={handleSend}
          disabled={!input.trim()}
          activeOpacity={0.85}
        >
          <Text style={styles.sendIcon}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const DARK = "#000";
const ACCENT = "#6c63ff";
const SELLER_CLR = "#f59e0b";
const GRAY_MID = "rgba(255,255,255,0.4)";
const GRAY_LIGHT = "#0a0a0a";
const GRAY_300 = "rgba(255,255,255,0.1)";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: GRAY_LIGHT },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    zIndex: 1,
  },

  // Filas de mensajes
  row: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  rowOwn: { justifyContent: "flex-end" },

  // Avatar
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: DARK,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  avatarText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  // Burbujas
  bubble: {
    maxWidth: "75%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ownBubble: {
    backgroundColor: DARK,
    borderBottomRightRadius: 4,
  },
  sellerBubble: { backgroundColor: SELLER_CLR, borderBottomRightRadius: 4 },
  clientBubble: { backgroundColor: ACCENT, borderBottomRightRadius: 4 },
  otherBubble: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  avatarSeller: { backgroundColor: SELLER_CLR },
  avatarClient: { backgroundColor: ACCENT },

  author: {
    fontSize: 11, fontWeight: "600",
    color: "rgba(255,255,255,0.4)",
    marginBottom: 4, letterSpacing: 0.3,
  },
  msgText: { fontSize: 15, color: "#fff", lineHeight: 20 },
  msgTextOwn: { color: "#fff" },
  time: { fontSize: 10, color: "#9ca3af", marginTop: 4, alignSelf: "flex-end" },
  timeOwn: { color: "rgba(255,255,255,0.5)" },
  msgImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 4,
  },

  // Input bar
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    gap: 8,
    zIndex: 2
  },
  attachBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center", alignItems: "center",
  },
  attachIcon: { fontSize: 20, color: "rgba(255,255,255,0.7)" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center",
  },
  sendBtnOff: { backgroundColor: "rgba(255,255,255,0.1)" },
  sendIcon: { color: "#000", fontSize: 18, fontWeight: "600" },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.70)",
    zIndex: 0,
  }
});

================================================
📄 ARCHIVO: app\(app)\index.tsx
================================================

import { useAuthStore } from '@features/auth/presentation/store/authStore';
import RefugioHomeScreen from './pets/refugio-home';
import AdoptanteHomeScreen from './pets/adoptante-home';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  return user?.role === 'refugio' ? <RefugioHomeScreen /> : <AdoptanteHomeScreen />;
}

================================================
📄 ARCHIVO: app\(app)\map.tsx
================================================

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

================================================
📄 ARCHIVO: app\(app)\pets\adoptante-home.tsx
================================================

import { usePets } from '@features/pets/presentation/hooks/usePets';
import { Pet } from '@features/pets/domain/entities/Pet';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator, FlatList, Image, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useState } from 'react';

export default function AdoptanteHomeScreen() {
  const { pets, isLoading } = usePets();
  const router  = useRouter();
  const [search, setSearch] = useState('');

  const filtered = pets.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.species.toLowerCase().includes(search.toLowerCase()) ||
    (p.breed ?? '').toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Buscando mascotas...</Text>
      </View>
    );
  }

  const renderPet = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(app)/pets/${item.id}`)}
      activeOpacity={0.85}
    >
      {item.photoUrl ? (
        <Image source={{ uri: item.photoUrl }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoEmoji}>
            {item.species === 'perro' ? '🐶' : item.species === 'gato' ? '🐱' : '🐾'}
          </Text>
        </View>
      )}
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.speciesBadge}>
            <Text style={styles.speciesText}>{item.species}</Text>
          </View>
        </View>
        {item.breed && <Text style={styles.breed}>{item.breed}</Text>}
        <Text style={styles.age}>
          {item.ageYears ? `${item.ageYears} año${item.ageYears > 1 ? 's' : ''}` : 'Edad desconocida'}
          {item.gender ? ` · ${item.gender}` : ''}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, especie o raza..."
          placeholderTextColor="#a8a29e"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        renderItem={renderPet}
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>🐾</Text>
            <Text style={styles.emptyTitle}>No hay mascotas disponibles</Text>
            <Text style={styles.emptySubtitle}>Vuelve pronto, llegan nuevos amigos</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#fef7f0' },
  centered:   { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  loadingText: { color: '#a8a29e', marginTop: 8 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    margin: 16, paddingHorizontal: 16,
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1.5, borderColor: '#e7e5e4', gap: 8,
  },
  searchIcon:  { fontSize: 16 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#1c1917' },

  card: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', gap: 12,
  },
  photo:            { width: 72, height: 72, borderRadius: 16 },
  photoPlaceholder: { width: 72, height: 72, borderRadius: 16, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  photoEmoji:       { fontSize: 32 },
  info:             { flex: 1, gap: 4 },
  row:              { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name:             { fontSize: 17, fontWeight: '700', color: '#1c1917' },
  speciesBadge:     { backgroundColor: '#fff7ed', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100, borderWidth: 1, borderColor: '#fed7aa' },
  speciesText:      { fontSize: 11, color: '#f97316', fontWeight: '600' },
  breed:            { fontSize: 13, color: '#78716c' },
  age:              { fontSize: 13, color: '#a8a29e' },
  chevron:          { fontSize: 22, color: '#d6d3d1' },
  separator:        { height: 1, backgroundColor: '#f5f5f4', marginLeft: 100 },

  emptyIcon:     { fontSize: 48, marginBottom: 8 },
  emptyTitle:    { fontSize: 18, fontWeight: '600', color: '#1c1917' },
  emptySubtitle: { fontSize: 14, color: '#a8a29e' },
});

================================================
📄 ARCHIVO: app\(app)\pets\edit\[id].tsx
================================================

import { useRefugioPets } from '@features/pets/presentation/hooks/usePets';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { pickAndUploadPetImage } from '@shared/infrastructure/supabase/StorageService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Image, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { PetSpecies, PetGender, PetStatus } from '@features/pets/domain/entities/Pet';

export default function EditPetScreen() {
  const { id }     = useLocalSearchParams<{ id: string }>();
  const user       = useAuthStore((s) => s.user);
  const { pets, updatePet, isUpdating } = useRefugioPets();
  const router     = useRouter();

  const pet = pets.find(p => p.id === id);

  const [name, setName]             = useState(pet?.name ?? '');
  const [species, setSpecies]       = useState<PetSpecies>(pet?.species ?? 'perro');
  const [breed, setBreed]           = useState(pet?.breed ?? '');
  const [ageYears, setAgeYears]     = useState(pet?.ageYears?.toString() ?? '');
  const [gender, setGender]         = useState<PetGender>(pet?.gender ?? 'macho');
  const [description, setDescription] = useState(pet?.description ?? '');
  const [photoUrl, setPhotoUrl]     = useState<string | null>(pet?.photoUrl ?? null);
  const [status, setStatus]         = useState<PetStatus>(pet?.status ?? 'disponible');
  const [uploading, setUploading]   = useState(false);

  const handlePickImage = async () => {
    try {
      setUploading(true);
      const url = await pickAndUploadPetImage(user!.id);
      if (url) setPhotoUrl(url);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = () => {
    if (!name.trim()) return alert('El nombre es requerido');
    updatePet(
      {
        id,
        pet: {
          name: name.trim(), species, breed: breed || undefined,
          ageYears: ageYears ? parseInt(ageYears) : undefined,
          gender, description: description || undefined,
          photoUrl: photoUrl ?? undefined, status,
        },
      },
      { onSuccess: () => router.back() }
    );
  };

  if (!pet) return (
    <View style={styles.centered}>
      <ActivityIndicator color="#f97316" />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Editar Mascota</Text>

      <TouchableOpacity style={styles.photoBtn} onPress={handlePickImage} disabled={uploading}>
        {uploading ? <ActivityIndicator color="#f97316" /> :
          photoUrl ? <Image source={{ uri: photoUrl }} style={styles.photoPreview} /> :
          <View style={styles.photoEmpty}>
            <Text style={styles.photoEmptyIcon}>📷</Text>
            <Text style={styles.photoEmptyText}>Cambiar foto</Text>
          </View>
        }
      </TouchableOpacity>

      <Text style={styles.label}>NOMBRE</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>ESPECIE</Text>
      <View style={styles.optionRow}>
        {(['perro', 'gato', 'otro'] as PetSpecies[]).map(s => (
          <TouchableOpacity key={s} style={[styles.option, species === s && styles.optionActive]} onPress={() => setSpecies(s)}>
            <Text style={styles.optionText}>{s === 'perro' ? '🐶' : s === 'gato' ? '🐱' : '🐾'} {s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>GÉNERO</Text>
      <View style={styles.optionRow}>
        {(['macho', 'hembra'] as PetGender[]).map(g => (
          <TouchableOpacity key={g} style={[styles.option, gender === g && styles.optionActive]} onPress={() => setGender(g)}>
            <Text style={styles.optionText}>{g === 'macho' ? '♂️' : '♀️'} {g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>ESTADO</Text>
      <View style={styles.optionRow}>
        {(['disponible', 'en_proceso', 'adoptado'] as PetStatus[]).map(s => (
          <TouchableOpacity key={s} style={[styles.option, status === s && styles.optionActive]} onPress={() => setStatus(s)}>
            <Text style={styles.optionText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>RAZA</Text>
      <TextInput style={styles.input} value={breed} onChangeText={setBreed} />

      <Text style={styles.label}>EDAD EN AÑOS</Text>
      <TextInput style={styles.input} value={ageYears} onChangeText={setAgeYears} keyboardType="numeric" maxLength={2} />

      <Text style={styles.label}>DESCRIPCIÓN</Text>
      <TextInput style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription} multiline numberOfLines={4} />

      <TouchableOpacity style={[styles.btnCreate, isUpdating && styles.btnDisabled]} onPress={handleUpdate} disabled={isUpdating}>
        {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnCreateText}>Guardar Cambios</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7f0' },
  content:   { padding: 24, gap: 10 },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title:     { fontSize: 24, fontWeight: '700', color: '#1c1917', marginBottom: 8 },
  photoBtn:      { alignSelf: 'center', marginBottom: 8 },
  photoPreview:  { width: 140, height: 140, borderRadius: 20 },
  photoEmpty: { width: 140, height: 140, borderRadius: 20, backgroundColor: '#fff', borderWidth: 2, borderColor: '#fed7aa', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', gap: 8 },
  photoEmptyIcon: { fontSize: 32 },
  photoEmptyText: { fontSize: 13, color: '#f97316', fontWeight: '600' },
  label: { fontSize: 10, fontWeight: '700', color: '#78716c', letterSpacing: 2, marginTop: 6 },
  input: { borderWidth: 1.5, borderColor: '#e7e5e4', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: '#1c1917', backgroundColor: '#fff' },
  textarea: { height: 100, textAlignVertical: 'top' },
  optionRow: { flexDirection: 'row', gap: 10 },
  option: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: '#e7e5e4', backgroundColor: '#fff', alignItems: 'center' },
  optionActive: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  optionText: { fontSize: 12, fontWeight: '600', color: '#1c1917' },
  btnCreate: { backgroundColor: '#f97316', borderRadius: 100, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  btnDisabled: { opacity: 0.6 },
  btnCreateText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

================================================
📄 ARCHIVO: app\(app)\pets\new.tsx
================================================

import { useRefugioPets } from '@features/pets/presentation/hooks/usePets';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { pickAndUploadPetImage } from '@shared/infrastructure/supabase/StorageService';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, Image, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { PetSpecies, PetGender, PetStatus } from '@features/pets/domain/entities/Pet';

export default function NewPetScreen() {
  const user       = useAuthStore((s) => s.user);
  const { createPet, isCreating } = useRefugioPets();
  const router     = useRouter();

  const [name, setName]             = useState('');
  const [species, setSpecies]       = useState<PetSpecies>('perro');
  const [breed, setBreed]           = useState('');
  const [ageYears, setAgeYears]     = useState('');
  const [gender, setGender]         = useState<PetGender>('macho');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl]     = useState<string | null>(null);
  const [uploading, setUploading]   = useState(false);

  const handlePickImage = async () => {
    try {
      setUploading(true);
      const url = await pickAndUploadPetImage(user!.id);
      if (url) setPhotoUrl(url);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = () => {
    if (!name.trim()) return alert('El nombre es requerido');
    createPet(
      {
        refugioId:   user!.id,
        name:        name.trim(),
        species,
        breed:       breed.trim() || undefined,
        ageYears:    ageYears ? parseInt(ageYears) : undefined,
        gender,
        description: description.trim() || undefined,
        photoUrl:    photoUrl ?? undefined,
        status:      'disponible',
      },
      { onSuccess: () => router.back() }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nueva Mascota</Text>

      {/* Foto */}
      <TouchableOpacity style={styles.photoBtn} onPress={handlePickImage} disabled={uploading}>
        {uploading ? (
          <ActivityIndicator color="#f97316" />
        ) : photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.photoPreview} />
        ) : (
          <View style={styles.photoEmpty}>
            <Text style={styles.photoEmptyIcon}>📷</Text>
            <Text style={styles.photoEmptyText}>Agregar foto</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Nombre */}
      <Text style={styles.label}>NOMBRE *</Text>
      <TextInput style={styles.input} placeholder="Ej: Max" value={name} onChangeText={setName} />

      {/* Especie */}
      <Text style={styles.label}>ESPECIE</Text>
      <View style={styles.optionRow}>
        {(['perro', 'gato', 'otro'] as PetSpecies[]).map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.option, species === s && styles.optionActive]}
            onPress={() => setSpecies(s)}
          >
            <Text style={styles.optionText}>{s === 'perro' ? '🐶' : s === 'gato' ? '🐱' : '🐾'} {s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Género */}
      <Text style={styles.label}>GÉNERO</Text>
      <View style={styles.optionRow}>
        {(['macho', 'hembra'] as PetGender[]).map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.option, gender === g && styles.optionActive]}
            onPress={() => setGender(g)}
          >
            <Text style={styles.optionText}>{g === 'macho' ? '♂️' : '♀️'} {g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Raza */}
      <Text style={styles.label}>RAZA (opcional)</Text>
      <TextInput style={styles.input} placeholder="Ej: Labrador" value={breed} onChangeText={setBreed} />

      {/* Edad */}
      <Text style={styles.label}>EDAD EN AÑOS (opcional)</Text>
      <TextInput
        style={styles.input} placeholder="Ej: 2"
        value={ageYears} onChangeText={setAgeYears}
        keyboardType="numeric" maxLength={2}
      />

      {/* Descripción */}
      <Text style={styles.label}>DESCRIPCIÓN (opcional)</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Cuéntanos sobre esta mascota..."
        value={description} onChangeText={setDescription}
        multiline numberOfLines={4} maxLength={300}
      />

      <TouchableOpacity
        style={[styles.btnCreate, isCreating && styles.btnDisabled]}
        onPress={handleCreate}
        disabled={isCreating}
      >
        {isCreating
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnCreateText}>Registrar Mascota</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7f0' },
  content:   { padding: 24, gap: 10 },
  title:     { fontSize: 24, fontWeight: '700', color: '#1c1917', marginBottom: 8 },

  photoBtn:      { alignSelf: 'center', marginBottom: 8 },
  photoPreview:  { width: 140, height: 140, borderRadius: 20 },
  photoEmpty: {
    width: 140, height: 140, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 2, borderColor: '#fed7aa',
    borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  photoEmptyIcon: { fontSize: 32 },
  photoEmptyText: { fontSize: 13, color: '#f97316', fontWeight: '600' },

  label: { fontSize: 10, fontWeight: '700', color: '#78716c', letterSpacing: 2, marginTop: 6 },
  input: {
    borderWidth: 1.5, borderColor: '#e7e5e4', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 13,
    fontSize: 15, color: '#1c1917', backgroundColor: '#fff',
  },
  textarea: { height: 100, textAlignVertical: 'top' },

  optionRow: { flexDirection: 'row', gap: 10 },
  option: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#e7e5e4',
    backgroundColor: '#fff', alignItems: 'center',
  },
  optionActive: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  optionText:   { fontSize: 13, fontWeight: '600', color: '#1c1917' },

  btnCreate: {
    backgroundColor: '#f97316', borderRadius: 100,
    paddingVertical: 16, alignItems: 'center', marginTop: 12,
  },
  btnDisabled:    { opacity: 0.6 },
  btnCreateText:  { color: '#fff', fontWeight: '700', fontSize: 16 },
});

================================================
📄 ARCHIVO: app\(app)\pets\refugio-home.tsx
================================================

import { useRefugioPets } from '@features/pets/presentation/hooks/usePets';
import { Pet } from '@features/pets/domain/entities/Pet';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator, Alert, FlatList, Image,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

export default function RefugioHomeScreen() {
  const { pets, isLoading, deletePet, isDeleting } = useRefugioPets();
  const router = useRouter();

  const handleDelete = (pet: Pet) => {
    Alert.alert(
      'Eliminar mascota',
      `¿Estás seguro de eliminar a ${pet.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deletePet(pet.id) },
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

  const renderPet = ({ item }: { item: Pet }) => (
    <View style={styles.card}>
      {item.photoUrl ? (
        <Image source={{ uri: item.photoUrl }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoEmoji}>
            {item.species === 'perro' ? '🐶' : item.species === 'gato' ? '🐱' : '🐾'}
          </Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.detail}>{item.species}{item.breed ? ` · ${item.breed}` : ''}</Text>
        <View style={[styles.statusBadge, styles[`status_${item.status}` as keyof typeof styles] as any]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnEdit}
          onPress={() => router.push(`/(app)/pets/edit/${item.id}`)}
        >
          <Text style={styles.btnEditText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnDelete}
          onPress={() => handleDelete(item)}
          disabled={isDeleting}
        >
          <Text style={styles.btnDeleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(p) => p.id}
        renderItem={renderPet}
        contentContainerStyle={pets.length === 0 ? { flex: 1 } : { paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>🏥</Text>
            <Text style={styles.emptyTitle}>No tienes mascotas registradas</Text>
            <Text style={styles.emptySubtitle}>Agrega tu primera mascota</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(app)/pets/new')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7f0' },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },

  card: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', gap: 12,
  },
  photo:            { width: 72, height: 72, borderRadius: 16 },
  photoPlaceholder: { width: 72, height: 72, borderRadius: 16, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  photoEmoji:       { fontSize: 32 },
  info:             { flex: 1, gap: 4 },
  name:             { fontSize: 16, fontWeight: '700', color: '#1c1917' },
  detail:           { fontSize: 13, color: '#78716c' },

  statusBadge:           { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100 },
  statusText:            { fontSize: 11, fontWeight: '600', color: '#fff' },
  status_disponible:     { backgroundColor: '#22c55e' },
  status_en_proceso:     { backgroundColor: '#f59e0b' },
  status_adoptado:       { backgroundColor: '#6b7280' },

  actions:       { gap: 8 },
  btnEdit:       { padding: 8, backgroundColor: '#fef3c7', borderRadius: 12 },
  btnEditText:   { fontSize: 18 },
  btnDelete:     { padding: 8, backgroundColor: '#fef2f2', borderRadius: 12 },
  btnDeleteText: { fontSize: 18 },

  separator: { height: 1, backgroundColor: '#f5f5f4', marginLeft: 100 },

  emptyIcon:     { fontSize: 48, marginBottom: 8 },
  emptyTitle:    { fontSize: 18, fontWeight: '600', color: '#1c1917' },
  emptySubtitle: { fontSize: 14, color: '#a8a29e' },

  fab: {
    position: 'absolute', right: 20, bottom: 24,
    backgroundColor: '#f97316', width: 60, height: 60,
    borderRadius: 30, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#f97316', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  fabText: { color: '#fff', fontSize: 30, lineHeight: 34 },
});

================================================
📄 ARCHIVO: app\(app)\pets\[id].tsx
================================================

import { usePets } from '@features/pets/presentation/hooks/usePets';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator, Image, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

export default function PetDetailScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const { pets, isLoading } = usePets();
  const user     = useAuthStore((s) => s.user);
  const router   = useRouter();
  const pet      = pets.find(p => p.id === id);

  if (isLoading) return <View style={styles.centered}><ActivityIndicator color="#f97316" /></View>;
  if (!pet)      return <View style={styles.centered}><Text>Mascota no encontrada</Text></View>;

  return (
    <ScrollView style={styles.container}>
      {pet.photoUrl ? (
        <Image source={{ uri: pet.photoUrl }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoEmoji}>
            {pet.species === 'perro' ? '🐶' : pet.species === 'gato' ? '🐱' : '🐾'}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name}>{pet.name}</Text>
          <View style={styles.speciesBadge}>
            <Text style={styles.speciesText}>{pet.species}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          {pet.breed    && <View style={styles.tag}><Text style={styles.tagText}>🦴 {pet.breed}</Text></View>}
          {pet.gender   && <View style={styles.tag}><Text style={styles.tagText}>{pet.gender === 'macho' ? '♂️' : '♀️'} {pet.gender}</Text></View>}
          {pet.ageYears && <View style={styles.tag}><Text style={styles.tagText}>🎂 {pet.ageYears} año{pet.ageYears > 1 ? 's' : ''}</Text></View>}
        </View>

        {pet.description && (
          <View style={styles.descBox}>
            <Text style={styles.descLabel}>SOBRE {pet.name.toUpperCase()}</Text>
            <Text style={styles.desc}>{pet.description}</Text>
          </View>
        )}

        {user?.role === 'adoptante' && (
          <TouchableOpacity
            style={styles.btnAdopt}
            onPress={() => router.push({ pathname: '/(app)/solicitudes/nueva', params: { petId: pet.id, refugioId: pet.refugioId } })}
            activeOpacity={0.85}
          >
            <Text style={styles.btnAdoptText}>🐾 Solicitar Adopción</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#fef7f0' },
  centered:         { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photo:            { width: '100%', height: 280 },
  photoPlaceholder: { width: '100%', height: 280, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  photoEmoji:       { fontSize: 80 },
  content:          { padding: 24, gap: 16 },
  row:              { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name:             { fontSize: 28, fontWeight: '700', color: '#1c1917' },
  speciesBadge:     { backgroundColor: '#fff7ed', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100, borderWidth: 1.5, borderColor: '#fed7aa' },
  speciesText:      { fontSize: 13, color: '#f97316', fontWeight: '700' },
  detailRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag:              { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, borderWidth: 1.5, borderColor: '#e7e5e4' },
  tagText:          { fontSize: 13, color: '#78716c', fontWeight: '500' },
  descBox:          { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 8 },
  descLabel:        { fontSize: 10, fontWeight: '700', color: '#a8a29e', letterSpacing: 2 },
  desc:             { fontSize: 15, color: '#44403c', lineHeight: 24 },
  btnAdopt: {
    backgroundColor: '#f97316', borderRadius: 100,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: '#f97316', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  btnAdoptText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});

================================================
📄 ARCHIVO: app\(app)\solicitudes\nueva.tsx
================================================

import { useSolicitudes } from '@features/solicitudes/presentation/hooks/useSolicitudes';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';

export default function NuevaSolicitudScreen() {
  const { petId, refugioId } = useLocalSearchParams<{ petId: string; refugioId: string }>();
  const { createSolicitud, isCreating } = useSolicitudes();
  const router  = useRouter();
  const [message, setMessage] = useState('');
  const [sent, setSent]       = useState(false);

  if (sent) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>🐾</Text>
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
  container:        { flex: 1, backgroundColor: '#fef7f0' },
  content:          { padding: 24, gap: 14 },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16, backgroundColor: '#fef7f0' },
  successIcon:      { fontSize: 64 },
  successTitle:     { fontSize: 26, fontWeight: '700', color: '#1c1917' },
  successText:      { fontSize: 15, color: '#78716c', textAlign: 'center', lineHeight: 24 },
  title:            { fontSize: 26, fontWeight: '700', color: '#1c1917' },
  subtitle:         { fontSize: 14, color: '#78716c', lineHeight: 22 },
  label:            { fontSize: 10, fontWeight: '700', color: '#78716c', letterSpacing: 2 },
  textarea: {
    borderWidth: 1.5, borderColor: '#e7e5e4', borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: '#1c1917', backgroundColor: '#fff',
    height: 140, textAlignVertical: 'top',
  },
  charCount:        { fontSize: 12, color: '#a8a29e', textAlign: 'right', marginTop: -8 },
  btnPrimary:       { backgroundColor: '#f97316', borderRadius: 100, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  btnDisabled:      { opacity: 0.6 },
  btnPrimaryText:   { color: '#fff', fontWeight: '700', fontSize: 16 },
});

================================================
📄 ARCHIVO: app\(app)\solicitudes.tsx
================================================

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

================================================
📄 ARCHIVO: app\(app)\_layout.tsx
================================================

import { useAuth } from '@features/auth/presentation/hooks/useAuth';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function AppLayout() {
  const { logout } = useAuth();
  const user       = useAuthStore((s) => s.user);
  const isRefugio  = user?.role === 'refugio';

  return (
    <Tabs
      screenOptions={{
        tabBarStyle:           styles.tabBar,
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#a8a29e',
        tabBarLabelStyle:      styles.tabLabel,
        headerStyle:           { backgroundColor: '#fff' },
        headerTintColor:       '#1c1917',
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        ),
      }}
    >
      {/* Adoptante: explorar mascotas */}
      {!isRefugio && (
        <Tabs.Screen
          name="index"
          options={{ title: 'Explorar', tabBarIcon: () => <Text style={styles.icon}>🐾</Text> }}
        />
      )}

      {/* Refugio: gestionar sus mascotas */}
      {isRefugio && (
        <Tabs.Screen
          name="index"
          options={{ title: 'Mis Mascotas', tabBarIcon: () => <Text style={styles.icon}>🏥</Text> }}
        />
      )}

      <Tabs.Screen
        name="solicitudes"
        options={{ title: 'Solicitudes', tabBarIcon: () => <Text style={styles.icon}>📋</Text> }}
      />

      <Tabs.Screen
        name="ai-chat"
        options={{ title: 'Asistente IA', tabBarIcon: () => <Text style={styles.icon}>🤖</Text> }}
      />

      <Tabs.Screen
        name="map"
        options={{ title: 'Mapa', tabBarIcon: () => <Text style={styles.icon}>📍</Text> }}
      />

      {/* Ocultar pantallas de detalle del tab bar */}
      <Tabs.Screen name="pets/[id]"        options={{ href: null }} />
      <Tabs.Screen name="pets/new"         options={{ href: null }} />
      <Tabs.Screen name="pets/edit/[id]"   options={{ href: null }} />
      <Tabs.Screen name="chat/[roomId]"    options={{ href: null }} />
      <Tabs.Screen name="solicitudes/nueva" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar:     { backgroundColor: '#fff', borderTopColor: '#f5f5f4', height: 60 },
  tabLabel:   { fontSize: 11, fontWeight: '600' },
  icon:       { fontSize: 22 },
  logoutBtn:  { marginRight: 16, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fef3c7', borderRadius: 100 },
  logoutText: { color: '#92400e', fontWeight: '600', fontSize: 13 },
});

================================================
📄 ARCHIVO: app\(auth)\login.tsx
================================================

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
          <Text style={styles.logo}>🐾</Text>
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
const DARK    = '#1c1917';

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#fef7f0' },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 },

  header:  { alignItems: 'center', marginBottom: 32 },
  logo:    { fontSize: 56, marginBottom: 8 },
  brand:   { fontSize: 32, fontWeight: '700', color: DARK, letterSpacing: -1 },
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
  titleBold:  { fontSize: 32, fontWeight: '700', color: DARK, letterSpacing: -1, marginTop: -4, marginBottom: 20 },

  errorBox: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 12, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#ef4444' },
  errorText: { color: '#dc2626', fontSize: 13 },

  form:       { gap: 14 },
  fieldGroup: { gap: 6 },
  label:      { fontSize: 10, fontWeight: '700', color: '#78716c', letterSpacing: 2 },
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

  btnPrimary:     { backgroundColor: PRIMARY, borderRadius: 100, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  btnDisabled:    { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  divider:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e7e5e4' },
  dividerText: { color: '#a8a29e', fontSize: 13 },

  btnGoogle:     { borderWidth: 1.5, borderColor: '#e7e5e4', borderRadius: 100, paddingVertical: 14, alignItems: 'center', backgroundColor: '#fff' },
  btnGoogleText: { color: DARK, fontWeight: '600', fontSize: 14 },

  btnSecondary:     { borderRadius: 100, paddingVertical: 14, alignItems: 'center', backgroundColor: '#fef3c7', borderWidth: 1.5, borderColor: '#fde68a' },
  btnSecondaryText: { color: '#92400e', fontWeight: '600', fontSize: 14 },

  footer: { textAlign: 'center', marginTop: 32, fontSize: 13, color: '#a8a29e' },
});

================================================
📄 ARCHIVO: app\(auth)\register.tsx
================================================

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

================================================
📄 ARCHIVO: app\(auth)\_layout.tsx
================================================

import { Stack } from "expo-router";

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}


================================================
📄 ARCHIVO: app\_layout.tsx
================================================

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@shared/infrastructure/supabase/client';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { SupabaseAuthRepository } from '@features/auth/infrastructure/repositories/SupabaseAuthRepository';
import { requestNotificationPermissions } from '@shared/infrastructure/notifications/NotificationService';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } }
});
const authRepo = new SupabaseAuthRepository();

function AuthGuard() {
  const { user, setUser } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false); // 👈 clave del fix

  useEffect(() => {
    async function restoreSession() {
      const user = await authRepo.getCurrentUser();
      setUser(user);
      setIsReady(true);
    }
    restoreSession(); // ✅ función async interna, no async directo en useEffect

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        async function syncUser() {
          if (session) {
            const user = await authRepo.getCurrentUser();
            setUser(user);
          } else {
            setUser(null);
          }
          setIsReady(true); // 👈 movido aquí: cubre ambos casos (con y sin sesión)
        }
        syncUser();
      }
    );
    requestNotificationPermissions(); 
    return () => subscription.unsubscribe(); // ✅ cleanup síncrono
  }, []);

  useEffect(() => {
    if (!isReady) return; // 👈 no navegar hasta estar montado

    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) router.replace('/(auth)/login');
    if (user && inAuth) router.replace('/(app)');
  }, [user, segments, isReady]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard />
    </QueryClientProvider>
  );
}

================================================
📄 ARCHIVO: app.json
================================================

{
  "expo": {
    "name": "PetAdopt",
    "slug": "PetAdopt",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "petadopt",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "PetAdopt necesita tu ubicación para mostrarte los refugios cercanos."
      },
      "supportsTablet": true,
      "bundleIdentifier": "com.tuusuario.petadopt"
    },
    "android": {
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ],
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.tuusuario.petadopt"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-notifications",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      "expo-secure-store",
      "expo-video"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}

================================================
📄 ARCHIVO: CLAUDE.md
================================================

@AGENTS.md


================================================
📄 ARCHIVO: components\external-link.tsx
================================================

import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}


================================================
📄 ARCHIVO: components\haptic-tab.tsx
================================================

import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}


================================================
📄 ARCHIVO: components\hello-wave.tsx
================================================

import Animated from 'react-native-reanimated';

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      👋
    </Animated.Text>
  );
}


================================================
📄 ARCHIVO: components\parallax-scroll-view.tsx
================================================

import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}>
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}>
        {headerImage}
      </Animated.View>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});


================================================
📄 ARCHIVO: components\themed-text.tsx
================================================

import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});


================================================
📄 ARCHIVO: components\themed-view.tsx
================================================

import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}


================================================
📄 ARCHIVO: components\ui\collapsible.tsx
================================================

import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});


================================================
📄 ARCHIVO: components\ui\icon-symbol.ios.tsx
================================================

import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}


================================================
📄 ARCHIVO: components\ui\icon-symbol.tsx
================================================

// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}


================================================
📄 ARCHIVO: constants\theme.ts
================================================

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});


================================================
📄 ARCHIVO: env.d.ts
================================================

declare const process: {
    env: {
        readonly EXPO_PUBLIC_SUPABASE_URL: string;
        readonly EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
        readonly [key: string]: string | undefined;
    };
};

================================================
📄 ARCHIVO: eslint.config.js
================================================

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);


================================================
📄 ARCHIVO: hooks\use-color-scheme.ts
================================================

export { useColorScheme } from 'react-native';


================================================
📄 ARCHIVO: hooks\use-color-scheme.web.ts
================================================

import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}


================================================
📄 ARCHIVO: hooks\use-theme-color.ts
================================================

/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}


================================================
📄 ARCHIVO: package.json
================================================

{
  "name": "chat-web-socket",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "@supabase/supabase-js": "^2.106.1",
    "@tanstack/react-query": "^5.100.13",
    "base64-arraybuffer": "^1.0.2",
    "expo": "~54.0.33",
    "expo-av": "~16.0.8",
    "expo-constants": "~18.0.13",
    "expo-file-system": "~19.0.22",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-image-picker": "~17.0.11",
    "expo-linking": "~8.0.11",
    "expo-location": "~19.0.8",
    "expo-notifications": "~0.32.17",
    "expo-router": "~6.0.23",
    "expo-secure-store": "~15.0.8",
    "expo-splash-screen": "~31.0.13",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-video": "~3.0.16",
    "expo-web-browser": "~15.0.10",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-maps": "1.20.1",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.5.1",
    "zustand": "^5.0.13"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "eslint": "^9.25.0",
    "eslint-config-expo": "~10.0.0",
    "typescript": "~5.9.2"
  },
  "private": true
}


================================================
📄 ARCHIVO: README.md
================================================

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


================================================
📄 ARCHIVO: scripts\reset-project.js
================================================

#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /app, /components, /hooks, /scripts, and /constants directories to /app-example based on user input and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit app/index.tsx to edit the main screen.${
        userInput === "y"
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);


================================================
📄 ARCHIVO: src\features\ai\application\use-cases\SendAiMessageUseCase.ts
================================================

import { AiMessage } from '../../domain/entities/AiMessage';
import { IAiRepository } from '../../domain/repositories/IAiRepository';

export class SendAiMessageUseCase {
  constructor(private readonly repo: IAiRepository) {}

  async execute(userMessage: string, history: AiMessage[]): Promise<string> {
    if (!userMessage.trim()) throw new Error('El mensaje no puede estar vacío');
    return this.repo.sendMessage(userMessage.trim(), history);
  }
}

================================================
📄 ARCHIVO: src\features\ai\domain\entities\AiMessage.ts
================================================

export type AiRole = 'user' | 'model';

export interface AiMessage {
  id:        string;
  role:      AiRole;
  content:   string;
  createdAt: Date;
}

================================================
📄 ARCHIVO: src\features\ai\domain\repositories\IAiRepository.ts
================================================

import { AiMessage } from '../entities/AiMessage';

export interface IAiRepository {
  sendMessage(
    userMessage: string,
    history:     AiMessage[],
  ): Promise<string>;
}

================================================
📄 ARCHIVO: src\features\ai\infrastructure\repositories\GeminiRepository.ts
================================================

import { AiMessage } from '@features/ai/domain/entities/AiMessage';
import { IAiRepository } from '@features/ai/domain/repositories/IAiRepository';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;
const GEMINI_URL     = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `Eres un asistente virtual especializado en salud y cuidado de mascotas para la app PetAdopt.
Tu rol es ayudar a adoptantes y refugios con:
- Consejos de salud y nutrición para perros, gatos y otras mascotas
- Guías de cuidado, higiene y bienestar animal
- Información sobre vacunas, desparasitación y visitas al veterinario
- Tips de comportamiento y entrenamiento
- Orientación sobre el proceso de adopción y adaptación

Responde siempre en español, de forma amigable, empática y clara.
Si la pregunta no está relacionada con mascotas, redirige amablemente la conversación.
Nunca reemplaces la consulta con un veterinario real para casos de emergencia.`;

export class GeminiRepository implements IAiRepository {

  async sendMessage(userMessage: string, history: AiMessage[]): Promise<string> {
    const contents = [
      // Historial previo
      ...history.map(msg => ({
        role:  msg.role,
        parts: [{ text: msg.content }],
      })),
      // Mensaje actual
      {
        role:  'user',
        parts: [{ text: userMessage }],
      },
    ];

    const response = await fetch(GEMINI_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          temperature:     0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message ?? 'Error al conectar con Gemini');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No pude generar una respuesta.';
  }
}

================================================
📄 ARCHIVO: src\features\ai\presentation\hooks\useAiChat.ts
================================================

import { SendAiMessageUseCase } from '@features/ai/application/use-cases/SendAiMessageUseCase';
import { AiMessage } from '@features/ai/domain/entities/AiMessage';
import { GeminiRepository } from '@features/ai/infrastructure/repositories/GeminiRepository';
import { useState } from 'react';

const repo        = new GeminiRepository();
const sendUseCase = new SendAiMessageUseCase(repo);

export function useAiChat() {
  const [messages, setMessages]   = useState<AiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    setError(null);

    // Agrega mensaje del usuario inmediatamente
    const userMsg: AiMessage = {
      id:        `user-${Date.now()}`,
      role:      'user',
      content:   content.trim(),
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Solo pasamos últimos 10 mensajes como historial para no sobrepasar tokens
      const history = [...messages, userMsg].slice(-10);
      const response = await sendUseCase.execute(content, history);

      const modelMsg: AiMessage = {
        id:        `model-${Date.now()}`,
        role:      'model',
        content:   response,
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return { messages, sendMessage, isLoading, error, clearChat };
}

================================================
📄 ARCHIVO: src\features\auth\application\use-cases\LoginUseCase.ts
================================================

import { AuthError } from '../../../../shared/domain/errors/AppError';
import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class LoginUseCase {
    constructor(private readonly authRepo: IAuthRepository) {}

    async execute(email: string, password: string): Promise<User> {
        if (!email || !password) 
            throw new AuthError('Email y contraseña son requeridos');
        try {
            return await this.authRepo.login(email, password);
        } catch (error) {
            throw new AuthError('Credenciales inválidas', error);
        }
    }
};

================================================
📄 ARCHIVO: src\features\auth\application\use-cases\RegisterUseCase.ts
================================================

import { AuthError } from '@shared/domain/errors/AppError';
import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class RegisterUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(
    email:     string,
    password:  string,
    username:  string,
    role:      'adoptante' | 'refugio' = 'adoptante',
    fullName?: string,
  ): Promise<User> {
    if (!email || !password || !username)
      throw new AuthError('Todos los campos son obligatorios');
    if (password.length < 6)
      throw new AuthError('La contraseña debe tener al menos 6 caracteres');
    if (username.includes(' '))
      throw new AuthError('El usuario no puede contener espacios');
    return this.authRepo.register(email, password, username, role, fullName);
  }
}

================================================
📄 ARCHIVO: src\features\auth\domain\entities\User.ts
================================================

export type UserRole = 'adoptante' | 'refugio';

export interface User {
  id:          string;
  email:       string;
  username:    string;
  fullName?:   string;
  avatarUrl?:  string;
  role:        UserRole;
  phone?:      string;
  address?:    string;
}

================================================
📄 ARCHIVO: src\features\auth\domain\repositories\IAuthRepository.ts
================================================

import { User } from '../entities/User';

export interface IAuthRepository {
  login(email: string, password: string):                    Promise<User>;
  loginWithGoogle():                                         Promise<void>;
  register(
    email:     string,
    password:  string,
    username:  string,
    role?:     'adoptante' | 'refugio',
    fullName?: string,
  ):                                                         Promise<User>;
  logout():                                                  Promise<void>;
  getCurrentUser():                                          Promise<User | null>;
}

================================================
📄 ARCHIVO: src\features\auth\infrastructure\repositories\SupabaseAuthRepository.ts
================================================

import { supabase } from "@shared/infrastructure/supabase/client";
import { User } from "@features/auth/domain/entities/User";
import { IAuthRepository } from "@features/auth/domain/repositories/IAuthRepository";

export class SupabaseAuthRepository implements IAuthRepository {

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw error;
    return this.fetchProfile(data.user.id, data.user.email!);
  }

  async loginWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
  }

  async register(
    email: string,
    password: string,
    username: string,
    role: 'adoptante' | 'refugio' = 'adoptante',
    fullName?: string,
  ): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, role, full_name: fullName ?? '' } },
    });
    if (error) throw error;
    if (!data.user) throw new Error('No se pudo crear el usuario');

    await supabase.from('profiles').upsert(
      { id: data.user.id, username, role, full_name: fullName ?? '' },
      { onConflict: 'id' }
    );

    // Si es refugio, crear registro en tabla refugios
    if (role === 'refugio') {
      await supabase.from('refugios').upsert(
        { id: data.user.id, name: fullName ?? username },
        { onConflict: 'id' }
      );
    }

    if (role === 'refugio') {
      await supabase.from('refugios').upsert(
        {
          id: data.user.id,
          name: fullName ?? username,
          lat: -0.1807,   // Coordenadas por defecto (Quito)
          lng: -78.4678,
        },
        { onConflict: 'id' }
      );
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      username,
      role,
      fullName,
    };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return this.fetchProfile(user.id, user.email!);
  }

  private async fetchProfile(id: string, email: string): Promise<User> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, full_name, avatar_url, role, phone, address')
      .eq('id', id)
      .single();

    return {
      id,
      email,
      username: profile?.username ?? '',
      fullName: profile?.full_name ?? undefined,
      avatarUrl: profile?.avatar_url ?? undefined,
      role: profile?.role ?? 'adoptante',
      phone: profile?.phone ?? undefined,
      address: profile?.address ?? undefined,
    };
  }
}

================================================
📄 ARCHIVO: src\features\auth\presentation\hooks\useAuth.ts
================================================

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { LoginUseCase } from '@features/auth/application/use-cases/LoginUseCase';
import { RegisterUseCase } from '@features/auth/application/use-cases/RegisterUseCase';
import { SupabaseAuthRepository } from '@features/auth/infrastructure/repositories/SupabaseAuthRepository';
import { useAuthStore } from '../store/authStore';

type RegisterDto = {
  email:     string;
  password:  string;
  username:  string;
  role:      'adoptante' | 'refugio';
  fullName?: string;
};

const authRepo       = new SupabaseAuthRepository();
const loginUseCase   = new LoginUseCase(authRepo);
const registerUseCase = new RegisterUseCase(authRepo);

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUseCase.execute(email, password),
    onSuccess: (user) => {
      setUser(user);
      router.replace('/(app)');
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, username, role, fullName }: RegisterDto) =>
      registerUseCase.execute(email, password, username, role, fullName),
  });

  const loginWithGoogle = async () => {
    try {
      await authRepo.loginWithGoogle();
    } catch (e: any) {
      console.error('Google login error:', e.message);
    }
  };

  const logout = async () => {
    try {
      await authRepo.logout();
    } finally {
      setUser(null);
      router.replace('/(auth)/login');
    }
  };

  return {
    user,
    login:           loginMutation.mutate,
    register:        registerMutation.mutate,
    loginWithGoogle,
    logout,
    isLoading:       loginMutation.isPending || registerMutation.isPending,
    error:           loginMutation.error?.message ?? registerMutation.error?.message ?? null,
  };
}

================================================
📄 ARCHIVO: src\features\auth\presentation\store\authStore.ts
================================================

import { create } from 'zustand';
import { User } from '../../domain/entities/User';

interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));

================================================
📄 ARCHIVO: src\features\chat\application\use-cases\CreateRoomUseCase.ts
================================================

import { ChatError } from '../../../../shared/domain/errors/AppError';
import { Room } from '../../domain/entities/Message';
import { IChatRepository } from '../../domain/repositories/IChatRepository';

export class CreateRoomUseCase {
    constructor(private readonly chatRepo: IChatRepository) { }

    async execute(
        name: string,
        userId: string,
        productName?: string,
        productDescription?: string,
        productPrice?: number,
    ): Promise<Room> {
        if (!name.trim()) throw new ChatError('El nombre de la sala es requerido');
        return this.chatRepo.createRoom(name.trim(), userId, productName, productDescription, productPrice);
    }
}

================================================
📄 ARCHIVO: src\features\chat\application\use-cases\GetMessagesUseCase.ts
================================================

import { Message } from '../../domain/entities/Message';
import { IChatRepository } from '../../domain/repositories/IChatRepository';

export class GetMessagesUseCase {
    constructor(private readonly chatRepo: IChatRepository) {}

    execute(roomId: string): Promise<Message[]> {
        return this.chatRepo.getMessages(roomId)
    }
}

================================================
📄 ARCHIVO: src\features\chat\application\use-cases\SendMessageUseCase.ts
================================================

import { ChatError } from '../../../../shared/domain/errors/AppError';
import { Message } from '../../domain/entities/Message';
import { IChatRepository } from '../../domain/repositories/IChatRepository';

export class SendMessageUseCase {
    constructor(private readonly chatRepo: IChatRepository) {}

    async execute(
        roomId: string,
        userId: string,
        content: string,
        imageUrl?: string,
    ): Promise<Message> {
        const trimmed = content.trim();

        // ✅ Válido si hay texto O imagen
        if (!trimmed && !imageUrl)
            throw new ChatError('El mensaje no puede estar vacío');
        if (trimmed.length > 500)
            throw new ChatError('El mensaje no puede tener más de 500 caracteres');

        return this.chatRepo.sendMessage(roomId, userId, trimmed, imageUrl);
    }
}

================================================
📄 ARCHIVO: src\features\chat\application\use-cases\SubscribeToRoomUseCase.ts
================================================

import { Message } from '../../domain/entities/Message'
import { IChatRepository } from '../../domain/repositories/IChatRepository'

export class SubscribeToRoomUseCase {
    constructor(private readonly chatRepo: IChatRepository) {}

    execute(roomId: string, onMessage: (msg: Message) => void): () => void {
        return this.chatRepo.subscribeToRoom(roomId, onMessage);
    }
}

================================================
📄 ARCHIVO: src\features\chat\domain\entities\Message.ts
================================================

export interface Message {
    id:              string;
    roomId:          string;
    userId:          string;
    content:         string;
    createdAt:       Date;
    authorUsername?: string;
    authorRole?:     'seller' | 'client';
    imageUrl?:       string;
}

export interface Room {
    id:                  string;
    name:                string;
    createdBy:           string;
    createdAt:           Date;
    productName?:        string;
    productDescription?: string;
    productPrice?:       number;
}

================================================
📄 ARCHIVO: src\features\chat\domain\entities\Room.ts
================================================



================================================
📄 ARCHIVO: src\features\chat\domain\repositories\IChatRepository.ts
================================================

import { Message, Room } from '../entities/Message';

export interface IChatRepository {
    getRooms():                                   Promise<Room[]>;
    createRoom(
        name:                string,
        userId:              string,
        productName?:        string,
        productDescription?: string,
        productPrice?:       number,
    ):                                            Promise<Room>;
    getMessages(roomId: string):                  Promise<Message[]>;
    sendMessage(
        roomId:    string,
        userId:    string,
        content:   string,
        imageUrl?: string,
    ):                                            Promise<Message>;
    subscribeToRoom(
        roomId:    string,
        onMessage: (msg: Message) => void,
    ):                                            () => void;
}

================================================
📄 ARCHIVO: src\features\chat\infrastructure\repositories\SupabaseChatRepository.ts
================================================

import { supabase } from "@shared/infrastructure/supabase/client";
import { Message, Room } from "@features/chat/domain/entities/Message";
import { IChatRepository } from "@features/chat/domain/repositories/IChatRepository";

export class SupabaseChatRepository implements IChatRepository {

    async getRooms(): Promise<Room[]> {
        const { data, error } = await supabase
            .from("rooms")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) throw error;
        return (data ?? []).map(this.mapRoom);
    }

    async createRoom(
        name:                string,
        userId:              string,
        productName?:        string,
        productDescription?: string,
        productPrice?:       number,
    ): Promise<Room> {
        const { data, error } = await supabase
            .from("rooms")
            .insert({
                name,
                created_by:          userId,
                product_name:        productName,
                product_description: productDescription,
                product_price:       productPrice,
            })
            .select()
            .single();
        if (error) throw error;
        return this.mapRoom(data);
    }

    async getMessages(roomId: string): Promise<Message[]> {
        const { data, error } = await supabase
            .from("messages")
            .select("id, room_id, user_id, content, created_at, image_url, profiles(username, role)")
            .eq("room_id", roomId)
            .order("created_at", { ascending: true })
            .limit(50);
        if (error) throw error;
        return (data ?? []).map(this.mapMessage);
    }

    async sendMessage(
        roomId:    string,
        userId:    string,
        content:   string,
        imageUrl?: string,
    ): Promise<Message> {
        const { data, error } = await supabase
            .from("messages")
            .insert({ room_id: roomId, user_id: userId, content, image_url: imageUrl })
            .select("id, room_id, user_id, content, created_at, image_url, profiles(username, role)")
            .single();
        if (error) throw error;
        return this.mapMessage(data);
    }

    subscribeToRoom(roomId: string, onMessage: (msg: Message) => void): () => void {
        const channel = supabase
            .channel(`room:${roomId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
                async (payload) => {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("username, role")
                        .eq("id", payload.new.user_id)
                        .single();

                    onMessage({
                        id:             payload.new.id,
                        roomId:         payload.new.room_id,
                        userId:         payload.new.user_id,
                        content:        payload.new.content,
                        createdAt:      new Date(payload.new.created_at),
                        authorUsername: profile?.username,
                        authorRole:     profile?.role ?? "client",
                        imageUrl:       payload.new.image_url ?? undefined,
                    });
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }

    private mapRoom = (raw: any): Room => ({
        id:                 raw.id,
        name:               raw.name,
        createdBy:          raw.created_by,
        createdAt:          new Date(raw.created_at),
        productName:        raw.product_name ?? undefined,
        productDescription: raw.product_description ?? undefined,
        productPrice:       raw.product_price ?? undefined,
    });

    private mapMessage = (raw: any): Message => ({
        id:             raw.id,
        roomId:         raw.room_id,
        userId:         raw.user_id,
        content:        raw.content,
        createdAt:      new Date(raw.created_at),
        authorUsername: raw.profiles?.username,
        authorRole:     raw.profiles?.role ?? "client",
        imageUrl:       raw.image_url ?? undefined,
    });
}

================================================
📄 ARCHIVO: src\features\chat\presentation\hooks\useChat.ts
================================================

import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { GetMessagesUseCase } from "@features/chat/application/use-cases/GetMessagesUseCase";
import { SendMessageUseCase } from "@features/chat/application/use-cases/SendMessageUseCase";
import { SubscribeToRoomUseCase } from "@features/chat/application/use-cases/SubscribeToRoomUseCase";
import { Message } from "@features/chat/domain/entities/Message";
import { SupabaseChatRepository } from "@features/chat/infrastructure/repositories/SupabaseChatRepository";
import { showMessageNotification } from "@shared/infrastructure/notifications/NotificationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const chatRepo = new SupabaseChatRepository();
const sendMessageUseCase = new SendMessageUseCase(chatRepo);
const getMessagesUseCase = new GetMessagesUseCase(chatRepo);
const subscribeUseCase = new SubscribeToRoomUseCase(chatRepo);

export function useChat(roomId: string) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: () => getMessagesUseCase.execute(roomId),
    enabled: !!user,
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = subscribeUseCase.execute(roomId, (newMsg) => {
      queryClient.setQueryData(["messages", roomId], (old: Message[] = []) => {
        const exists = old.some((m) => m.id === newMsg.id);
        return exists ? old : [...old, newMsg];
      });

      if (newMsg.userId !== user?.id) {
        showMessageNotification(
          roomId,
          newMsg.authorUsername ?? "Alguien",
          newMsg.content,
        );
      }
    });

    return unsubscribe;
  }, [roomId]);

  const sendMutation = useMutation({
    mutationFn: ({ content, imageUrl }: { content: string; imageUrl?: string }) =>
      sendMessageUseCase.execute(roomId, user!.id, content, imageUrl),

    onMutate: async ({ content, imageUrl }) => {
      const tempMsg: Message = {
        id: `temp-${Date.now()}`,
        roomId,
        userId: user!.id,
        content,
        imageUrl,
        createdAt: new Date(),
        authorUsername: user!.username,
      };
      queryClient.setQueryData(["messages", roomId], (old: Message[] = []) => [
        ...old,
        tempMsg,
      ]);
      return { tempMsg };
    },

    onSuccess: (realMsg, _vars, context) => {
      queryClient.setQueryData(["messages", roomId], (old: Message[] = []) =>
        old.map((m) => (m.id === context?.tempMsg.id ? realMsg : m)),
      );
    },

    onError: (_err, _vars, context) => {
      if (context?.tempMsg) {
        queryClient.setQueryData(["messages", roomId], (old: Message[] = []) =>
          old.filter((m) => m.id !== context.tempMsg.id),
        );
      }
    },
  }); // ✅ cierra useMutation

  return {
    messages,
    sendMessage: sendMutation.mutate,
    isLoading,
    isSending: sendMutation.isPending,
  };
} // ✅ cierra useChat

================================================
📄 ARCHIVO: src\features\chat\presentation\hooks\useRooms.ts
================================================

import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { CreateRoomUseCase } from "@features/chat/application/use-cases/CreateRoomUseCase";
import { Room } from "@features/chat/domain/entities/Message";
import { SupabaseChatRepository } from "@features/chat/infrastructure/repositories/SupabaseChatRepository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const chatRepo = new SupabaseChatRepository();
const createRoomUseCase = new CreateRoomUseCase(chatRepo);

export function useRooms() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // useQuery obtiene la lista de salas y la cachea bajo la clave ['rooms']
  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => chatRepo.getRooms(),
    enabled: !!user, // Solo fetchar si hay usuario autenticado
  });

  // useMutation para crear una sala nueva
  const createMutation = useMutation({
    mutationFn: ({
    name, productName, productDescription, productPrice
    }: {
        name: string;
        productName?: string;
        productDescription?: string;
        productPrice?: number;
    }) => createRoomUseCase.execute(name, user!.id, productName, productDescription, productPrice),
    onSuccess: (newRoom) => {
      // Actualizar el cache 
      queryClient.setQueryData(["rooms"], (old: Room[]) => [
        newRoom,
        ...(old ?? []),
      ]);
    },
  });

  return {
    rooms,
    isLoading,
    error: error?.message ?? null,
    createRoom: (
        name: string,
        productName?: string,
        productDescription?: string,
        productPrice?: number,
        options?: { onSuccess?: () => void }
    ) => createMutation.mutate(
        { name, productName, productDescription, productPrice },
        options
    ),
    isCreating: createMutation.isPending,
    createError: createMutation.error?.message ?? null,
  };
}


================================================
📄 ARCHIVO: src\features\map\application\use-cases\GetRefugiosLocationsUseCase.ts
================================================

import { RefugioLocation } from '../../domain/entities/RefugioLocation';
import { IMapRepository } from '../../domain/repositories/IMapRepository';

export class GetRefugiosLocationsUseCase {
  constructor(private readonly repo: IMapRepository) {}

  execute(): Promise<RefugioLocation[]> {
    return this.repo.getRefugiosLocations();
  }
}

================================================
📄 ARCHIVO: src\features\map\domain\entities\RefugioLocation.ts
================================================

export interface RefugioLocation {
  id:          string;
  name:        string;
  address?:    string;
  lat:         number;
  lng:         number;
  phone?:      string;
  description?: string;
}

================================================
📄 ARCHIVO: src\features\map\domain\repositories\IMapRepository.ts
================================================

import { RefugioLocation } from '../entities/RefugioLocation';

export interface IMapRepository {
  getRefugiosLocations(): Promise<RefugioLocation[]>;
}

================================================
📄 ARCHIVO: src\features\map\infrastructure\repositories\SupabaseMapRepository.ts
================================================

import { supabase } from '@shared/infrastructure/supabase/client';
import { RefugioLocation } from '@features/map/domain/entities/RefugioLocation';
import { IMapRepository } from '@features/map/domain/repositories/IMapRepository';

export class SupabaseMapRepository implements IMapRepository {

  async getRefugiosLocations(): Promise<RefugioLocation[]> {
    const { data, error } = await supabase
      .from('refugios')
      .select('id, name, address, lat, lng, phone, description')
      .not('lat', 'is', null)
      .not('lng', 'is', null);

    if (error) throw error;

    return (data ?? []).map(raw => ({
      id:          raw.id,
      name:        raw.name,
      address:     raw.address  ?? undefined,
      lat:         raw.lat,
      lng:         raw.lng,
      phone:       raw.phone    ?? undefined,
      description: raw.description ?? undefined,
    }));
  }
}

================================================
📄 ARCHIVO: src\features\map\presentation\hooks\useMap.ts
================================================

import { GetRefugiosLocationsUseCase } from '@features/map/application/use-cases/GetRefugiosLocationsUseCase';
import { SupabaseMapRepository } from '@features/map/infrastructure/repositories/SupabaseMapRepository';
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

const repo        = new SupabaseMapRepository();
const getUseCase  = new GetRefugiosLocationsUseCase(repo);

export interface UserLocation {
  lat: number;
  lng: number;
}

export function useMap() {
  const [userLocation, setUserLocation]     = useState<UserLocation | null>(null);
  const [locationError, setLocationError]   = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const { data: refugios = [], isLoading: refugiosLoading } = useQuery({
    queryKey: ['refugios-map'],
    queryFn:  () => getUseCase.execute(),
  });

  useEffect(() => {
    async function getUserLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permiso de ubicación denegado');
          setLocationLoading(false);
          return;
        }
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      } catch (e: any) {
        setLocationError(e.message);
      } finally {
        setLocationLoading(false);
      }
    }

    getUserLocation();
  }, []);

  return {
    refugios,
    userLocation,
    locationError,
    isLoading: refugiosLoading || locationLoading,
  };
}

================================================
📄 ARCHIVO: src\features\pets\application\use-cases\CreatePetUseCase.ts
================================================

import { Pet } from '../../domain/entities/Pet';
import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class CreatePetUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> {
    if (!pet.name.trim()) throw new Error('El nombre es requerido');
    return this.repo.create(pet);
  }
}

================================================
📄 ARCHIVO: src\features\pets\application\use-cases\DeletePetUseCase.ts
================================================

import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class DeletePetUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(id: string): Promise<void> { return this.repo.delete(id); }
}

================================================
📄 ARCHIVO: src\features\pets\application\use-cases\GetPetsByRefugioUseCase.ts
================================================

import { Pet } from '../../domain/entities/Pet';
import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class GetPetsByRefugioUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(refugioId: string): Promise<Pet[]> { return this.repo.getByRefugio(refugioId); }
}

================================================
📄 ARCHIVO: src\features\pets\application\use-cases\GetPetsUseCase.ts
================================================

import { Pet } from '../../domain/entities/Pet';
import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class GetPetsUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(): Promise<Pet[]> { return this.repo.getAll(); }
}

================================================
📄 ARCHIVO: src\features\pets\application\use-cases\UpdatePetUseCase.ts
================================================

import { Pet } from '../../domain/entities/Pet';
import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class UpdatePetUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(id: string, pet: Partial<Pet>): Promise<Pet> { return this.repo.update(id, pet); }
}

================================================
📄 ARCHIVO: src\features\pets\domain\entities\Pet.ts
================================================

export type PetSpecies = 'perro' | 'gato' | 'otro';
export type PetGender  = 'macho' | 'hembra';
export type PetStatus  = 'disponible' | 'en_proceso' | 'adoptado';

export interface Pet {
  id:          string;
  refugioId:   string;
  name:        string;
  species:     PetSpecies;
  breed?:      string;
  ageYears?:   number;
  gender?:     PetGender;
  description?: string;
  photoUrl?:   string;
  status:      PetStatus;
  createdAt:   Date;
}

================================================
📄 ARCHIVO: src\features\pets\domain\repositories\IPetRepository.ts
================================================

import { Pet } from '../entities/Pet';

export interface IPetRepository {
  getAll():                                    Promise<Pet[]>;
  getByRefugio(refugioId: string):             Promise<Pet[]>;
  getById(id: string):                         Promise<Pet>;
  create(pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet>;
  update(id: string, pet: Partial<Pet>):       Promise<Pet>;
  delete(id: string):                          Promise<void>;
}

================================================
📄 ARCHIVO: src\features\pets\infrastructure\repositories\SupabasePetRepository.ts
================================================

import { supabase } from '@shared/infrastructure/supabase/client';
import { Pet } from '@features/pets/domain/entities/Pet';
import { IPetRepository } from '@features/pets/domain/repositories/IPetRepository';

export class SupabasePetRepository implements IPetRepository {

  async getAll(): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('mascotas')
      .select('*')
      .eq('status', 'disponible')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(this.map);
  }

  async getByRefugio(refugioId: string): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('mascotas')
      .select('*')
      .eq('refugio_id', refugioId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(this.map);
  }

  async getById(id: string): Promise<Pet> {
    const { data, error } = await supabase
      .from('mascotas')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return this.map(data);
  }

  async create(pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> {
    const { data, error } = await supabase
      .from('mascotas')
      .insert({
        refugio_id:  pet.refugioId,
        name:        pet.name,
        species:     pet.species,
        breed:       pet.breed,
        age_years:   pet.ageYears,
        gender:      pet.gender,
        description: pet.description,
        photo_url:   pet.photoUrl,
        status:      pet.status,
      })
      .select()
      .single();
    if (error) throw error;
    return this.map(data);
  }

  async update(id: string, pet: Partial<Pet>): Promise<Pet> {
    const { data, error } = await supabase
      .from('mascotas')
      .update({
        name:        pet.name,
        species:     pet.species,
        breed:       pet.breed,
        age_years:   pet.ageYears,
        gender:      pet.gender,
        description: pet.description,
        photo_url:   pet.photoUrl,
        status:      pet.status,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return this.map(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('mascotas')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  private map = (raw: any): Pet => ({
    id:          raw.id,
    refugioId:   raw.refugio_id,
    name:        raw.name,
    species:     raw.species,
    breed:       raw.breed       ?? undefined,
    ageYears:    raw.age_years   ?? undefined,
    gender:      raw.gender      ?? undefined,
    description: raw.description ?? undefined,
    photoUrl:    raw.photo_url   ?? undefined,
    status:      raw.status,
    createdAt:   new Date(raw.created_at),
  });
}

================================================
📄 ARCHIVO: src\features\pets\presentation\hooks\usePets.ts
================================================

import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { CreatePetUseCase } from '@features/pets/application/use-cases/CreatePetUseCase';
import { DeletePetUseCase } from '@features/pets/application/use-cases/DeletePetUseCase';
import { GetPetsByRefugioUseCase } from '@features/pets/application/use-cases/GetPetsByRefugioUseCase';
import { GetPetsUseCase } from '@features/pets/application/use-cases/GetPetsUseCase';
import { UpdatePetUseCase } from '@features/pets/application/use-cases/UpdatePetUseCase';
import { Pet } from '@features/pets/domain/entities/Pet';
import { SupabasePetRepository } from '@features/pets/infrastructure/repositories/SupabasePetRepository';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const repo               = new SupabasePetRepository();
const getPetsUseCase     = new GetPetsUseCase(repo);
const getByRefugioUseCase = new GetPetsByRefugioUseCase(repo);
const createPetUseCase   = new CreatePetUseCase(repo);
const updatePetUseCase   = new UpdatePetUseCase(repo);
const deletePetUseCase   = new DeletePetUseCase(repo);

// Hook para adoptantes — ve todas las mascotas disponibles
export function usePets() {
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: () => getPetsUseCase.execute(),
  });
  return { pets, isLoading };
}

// Hook para refugio — gestiona sus propias mascotas
export function useRefugioPets() {
  const user        = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['pets', 'refugio', user?.id],
    queryFn:  () => getByRefugioUseCase.execute(user!.id),
    enabled:  !!user,
  });

  const createMutation = useMutation({
    mutationFn: (pet: Omit<Pet, 'id' | 'createdAt'>) => createPetUseCase.execute(pet),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, pet }: { id: string; pet: Partial<Pet> }) =>
      updatePetUseCase.execute(id, pet),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePetUseCase.execute(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  return {
    pets,
    isLoading,
    createPet:  createMutation.mutate,
    updatePet:  updateMutation.mutate,
    deletePet:  deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

================================================
📄 ARCHIVO: src\features\solicitudes\application\use-cases\CreateSolicitudUseCase.ts
================================================

import { Solicitud } from '../../domain/entities/Solicitud';
import { ISolicitudRepository } from '../../domain/repositories/ISolicitudRepository';

export class CreateSolicitudUseCase {
  constructor(private readonly repo: ISolicitudRepository) {}

  execute(data: {
    mascotaId:   string;
    adoptanteId: string;
    refugioId:   string;
    message?:    string;
  }): Promise<Solicitud> {
    if (!data.mascotaId || !data.adoptanteId || !data.refugioId)
      throw new Error('Datos incompletos para la solicitud');
    return this.repo.create(data);
  }
}

================================================
📄 ARCHIVO: src\features\solicitudes\application\use-cases\GetSolicitudesUseCase.ts
================================================

import { Solicitud } from '../../domain/entities/Solicitud';
import { ISolicitudRepository } from '../../domain/repositories/ISolicitudRepository';

export class GetSolicitudesAdoptanteUseCase {
  constructor(private readonly repo: ISolicitudRepository) {}
  execute(adoptanteId: string): Promise<Solicitud[]> {
    return this.repo.getByAdoptante(adoptanteId);
  }
}

export class GetSolicitudesRefugioUseCase {
  constructor(private readonly repo: ISolicitudRepository) {}
  execute(refugioId: string): Promise<Solicitud[]> {
    return this.repo.getByRefugio(refugioId);
  }
}

================================================
📄 ARCHIVO: src\features\solicitudes\application\use-cases\UpdateSolicitudStatusUseCase.ts
================================================

import { Solicitud, SolicitudStatus } from '../../domain/entities/Solicitud';
import { ISolicitudRepository } from '../../domain/repositories/ISolicitudRepository';

export class UpdateSolicitudStatusUseCase {
  constructor(private readonly repo: ISolicitudRepository) {}
  execute(id: string, status: SolicitudStatus): Promise<Solicitud> {
    return this.repo.updateStatus(id, status);
  }
}

================================================
📄 ARCHIVO: src\features\solicitudes\domain\entities\Solicitud.ts
================================================

export type SolicitudStatus = 'pendiente' | 'aprobada' | 'rechazada';

export interface Solicitud {
  id:          string;
  mascotaId:   string;
  adoptanteId: string;
  refugioId:   string;
  status:      SolicitudStatus;
  message?:    string;
  createdAt:   Date;
  // joins
  mascotaName?:      string;
  mascotaPhoto?:     string;
  adoptanteUsername?: string;
  refugioUsername?:  string;
}

================================================
📄 ARCHIVO: src\features\solicitudes\domain\repositories\ISolicitudRepository.ts
================================================

import { Solicitud, SolicitudStatus } from '../entities/Solicitud';

export interface ISolicitudRepository {
  getByAdoptante(adoptanteId: string):              Promise<Solicitud[]>;
  getByRefugio(refugioId: string):                  Promise<Solicitud[]>;
  create(data: {
    mascotaId:   string;
    adoptanteId: string;
    refugioId:   string;
    message?:    string;
  }):                                               Promise<Solicitud>;
  updateStatus(id: string, status: SolicitudStatus): Promise<Solicitud>;
}

================================================
📄 ARCHIVO: src\features\solicitudes\infrastructure\repositories\SupabaseSolicitudRepository.ts
================================================

import { supabase } from '@shared/infrastructure/supabase/client';
import { Solicitud, SolicitudStatus } from '@features/solicitudes/domain/entities/Solicitud';
import { ISolicitudRepository } from '@features/solicitudes/domain/repositories/ISolicitudRepository';

export class SupabaseSolicitudRepository implements ISolicitudRepository {

  async getByAdoptante(adoptanteId: string): Promise<Solicitud[]> {
    const { data, error } = await supabase
      .from('solicitudes')
      .select(`
        *,
        mascotas(name, photo_url),
        refugio:profiles!solicitudes_refugio_id_fkey(username)
      `)
      .eq('adoptante_id', adoptanteId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(this.map);
  }

  async getByRefugio(refugioId: string): Promise<Solicitud[]> {
    const { data, error } = await supabase
      .from('solicitudes')
      .select(`
        *,
        mascotas(name, photo_url),
        adoptante:profiles!solicitudes_adoptante_id_fkey(username)
      `)
      .eq('refugio_id', refugioId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(this.map);
  }

  async create(data: {
    mascotaId:   string;
    adoptanteId: string;
    refugioId:   string;
    message?:    string;
  }): Promise<Solicitud> {
    const { data: result, error } = await supabase
      .from('solicitudes')
      .insert({
        mascota_id:   data.mascotaId,
        adoptante_id: data.adoptanteId,
        refugio_id:   data.refugioId,
        message:      data.message,
      })
      .select()
      .single();
    if (error) throw error;
    return this.map(result);
  }

  async updateStatus(id: string, status: SolicitudStatus): Promise<Solicitud> {
    const { data, error } = await supabase
      .from('solicitudes')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return this.map(data);
  }

  private map = (raw: any): Solicitud => ({
    id:                 raw.id,
    mascotaId:          raw.mascota_id,
    adoptanteId:        raw.adoptante_id,
    refugioId:          raw.refugio_id,
    status:             raw.status,
    message:            raw.message ?? undefined,
    createdAt:          new Date(raw.created_at),
    mascotaName:        raw.mascotas?.name ?? undefined,
    mascotaPhoto:       raw.mascotas?.photo_url ?? undefined,
    adoptanteUsername:  raw.adoptante?.username ?? undefined,
    refugioUsername:    raw.refugio?.username ?? undefined,
  });
}

================================================
📄 ARCHIVO: src\features\solicitudes\presentation\hooks\useSolicitudes.ts
================================================

import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { CreateSolicitudUseCase } from '@features/solicitudes/application/use-cases/CreateSolicitudUseCase';
import { GetSolicitudesAdoptanteUseCase, GetSolicitudesRefugioUseCase } from '@features/solicitudes/application/use-cases/GetSolicitudesUseCase';
import { UpdateSolicitudStatusUseCase } from '@features/solicitudes/application/use-cases/UpdateSolicitudStatusUseCase';
import { SolicitudStatus } from '@features/solicitudes/domain/entities/Solicitud';
import { SupabaseSolicitudRepository } from '@features/solicitudes/infrastructure/repositories/SupabaseSolicitudRepository';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const repo               = new SupabaseSolicitudRepository();
const createUseCase      = new CreateSolicitudUseCase(repo);
const getAdoptanteCase   = new GetSolicitudesAdoptanteUseCase(repo);
const getRefugioCase     = new GetSolicitudesRefugioUseCase(repo);
const updateStatusCase   = new UpdateSolicitudStatusUseCase(repo);

export function useSolicitudes() {
  const user        = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const isRefugio   = user?.role === 'refugio';

  const { data: solicitudes = [], isLoading } = useQuery({
    queryKey: ['solicitudes', user?.id],
    queryFn:  () => isRefugio
      ? getRefugioCase.execute(user!.id)
      : getAdoptanteCase.execute(user!.id),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data: { mascotaId: string; refugioId: string; message?: string }) =>
      createUseCase.execute({ ...data, adoptanteId: user!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solicitudes'] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SolicitudStatus }) =>
      updateStatusCase.execute(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solicitudes'] }),
  });

  return {
    solicitudes,
    isLoading,
    createSolicitud:  createMutation.mutate,
    isCreating:       createMutation.isPending,
    updateStatus:     updateStatusMutation.mutate,
    isUpdating:       updateStatusMutation.isPending,
  };
}

================================================
📄 ARCHIVO: src\shared\domain\errors\AppError.ts
================================================

export class AppError extends Error {
    constructor(
        public readonly code: string,
        message: string,
        public readonly cause?: unknown
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class AuthError extends AppError {
    constructor(message: string, cause?: unknown) {
        super('AUTH_ERROR', message, cause);
    }
}

export class ChatError extends AppError {
    constructor(message: string, cause?: unknown) {
        super('CHAT_ERROR', message, cause);
    }
}

================================================
📄 ARCHIVO: src\shared\infrastructure\notifications\NotificationService.ts
================================================

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Verificar si estamos en Expo Go
const isExpoGo = process.env.EXPO_OS !== undefined &&
  typeof (global as any).expo?.modules?.ExpoNotifications === 'undefined';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,  // ✅ reemplaza shouldShowAlert
    shouldShowList: true,    // ✅ nuevo campo requerido
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return false;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('chat-messages', {
        name: 'Mensajes de chat',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
      });
    }
    return true;
  } catch (e) {
    // En Expo Go Android simplemente no hay soporte — no crashear
    console.warn('Notificaciones no disponibles en Expo Go Android:', e);
    return false;
  }
}

export async function showMessageNotification(
  roomName: string,
  authorUsername: string,
  content: string,
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `💬 ${roomName}`,
        body: `${authorUsername}: ${content}`,
        sound: 'default',
        data: { roomName },
      },
      trigger: null, // null = inmediata (notificación local)
    });
  } catch (e) {
    // Silenciar error en Expo Go Android — no interrumpir el flujo del chat
    console.warn('No se pudo mostrar notificación:', e);
  }
}

================================================
📄 ARCHIVO: src\shared\infrastructure\supabase\client.ts
================================================

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Supbase espera métodos getItem/setItem/removeItem pero expo-secure-store 
// expone getItemAsync/setItemAsynbc/removeItemAsync - este adaptador los mejora
const SecureStoreAdapter = {
    getItem: (key: string) =>
        SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) =>
        SecureStore.setItemAsync(key, value),
    removeItem: (key: string) =>
        SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            storage: SecureStoreAdapter,
            autoRefreshToken: true,
            persistSession: true,
        },
    }
);

================================================
📄 ARCHIVO: src\shared\infrastructure\supabase\StorageService.ts
================================================

import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './client';
import { decode } from 'base64-arraybuffer';

export async function pickAndUploadPetImage(refugioId: string): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') throw new Error('Se necesita permiso para acceder a la galería');

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
    base64: true,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  let base64: string;

  if (asset.base64) {
    base64 = asset.base64;
  } else if (asset.uri) {
    base64 = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } else {
    throw new Error('No se pudo obtener la imagen');
  }

  const ext      = asset.uri?.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `${refugioId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('mascotas')
    .upload(fileName, decode(base64), {
      contentType: `image/${ext}`,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('mascotas').getPublicUrl(fileName);
  return data.publicUrl;
}

================================================
📄 ARCHIVO: tsconfig.json
================================================

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"],
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"]
    },
    "baseUrl": ".",
    "lib": ["ESNext"],
    "ignoreDeprecations": "6.0"
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts",
    "env.d.ts"
  ]
}
