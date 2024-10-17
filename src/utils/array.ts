export function getNextIndex<T>(array: T[], currentIndex: number): number {
  if (array.length === 0) return -1;

  return (currentIndex + 1) % array.length;
}

export function getPrevIndex<T>(array: T[], currentIndex: number): number {
  if (array.length === 0) return -1;

  return (currentIndex - 1 + array.length) % array.length;
}
