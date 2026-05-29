import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 1. Detección segura de Expo Go
const isExpoGo = process.env.EXPO_OS === 'android' && !Platform.isTV; 
// Nota: Una validación simple para evitar crasheos en el emulador local.

// 2. Solo configurar el handler si NO estamos en Expo Go (o si estamos construyendo el APK)
if (!isExpoGo) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (isExpoGo) return false; // Bloquea ejecución en Expo Go

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
    console.warn('Notificaciones no disponibles en este entorno:', e);
    return false;
  }
}

export async function showMessageNotification(
  roomName: string,
  authorUsername: string,
  content: string,
): Promise<void> {
  if (isExpoGo) return; // Evita el crash al enviar notificación en local
  
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `💬 ${roomName}`,
        body: `${authorUsername}: ${content}`,
        sound: 'default',
        data: { roomName },
      },
      trigger: null,
    });
  } catch (e) {
    console.warn('No se pudo mostrar notificación:', e);
  }
}