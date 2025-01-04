import { type ReactNode } from 'react';
import { Link } from 'expo-router';
import { Button, Text } from '@ui-kitten/components';
import { FullScreenLayout } from '@/components/layout';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { getRecordTypeTitle, RecordType } from '@/enums';

interface IntroLinkProps {
  type: RecordType;
}

function IntroLink(props: IntroLinkProps): ReactNode {
  return (
    <Link
      asChild
      href={{
        pathname: '/records/new',
        params: { type: props.type },
      }}
    >
      <Button appearance="ghost" size="small">
        {(textProps) => (
          <Text {...textProps} style={[textProps?.style, styles.rowText]}>
            {getRecordTypeTitle(props.type)}
          </Text>
        )}
      </Button>
    </Link>
  );
}

export default function Intro(): ReactNode {
  return (
    <FullScreenLayout>
      <View style={styles.column}>
        <Text category="h1" style={styles.heading}>
          Add your first
        </Text>

        <View style={styles.row}>
          <IntroLink type={RecordType.INCOME} />

          <Text category="p1" style={styles.rowText}>
            or
          </Text>

          <IntroLink type={RecordType.EXPENSE} />
        </View>
      </View>
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  } satisfies ViewStyle,

  heading: {
    fontSize: 24,
    marginBottom: 16,
  } satisfies TextStyle,

  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,

  rowText: {
    fontSize: 16,
  } satisfies TextStyle,
});
