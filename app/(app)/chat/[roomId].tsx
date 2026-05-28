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