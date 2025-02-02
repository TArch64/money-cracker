import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { getRecordTypeTitle, getRecordTypeValue, RecordType } from '@/enums';
import { Text, useTheme } from '@ui-kitten/components';
import { Icon, IconName } from '@/components/uiKitten';
import { HomeCard } from './HomeCard';

interface IAddRecordCardProps {
  type: RecordType;
}

interface IRecordCardConfig {
  icon: IconName;
  status: 'success' | 'danger';
}

function AddRecordCard(props: IAddRecordCardProps): ReactNode {
  const theme = useTheme();
  const title = getRecordTypeTitle(props.type);

  const config = getRecordTypeValue<IRecordCardConfig>(props.type, {
    [RecordType.INCOME]: () => ({
      icon: IconName.ARROW_UPWARD,
      status: 'success',
    }),

    [RecordType.EXPENSE]: () => ({
      icon: IconName.ARROW_DOWNWARD,
      status: 'danger',
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
            { backgroundColor: theme[`color-${config.status}-100`] },
          ] satisfies StyleProp<ViewStyle>}
        >
          <Icon
            name={config.icon}
            fill={theme[`color-${config.status}-500`]}
            style={styles.cardIcon}
          />
        </View>

        <Text style={styles.cardTitle}>
          Add {title}
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
    gap: 12,
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
    padding: 8,
  } satisfies ViewStyle,

  cardIcon: {
    width: 28,
    height: 28,
  } satisfies ViewStyle,

  cardTitle: {
    fontSize: 16,
    fontWeight: 500,
  } satisfies TextStyle,
});
