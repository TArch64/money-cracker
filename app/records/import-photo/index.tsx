import { type ReactNode, useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { readAsStringAsync } from 'expo-file-system';
import { Image, Modal, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useImportOptimization } from '@/hooks/importPhoto';

function ImageRow(props: { original: string; optimized: string | undefined }): ReactNode {
  const [zoomed, setZoomed] = useState('');
  const window = useWindowDimensions();
  const size = (window.width - 8) / 2;

  return (
    <>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
        <View style={{ minWidth: 0, flexBasis: 0, flexGrow: 1 }}>
          <Pressable onPress={() => setZoomed(props.original)}>
            <Image
              src={props.original}
              style={{ width: size, height: size, objectFit: 'contain' }}
            />
          </Pressable>
        </View>

        <View style={{ minWidth: 0, flexBasis: 0, flexGrow: 1 }}>
          {props.optimized && (
            <Pressable onPress={() => setZoomed(`data:image/jpeg;base64,${props.optimized}`)}>
              <Image
                src={`data:image/jpeg;base64,${props.optimized}`}
                style={{ width: size, height: size, objectFit: 'contain' }}
              />
            </Pressable>
          )}
        </View>
      </View>

      <Modal visible={!!zoomed}>
        <Pressable onPress={() => setZoomed('')}>
          <Image
            src={zoomed}
            style={{ width: window.width, height: window.height, objectFit: 'contain' }}
          />
        </Pressable>
      </Modal>
    </>
  );
}

export default function ImportPhoto(): ReactNode {
  const searchParams = useLocalSearchParams<{ images: string }>();

  const optimization = useImportOptimization();
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const uris = searchParams.images.split(',');

        const images = await Promise.all(uris.map(async (uri) => {
          const base64 = await readAsStringAsync(uri, { encoding: 'base64' });
          return optimization.optimize(base64);
        }));

        setImages(images);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 8 }}>
        {searchParams.images.split(',').map((original, index) => (
          <ImageRow
            key={index}
            original={original}
            optimized={images[index]}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
