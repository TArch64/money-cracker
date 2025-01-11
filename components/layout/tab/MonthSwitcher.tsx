import { forwardRef, type ReactNode, useImperativeHandle, useRef, useState } from 'react';
import { type BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { IconName, iconRenderer } from '@/components/uiKitten/Icon';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { StyleSheet, TouchableWithoutFeedback, useWindowDimensions, type ViewStyle } from 'react-native';

interface IModalBackdropProps extends BottomSheetBackdropProps {
  onClose: () => void;
}

function ModalBackdrop(props: IModalBackdropProps): ReactNode {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(1 + props.animatedIndex.value, [0, 1], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <TouchableWithoutFeedback onPress={props.onClose}>
      <Animated.View
        style={[
          props.style,
          animatedStyle,
          { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
        ]}
      />
    </TouchableWithoutFeedback>
  );
}

function MonthList(): ReactNode {
  return (
    <></>
  );
}

export interface IMonthSwitcherRef {
  open: () => void;
}

export const MonthSwitcher = forwardRef<IMonthSwitcherRef>((_, ref) => {
  const [isOpened, setOpened] = useState(false);
  const modalRef = useRef<BottomSheetModal>(null);
  const screen = useWindowDimensions();

  function close() {
    setOpened(false);
    modalRef.current?.dismiss();
  }

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpened(true);
      modalRef.current?.present();
    },
  }));

  return (
    <BottomSheetModal
      ref={modalRef}
      enableDismissOnClose
      enablePanDownToClose
      backdropComponent={(props) => <ModalBackdrop {...props} onClose={close} />}
      handleComponent={null}
      onDismiss={() => setOpened(false)}
    >
      {isOpened && (
        <BottomSheetView style={{ height: screen.height - 100 }}>
          <TopNavigation
            title="Select Month"
            alignment="center"
            style={styles.topBar}

            accessoryLeft={() => (
              <TopNavigationAction
                icon={iconRenderer(IconName.ARROW_BACK)}
                onPress={() => modalRef.current?.dismiss()}
              />
            )}
          />

          <MonthList />
        </BottomSheetView>
      )}
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  topBar: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  } satisfies ViewStyle,
});
