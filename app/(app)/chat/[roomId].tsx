import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Message } from "@features/chat/domain/entities/Message";
import { useChat } from "@features/chat/presentation/hooks/useChat";
import { pickAndUploadImage } from "@shared/infrastructure/supabase/StorageService";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function ChatScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { messages, sendMessage, isLoading } = useChat(roomId);
  const user = useAuthStore((s) => s.user);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(
        () => listRef.current?.scrollToEnd({ animated: true }),
        100
      );
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    sendMessage({ content: input.trim() });
    setInput("");
  }, [input, sendMessage]);

  const handleImagePick = useCallback(async () => {
    try {
      setIsUploading(true);
      const imageUrl = await pickAndUploadImage("chat-images", roomId);
      if (imageUrl) sendMessage({ content: "", imageUrl });
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsUploading(false);
    }
  }, [sendMessage, roomId]);

  const renderMsg = useCallback(
    ({ item }: { item: Message }) => {
      const isOwn = item.userId === user?.id;
      return (
        <View style={[styles.row, isOwn && styles.rowOwn]}>
          {!isOwn && (
            <View
              style={[
                styles.avatar,
                item.authorRole === "seller"
                  ? styles.avatarRefugio
                  : styles.avatarAdoptante,
              ]}
            >
              <Text style={styles.avatarText}>
                {item.authorRole === "seller" ? "🏥" : "🏠"}
              </Text>
            </View>
          )}

          <View
            style={[
              styles.bubble,
              isOwn ? styles.ownBubble : styles.otherBubble,
            ]}
          >
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
              <Text
                style={[styles.msgText, isOwn && styles.msgTextOwn]}
              >
                {item.content}
              </Text>
            )}

            <Text style={[styles.time, isOwn && styles.timeOwn]}>
              {item.createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      );
    },
    [user?.id]
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
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
        <TouchableOpacity
          style={styles.attachBtn}
          onPress={handleImagePick}
          disabled={isUploading}
          activeOpacity={0.7}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#78716c" />
          ) : (
            <Text style={styles.attachIcon}>⊕</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#a8a29e"
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

const PRIMARY = "#f97316";
const DARK = "#1c1917";
const GRAY_MID = "#78716c";
const GRAY_LIGHT = "#a8a29e";
const GRAY_200 = "#e7e5e4";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafaf9" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafaf9",
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },

  row: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  rowOwn: { justifyContent: "flex-end" },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#f5f5f4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  avatarText: { fontSize: 13, fontWeight: "600" },
  avatarRefugio: { backgroundColor: "#fff7ed" },
  avatarAdoptante: { backgroundColor: "#f0fdf4" },

  bubble: {
    maxWidth: "75%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ownBubble: {
    backgroundColor: PRIMARY,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: GRAY_200,
  },

  author: {
    fontSize: 11,
    fontWeight: "600",
    color: GRAY_LIGHT,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  msgText: { fontSize: 15, color: DARK, lineHeight: 20 },
  msgTextOwn: { color: "#fff" },
  time: { fontSize: 10, color: GRAY_LIGHT, marginTop: 4, alignSelf: "flex-end" },
  timeOwn: { color: "rgba(255,255,255,0.7)" },
  msgImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 4,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: GRAY_200,
    gap: 8,
  },
  attachBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f4",
    justifyContent: "center",
    alignItems: "center",
  },
  attachIcon: { fontSize: 20, color: GRAY_MID },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: GRAY_200,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
    color: DARK,
    backgroundColor: "#fafaf9",
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnOff: { backgroundColor: "#e7e5e4" },
  sendIcon: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
