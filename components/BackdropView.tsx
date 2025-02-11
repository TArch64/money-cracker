import { type ReactNode, useState } from 'react';
import { TouchableWithoutFeedback, useWindowDimensions, View, type ViewStyle } from 'react-native';

export interface IBackdropViewProps {
  onPress: () => void;
}

export function BackdropView(props: IBackdropViewProps): ReactNode {
  const screen = useWindowDimensions();
  const [style, setStyle] = useState<ViewStyle>({});

  function onMeasure(x: number, y: number): void {
    setStyle({
      top: -y,
      left: -x,
      width: screen.width,
      height: screen.height,
    });
  }

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View
        ref={(view) => view?.measureInWindow(onMeasure)}
        style={[style, { position: 'absolute' }]}
      />
    </TouchableWithoutFeedback>
  );
}
