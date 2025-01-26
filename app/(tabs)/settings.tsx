import { FullScreenLayout } from '@/components/layout';
import type { ReactNode } from 'react';
import { Menu, MenuItem, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { IconName, iconRenderer } from '@/components/uiKitten';
import { useRouter } from 'expo-router';

export default function Settings(): ReactNode {
  const theme = useTheme();
  const router = useRouter();

  return (
    <FullScreenLayout canGoBack={false} title="Settings">
      <Menu
        style={{
          backgroundColor: theme['background-basic-color-1'],
        } satisfies StyleProp<ViewStyle>}
      >
        <MenuItem
          title="Categories"
          style={styles.menuItem}
          accessoryLeft={iconRenderer(IconName.FOLDER_OUTLINE)}
          onPress={() => router.push('/settings/categories')}
        />
      </Menu>
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    marginHorizontal: 12,
    borderRadius: 4,
  } satisfies ViewStyle,
});
