import { type FC, type ReactNode, type Ref, type RefObject, useLayoutEffect, useRef, useState } from 'react';
import { type BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import type { IPropsWithChildrenFn } from '@/types';
import {
  type NativeMethods,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Extrapolation, interpolate, useAnimatedProps } from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import { useTheme } from '@ui-kitten/components';

interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IBackdropProps extends BottomSheetBackdropProps {
  activatorRef: RefObject<NativeMethods>;
  onClose: () => void;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const Backdrop: FC<IBackdropProps> = (props) => {
  const theme = useTheme();

  const windowDimensions = useWindowDimensions();
  const screenWidth = windowDimensions.width * windowDimensions.scale;
  const screenHeight = windowDimensions.height * windowDimensions.scale;

  const animatedProps = useAnimatedProps(() => ({
    opacity: interpolate(1 + props.animatedIndex.value, [0, 1], [0, 1], Extrapolation.CLAMP)
  }));

  const [rect, setRect] = useState<IRect | null>(null);

  useLayoutEffect(() => {
    props.activatorRef.current?.measureInWindow((x, y, width, height) => {
      setRect({
        x: x * windowDimensions.scale,
        y: y * windowDimensions.scale,
        width: width * windowDimensions.scale,
        height: height * windowDimensions.scale
      });
    });
  }, []);

  return rect && (
    <TouchableWithoutFeedback onPress={props.onClose}>
      <Svg style={props.style} viewBox={`0 0 ${screenWidth} ${screenHeight}`}>
        <AnimatedPath
          d={`M0 0 h${screenWidth} v${screenHeight} h-${screenWidth} Z M${rect.x} ${rect.y} h${rect.width} v${rect.height} h-${rect.width} Z`}
          fill="rgba(0, 0, 0, 0.3)"
          fillRule="evenodd"
          animatedProps={animatedProps}
        />

        <AnimatedRect
          animatedProps={animatedProps}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          stroke={theme['color-primary-500']}
          strokeWidth={(2 * windowDimensions.scale)}
          fill="transparent"
        />
      </Svg>
    </TouchableWithoutFeedback>
  )
}

export interface IBottomSheetActivatorProps {
  ref: Ref<NativeMethods>
  openModal: () => void;
}

export interface IBottomSheetContentProps {
  withClose: (action: () => void) => () => void;
}

export interface IBottomSheetModalProps extends IPropsWithChildrenFn<[props: IBottomSheetContentProps]> {
  activator: (props: IBottomSheetActivatorProps) => ReactNode
}

export function ActionsSheetModal(props: IBottomSheetModalProps): ReactNode {
  const [isOpened, setOpened] = useState(false);
  const modalRef = useRef<BottomSheetModal>(null);
  const activatorRef = useRef<NativeMethods>(null);
  const safeArea = useSafeAreaInsets()

  function open() {
    setOpened(true);
    modalRef.current?.present();
  }

  function withClose(action: () => void): () => void {
    return () => {
      modalRef.current?.dismiss();
      action();
    }
  }

  return (
    <>
      {props.activator({
        openModal: open,
        ref: activatorRef
      })}

      <BottomSheetModal
        ref={modalRef}
        detached
        enableDismissOnClose
        bottomInset={safeArea.bottom + 48}
        style={styles.container}
        backgroundStyle={styles.background}
        onDismiss={() => setOpened(false)}
        backdropComponent={(props) => (
          <Backdrop
            {...props}
            activatorRef={activatorRef}
            onClose={() => modalRef.current?.dismiss()}
          />
        )}
      >
          {isOpened && (
            <BottomSheetView>
              {props.children({ withClose })}
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
  } satisfies ViewStyle
})
