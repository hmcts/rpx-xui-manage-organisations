/**
 * Utility helpers for building stable, unique Angular `@for` / *ngFor trackBy keys.
 */
export function buildCompositeTrackKey(index: number, ...rawParts: Array<any | any[]>): string | number {
  // Manually flatten one level to avoid relying on Array.prototype.flat (ensures compatibility with older TS lib targets)
  const flattened: any[] = [];
  for (const part of rawParts) {
    if (Array.isArray(part)) {
      for (const inner of part) {
        flattened.push(inner);
      }
    } else {
      flattened.push(part);
    }
  }
  const parts = flattened
    .map((p) => (p === null || p === undefined ? '' : String(p).trim()))
    .filter((p) => p.length > 0);
  if (parts.length === 0) {
    return index; // everything blank -> use index directly
  }
  const base = parts.join('|');
  return `${base}#${index}`; // always append index for guaranteed uniqueness
}

/**
 * Convenience helper for common id-or-index patterns.
 * Tries each supplied property name on the item until one yields a non-empty value.
 */
export function buildIdOrIndexKey<T extends Record<string, any>>(index: number, item: T, ...idProps: string[]): string | number {
  if (!item) {
    return index;
  }
  for (const prop of idProps) {
    const val = item[prop];
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      return `${String(val)}#${index}`;
    }
  }
  return index; // nothing usable
}
