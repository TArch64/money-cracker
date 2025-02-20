import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { RecordType } from '@/enums';
import { type ElementStatus, Icon, IconName, useColorScheme } from '@/components/uiKitten';
import { getEnumValue } from '@/helpers/getEnumValue';
import { HomeCard } from './HomeCard';

interface IAddRecordCardProps {
  type: RecordType;
}

interface IRecordCardConfig {
  icon: IconName;
  iconColor: string;
  iconBackgroundColor?: string;
}

function AddRecordCard(props: IAddRecordCardProps): ReactNode {
  const { t } = useTranslation();
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const getIconBackgroundColor = (status: ElementStatus) => getEnumValue(colorScheme, {
    light: () => theme[`color-${status}-100`],
    dark: () => theme['background-basic-color-2'],
  });

  const config = getEnumValue<RecordType, IRecordCardConfig>(props.type, {
    [RecordType.INCOME]: () => ({
      icon: IconName.ARROW_UPWARD,
      iconColor: theme['color-success-600'],
      iconBackgroundColor: getIconBackgroundColor('success'),
    }),

    [RecordType.EXPENSE]: () => ({
      icon: IconName.ARROW_DOWNWARD,
      iconColor: theme['color-danger-600'],
      iconBackgroundColor: getIconBackgroundColor('danger'),
    }),
  });

  return (
    <HomeCard
      style={styles.card}

      href={() => ({
        pathname: '/records/new',
        params: { type: props.type },
      })}
    >
      <View style={styles.cardInner}>
        <View
          style={[
            styles.cardIconContainer,
            { backgroundColor: config.iconBackgroundColor },
          ] satisfies StyleProp<ViewStyle>}
        >
          <Icon
            name={config.icon}
            fill={config.iconColor}
            style={styles.cardIcon}
          />
        </View>

        <Text style={styles.cardTitle}>
          {t(`home.sections.addRecord.add.${props.type}`)}
        </Text>
      </View>
    </HomeCard>
  );
}

export function HomeAddRecord(): ReactNode {
  return (
    <View style={styles.row}>
      <AddRecordCard type={RecordType.INCOME} />
      <AddRecordCard type={RecordType.EXPENSE} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
  } satisfies ViewStyle,

  card: {
    flex: 1,
  } satisfies ViewStyle,

  cardInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,

  cardIconContainer: {
    borderRadius: '100%',
    marginBottom: 8,
    padding: 10,
  } satisfies ViewStyle,

  cardIcon: {
    width: 24,
    height: 24,
  } satisfies ViewStyle,

  cardTitle: {
    fontSize: 16,
    fontWeight: 500,
  } satisfies TextStyle,
});
