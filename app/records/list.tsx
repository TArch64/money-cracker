import { type ReactNode, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { MainScreenLayout } from '@/layout';
import { MonthIdx, MonthRecords, MonthSlider } from '@/recordsList';
import {
  Button,
  Icon,
  type IconElement,
  type IconProps,
  MenuItem,
  OverflowMenu,
  useTheme,
} from '@ui-kitten/components';
import { RecordType } from '@/db';
import { StyleSheet, type ViewStyle } from 'react-native';

const PlusIcon = (iconProps: IconProps): IconElement => (
  <Icon {...iconProps} name="plus" />
);

function IncomeIcon(iconProps: IconProps): IconElement {
  const theme = useTheme();
  return <Icon {...iconProps} fill={theme['color-success-600']} name="plus" />;
}

function ExpenseIcon(iconProps: IconProps): IconElement {
  const theme = useTheme();
  return <Icon {...iconProps} fill={theme['color-danger-600']} name="minus" />;
}

function ScreenRight(): ReactNode {
  const router = useRouter();
  const [isMenuOpened, setMenuOpened] = useState(false);

  function openLink(type: RecordType): void {
    router.push({
      pathname: '/records/new',
      params: { type },
    });
  }

  return (
    <OverflowMenu
      visible={isMenuOpened}
      onSelect={() => setMenuOpened(false)}
      onBackdropPress={() => setMenuOpened(false)}
      contentContainerStyle={styles.dropdownMenu}

      anchor={() => (
        <Button
          appearance="ghost"
          accessoryLeft={PlusIcon}
          onPress={() => setMenuOpened(true)}
        />
      )}
    >
      <MenuItem
        title="Add Income"
        accessoryLeft={IncomeIcon}
        onPress={() => openLink(RecordType.INCOME)}
      />

      <MenuItem
        title="Add Expense"
        accessoryLeft={ExpenseIcon}
        onPress={() => openLink(RecordType.EXPENSE)}
      />
    </OverflowMenu>
  );
}

export default function List(): ReactNode {
  const [selectedIdx, setSelectedIdx] = useState<MonthIdx>(() => MonthIdx.current());
  const title = useMemo(() => selectedIdx.title, [selectedIdx.id]);

  return (
    <MainScreenLayout
      name="records/list"
      title={title}
      headerRight={() => <ScreenRight />}
    >
      <MonthSlider
        active={selectedIdx}
        onChange={setSelectedIdx}
      >
        {(idx) => <MonthRecords idx={idx} />}
      </MonthSlider>
    </MainScreenLayout>
  )
}

const styles = StyleSheet.create({
  dropdownMenu: {
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  } satisfies ViewStyle,
});
