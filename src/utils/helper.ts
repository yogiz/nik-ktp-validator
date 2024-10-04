export function binarySearch(a: string[], x: string): boolean {
  let low = 0;
  let high = a.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (a[mid] === x) return true;
    if (a[mid] < x) low = mid + 1;
    else high = mid - 1;
  }

  return false;
}
