import { useAiChat } from "@features/ai/presentation/hooks/useAiChat";
import { AiMessage } from "@features/ai/domain/entities/AiMessage";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  colors,
  spacing,
  typography,
  shadows,
  radius,
} from "@shared/presentation/styles/theme";

const SUGGESTIONS = [
  "¿Qué debo darle de comer a un cachorro?",
  "¿Con qué frecuencia debo vacunar a mi gato?",
  "¿Cómo adapto una mascota adoptada a mi hogar?",
  "¿Cuáles son señales de que mi perro está enfermo?",
];

export default function AiChatScreen() {
  const { messages, sendMessage, isLoading, error, clearChat } = useAiChat();
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(
        () => listRef.current?.scrollToEnd({ animated: true }),
        100
      );
      return () => clearTimeout(timer);
    }
  }, [messages.length, isLoading]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  }, [input, isLoading, sendMessage]);

  const renderMessage = useCallback(
    ({ item }: { item: AiMessage }) => {
      const isUser = item.role === "user";
      return (
        <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
          {!isUser && (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>🤖</Text>
            </View>
          )}
          <View
            style={[
              styles.bubble,
              isUser ? styles.bubbleUser : styles.bubbleModel,
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                isUser && styles.bubbleTextUser,
              ]}
            >
              {item.content}
            </Text>
            <Text style={[styles.time, isUser && styles.timeUser]}>
              {item.createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      );
    },
    []
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.headerBanner}>
        <Text style={styles.headerBannerIcon}>🐾</Text>
        <View style={styles.headerBannerInfo}>
          <Text style={styles.headerBannerTitle}>Asistente PetAdopt</Text>
          <Text style={styles.headerBannerSub}>
            Especialista en salud y cuidado animal
          </Text>
        </View>
        {messages.length > 0 && (
          <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Messages or Suggestions */}
      {messages.length === 0 ? (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>
            ¿En qué puedo ayudarte hoy?
          </Text>
          <Text style={styles.suggestionsSubtitle}>
            Pregúntame sobre salud, cuidados, alimentación o el proceso de
            adopción.
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
            <ActivityIndicator size="small" color={colors.primary} />
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
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!input.trim() || isLoading) && styles.sendBtnOff,
          ]}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  headerBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    ...shadows.sm,
  },
  headerBannerIcon: { fontSize: 36 },
  headerBannerInfo: { flex: 1 },
  headerBannerTitle: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  headerBannerSub: {
    fontSize: typography.size.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  clearBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.warningLight,
    borderRadius: radius.full,
  },
  clearBtnText: {
    fontSize: typography.size.caption,
    color: "#92400e",
    fontWeight: typography.weight.semibold,
  },

  suggestionsContainer: {
    flex: 1,
    padding: spacing["2xl"],
    gap: spacing.md,
  },
  suggestionsTitle: {
    fontSize: typography.size.h2,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  suggestionsSubtitle: {
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  suggestionsList: { gap: spacing.sm },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  suggestionText: {
    flex: 1,
    fontSize: typography.size.bodySmall,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  suggestionArrow: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: spacing.sm,
  },

  messagesList: { padding: spacing.lg, gap: spacing.md },

  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm },
  msgRowUser: { justifyContent: "flex-end" },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  avatarText: { fontSize: 16 },

  bubble: {
    maxWidth: "78%",
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleModel: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleText: {
    fontSize: typography.size.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  bubbleTextUser: { color: colors.white },
  time: {
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    alignSelf: "flex-end",
  },
  timeUser: { color: "rgba(255,255,255,0.7)" },

  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typingText: { fontSize: 13, color: colors.textTertiary },

  errorBox: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.errorLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: { color: colors.error, fontSize: typography.size.caption },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    fontSize: typography.size.body,
    color: colors.textPrimary,
    backgroundColor: colors.gray100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.sm,
  },
  sendBtnOff: { backgroundColor: colors.gray300 },
  sendIcon: { color: colors.white, fontSize: 20, fontWeight: "700" },
});
