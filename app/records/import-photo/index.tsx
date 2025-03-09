import { type ReactNode, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { readAsStringAsync } from 'expo-file-system';
import { useImportOptimization, useImportParser } from '@/hooks/importPhoto';

export default function ImportPhoto(): ReactNode {
  const searchParams = useLocalSearchParams<{ images: string }>();
  const optimization = useImportOptimization();
  const parser = useImportParser();

  useEffect(() => {
    searchParams.images.split(',').forEach(async (uri) => {
      try {
        let source: string | null = await readAsStringAsync(uri, { encoding: 'base64' });
        source = await optimization.optimize(source);
        const data = await parser.parse(source);
        source = null;
      } catch (e) {
        console.error(e);
      }
    });
  }, []);

  return null;
}
