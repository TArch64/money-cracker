import { type ReactNode, type RefCallback, useState } from 'react';
import type { IPropsWithChildrenFn } from '@/types';
import { BackdropView } from '@/components/BackdropView';
import { type LayoutChangeEvent, type NativeMethods, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { flip, offset, shift, useFloating } from '@floating-ui/react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '@ui-kitten/components';

export interface IDropdownActivatorProps {
  ref: RefCallback<NativeMethods>;
  collapsable: boolean;
  onLayout: (event: LayoutChangeEvent) => void;
}

export interface IDropdownViewProps extends IPropsWithChildrenFn {
  isOpened: boolean;
  onOpen: () => void;
  onClose: () => void;
  activator: (activatorProps: IDropdownActivatorProps) => ReactNode;
}

export function DropdownView(props: IDropdownViewProps): ReactNode {
  const theme = useTheme();
  const [floatingWidth, setFloatingWidth] = useState(0);

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',

    middleware: [
      flip({ elementContext: 'reference' }),
      shift({ elementContext: 'reference' }),
      offset({ mainAxis: 8 }),
    ],
  });

  return (
    <>
      {props.isOpened && <BackdropView onPress={props.onClose} />}

      {props.activator({
        collapsable: false,
        ref: refs.setReference,
        onLayout: (event) => setFloatingWidth(event.nativeEvent.layout.width),
      })}

      {props.isOpened && (
        <Animated.View
          ref={refs.setFloating}
          collapsable={false}

          style={[
            styles.dropdownMenu,
            {
              ...floatingStyles,
              width: floatingWidth,
              boxShadow: theme['box-shadow'],
            },
          ] satisfies StyleProp<ViewStyle>}

          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
        >
          {props.children()}
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  dropdownMenu: {
    zIndex: 1000,
    borderRadius: 4,
    overflow: 'hidden',
  } satisfies ViewStyle,
});
