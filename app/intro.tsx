import { type ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { Button, Text } from '@ui-kitten/components';
import { FullScreenLayout } from '@/components/layout';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { getRecordTypeTitle, RecordType } from '@/enums';
import { textRenderer } from '@/components/uiKitten';

interface IntroLinkProps {
  type: RecordType;
}

function IntroLink(props: IntroLinkProps): ReactNode {
  const router = useRouter();

  function open() {
    router.push({
      pathname: '/records/new',

      params: {
        type: props.type,
        intro: 'yes',
      },
    });
  }

  const text = getRecordTypeTitle(props.type);

  return (
    <Button appearance="ghost" size="small" onPress={open}>
      {textRenderer(text, { style: styles.rowText })}
    </Button>
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
