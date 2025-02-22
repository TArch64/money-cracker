import { useEffect } from 'react';
import {
  AndroidImportance,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from 'expo-notifications';
import { isDevice } from 'expo-device';
import { Platform } from 'react-native';
import { type NotificationsInit, useNotifications } from './Provider';

export function useNotificationsSetup() {
  const notifications = useNotifications();

  useEffect(() => {
    if (notifications.isInitialized) {
      return;
    }

    if (!isDevice) {
      notifications.initialize();
      return;
    }

    (async () => {
      const init: NotificationsInit = {};

      if (Platform.OS === 'android') {
        const channel = await setNotificationChannelAsync('main', {
          name: 'Main',
          importance: AndroidImportance.DEFAULT,
        });

        if (channel) {
          init.androidChannelId = channel.id;
        }
      }

      let permissions = await getPermissionsAsync();

      if (!permissions.granted) {
        permissions = await requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowSound: false,
            allowCriticalAlerts: false,
            allowBadge: false,
            allowDisplayInCarPlay: false,
            allowProvisional: false,
            provideAppNotificationSettings: true,
          },
        });
      }

      init.isAllowed = permissions.granted;
      notifications.initialize(init);
    })();
  }, []);
}
