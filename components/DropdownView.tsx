import { type ReactNode, type RefCallback, useState } from 'react';
import type { IPropsWithChildrenFn } from '@/types';
import { BackdropView } from '@/components/BackdropView';
import { type LayoutChangeEvent, type NativeMethods, StyleSheet, View, type ViewStyle } from 'react-native';
import { flip, offset, shift, useFloating } from '@floating-ui/react-native';

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
  const [floatingWidth, setFloatingWidth] = useState(0);

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',

    middleware: [
      flip({ elementContext: 'reference' }),
      shift({ elementContext: 'reference' }),
      offset({ mainAxis: 8 }),
    ],
  });

  const isRendered = !!floatingStyles.top || !!floatingStyles.left;

  return (
    <>
      {props.isOpened && <BackdropView onPress={props.onClose} />}

      {props.activator({
        collapsable: false,
        ref: refs.setReference,
        onLayout: (event) => setFloatingWidth(event.nativeEvent.layout.width),
      })}

      {props.isOpened && (
        <View
          ref={refs.setFloating}
          collapsable={false}
          style={[
            styles.dropdownMenu,
            {
              ...floatingStyles,
              width: floatingWidth,
              opacity: isRendered ? 1 : 0,
            },
          ]}
        >
          {props.children()}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  dropdownMenu: {
    zIndex: 1000,
    borderRadius: 4,
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  } satisfies ViewStyle,
});
