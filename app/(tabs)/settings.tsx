import { FullScreenLayout } from '@/components/layout';
import type { ReactNode } from 'react';

export default function Settings(): ReactNode {
  return (
    <FullScreenLayout canGoBack={false} title="Settings" />
  );
}
