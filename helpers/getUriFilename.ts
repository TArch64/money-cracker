export function getUriFilename(uri: string): string {
  return uri.split('/').at(-1)!;
}
