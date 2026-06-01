import { colors, spacing, typography, shadows, radius } from "@shared/presentation/styles/theme";
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
import { Building2, Home, Plus, ArrowUp } from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function ChatScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { messages, sendMessage, isLoading } = useChat(roomId);
  const user = useAuthStore((s) => s.user);
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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
        <Animated.View entering={FadeInUp.duration(300)} style={[styles.row, isOwn && styles.rowOwn]}>
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
                {item.authorRole === "seller" ? <Building2 size={16} color={colors.primary} /> : <Home size={16} color={colors.secondary} />}
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
        </Animated.View>
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
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
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
            <Plus size={20} color={colors.textSecondary} />
          )}
        </TouchableOpacity>

        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#a8a29e"
          multiline
          maxLength={500}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnOff]}
          onPress={handleSend}
          disabled={!input.trim()}
          activeOpacity={0.85}
        >
          <ArrowUp size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  messagesList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },

  row: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm },
  rowOwn: { justifyContent: "flex-end" },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.secondaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: { fontSize: 13, fontWeight: typography.weight.semibold },
  avatarRefugio: { backgroundColor: colors.primaryLight },
  avatarAdoptante: { backgroundColor: colors.surfacePearl },

  bubble: {
    maxWidth: "75%",
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  ownBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    ...shadows.primarySm,
  },
  otherBubble: {
    backgroundColor: colors.background,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },

  author: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.semibold,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
    letterSpacing: 0.3,
  },
  msgText: { fontSize: typography.size.body, color: colors.textPrimary, lineHeight: 20 },
  msgTextOwn: { color: colors.white },
  time: { fontSize: 10, color: colors.textTertiary, marginTop: spacing.xs, alignSelf: "flex-end" },
  timeOwn: { color: "rgba(255,255,255,0.7)" },
  msgImage: {
    width: 200,
    height: 150,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 100,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.sm,
    // paddingTop: 10
  },
  attachBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  attachIcon: { fontSize: 20, color: colors.textSecondary },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    fontSize: typography.size.body,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.primary,
  },
  sendBtnOff: { backgroundColor: colors.gray300 },
  sendIcon: { color: colors.white, fontSize: 18, fontWeight: typography.weight.semibold },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: "rgba(255,240,237,0.50)",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
});
