import { type FC, type ReactNode, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetView, type BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import type { IPropsWithChildrenFn } from '@/types';
import { StyleSheet, type ViewStyle, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';

const Backdrop: FC<BottomSheetBackdropProps & { onClose: () => void }> = (props) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(1 + props.animatedIndex.value, [0, 1], [0, 1], Extrapolation.CLAMP)
  }));

  return (
    <TouchableWithoutFeedback onPress={props.onClose}>
      <Animated.View
        style={[
          props.style,
          styles.backdrop,
          animatedStyle
        ]}
      />
    </TouchableWithoutFeedback>
  )
}

export interface IBottomSheetActivatorProps {
  openModal: () => void
}

export interface IBottomSheetModalProps extends IPropsWithChildrenFn {
  activator: (props: IBottomSheetActivatorProps) => ReactNode
}

export function ActionsSheetModal(props: IBottomSheetModalProps): ReactNode {
  const [isOpened, setOpened] = useState(false);
  const modalRef = useRef<BottomSheetModal>(null);
  const safeArea = useSafeAreaInsets()

  function open() {
    setOpened(true);
    modalRef.current?.present();
  }

  return (
    <>
      {props.activator({ openModal: open })}

      <BottomSheetModal
        ref={modalRef}
        detached
        enableDismissOnClose
        bottomInset={safeArea.bottom + 48}
        style={styles.container}
        backgroundStyle={styles.background}
        onDismiss={() => setOpened(false)}
        backdropComponent={(props) => (
          <Backdrop {...props} onClose={() => modalRef.current?.dismiss()} />
        )}
      >
          {isOpened && (
            <BottomSheetView>
              {props.children()}
            </BottomSheetView>
          )}
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 16,
    paddingHorizontal: 8
  } satisfies ViewStyle,

  background: {
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
  } satisfies ViewStyle,

  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  } satisfies ViewStyle
})
