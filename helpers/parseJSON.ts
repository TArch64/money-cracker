export function parseJSON<V extends object>(raw: string): V | null {
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(error);
    return null;
  }
}
