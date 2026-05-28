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