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