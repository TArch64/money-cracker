export function waitStackAnimation(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 500));
}
