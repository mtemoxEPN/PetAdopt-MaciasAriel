import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return false;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('petadopt-notifications', {
        name: 'PetAdopt Notificaciones',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
      });

      await Notifications.setNotificationChannelAsync('chat-messages', {
        name: 'Mensajes de chat',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
      });
    }
    return true;
  } catch (e) {
    console.warn('Notificaciones no disponibles:', e);
    return false;
  }
}

export async function showMessageNotification(
  title: string,
  authorUsername: string,
  content: string,
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: `${authorUsername}: ${content}`,
        sound: 'default',
        data: { title },
      },
      trigger: null,
    });
  } catch (e) {
    console.warn('No se pudo mostrar notificación:', e);
  }
}

export async function showSolicitudNotification(
  title: string,
  body: string,
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        channelId: 'petadopt-notifications',
      },
      trigger: null,
    });
  } catch (e) {
    console.warn('No se pudo mostrar notificación de solicitud:', e);
  }
}