import type { ReactElement, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, List, ListItem, Text, type TextProps, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { FullScreenLayout } from '@/components/layout';
import { AppLocale } from '@/enums';
import { useLocaleChangeMutation, useLocaleQuery } from '@/locale';

interface ILanguage {
  title: string;
  locale: AppLocale;
}

const languages: ILanguage[] = [
  {
    locale: AppLocale.SYSTEM,
    title: 'Auto',
  },
  {
    locale: AppLocale.UA,
    title: 'Українська',
  },
  {
    locale: AppLocale.EN,
    title: 'English',
  },
];

function LayoutTitle(props: TextProps): ReactElement {
  const { t } = useTranslation();

  return (
    <Text {...props}>
      {t('settings.language.heading')}
    </Text>
  );
}

export default function Language(): ReactNode {
  const theme = useTheme();
  const localeQuery = useLocaleQuery();
  const changeMutation = useLocaleChangeMutation();

  return (
    <FullScreenLayout title={(txtProps) => <LayoutTitle {...txtProps} />}>
      <List
        data={languages}
        style={styles.menu}

        ItemSeparatorComponent={() => (
          <Divider style={styles.menuDivider} />
        )}

        renderItem={({ item }) => (
          <ListItem
            key={item.locale}
            title={item.title}

            style={[
              styles.menuItem,

              item.locale === localeQuery.data && {
                backgroundColor: theme['background-basic-color-3'],
              },
            ] satisfies StyleProp<ViewStyle>}

            onPress={() => changeMutation.mutate(item.locale)}
          />
        )}
      />
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  menu: {
    paddingHorizontal: 12,
  } satisfies ViewStyle,

  menuDivider: {
    marginHorizontal: 6,
  } satisfies ViewStyle,

  menuItem: {
    borderRadius: 6,
  } satisfies ViewStyle,
});
