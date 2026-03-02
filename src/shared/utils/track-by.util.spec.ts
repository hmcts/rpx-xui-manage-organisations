import { buildCompositeTrackKey, buildIdOrIndexKey } from './track-by.util';

/**
 * Unit tests for track-by utility helpers.
 */

describe('track-by.util', () => {
  describe('buildCompositeTrackKey', () => {
    it('should return index when all parts are blank/undefined/null', () => {
      expect(buildCompositeTrackKey(3, undefined, null, '', '   ')).toBe(3);
    });

    it('should trim and filter empty parts then join with | and append #index', () => {
      const key = buildCompositeTrackKey(2, '  A  ', '', 'B');
      expect(key).toBe('A|B#2');
    });

    it('should flatten one-level arrays of parts', () => {
      const key = buildCompositeTrackKey(1, ['X', 'Y'], 'Z');
      // Order preserved; both array entries included
      expect(key).toBe('X|Y|Z#1');
    });

    it('should append index even if single part present to guarantee uniqueness', () => {
      const k1 = buildCompositeTrackKey(0, 'ID123');
      const k2 = buildCompositeTrackKey(1, 'ID123');
      expect(k1).toBe('ID123#0');
      expect(k2).toBe('ID123#1');
      expect(k1).not.toBe(k2);
    });

    it('should treat numeric 0 as a valid part (not blank)', () => {
      const key = buildCompositeTrackKey(4, 0, 'code');
      expect(key).toBe('0|code#4');
    });
  });

  describe('buildIdOrIndexKey', () => {
    it('should return index when item is null/undefined', () => {
      expect(buildIdOrIndexKey(7, null as any, 'id')).toBe(7);
    });

    it('should return first non-empty property value with #index suffix', () => {
      const item: any = { id: 'abc', alt: 'def' };
      expect(buildIdOrIndexKey(5, item, 'id', 'alt')).toBe('abc#5');
    });

    it('should skip blank / whitespace-only properties', () => {
      const item: any = { id: '   ', alt: 'real' };
      expect(buildIdOrIndexKey(9, item, 'id', 'alt')).toBe('real#9');
    });

    it('should fall back to index if no provided properties have values', () => {
      const item: any = { id: '', alt: '   ' };
      expect(buildIdOrIndexKey(11, item, 'id', 'alt')).toBe(11);
    });

    it('should treat numeric 0 as valid id', () => {
      const item: any = { order: 0 };
      expect(buildIdOrIndexKey(3, item, 'order')).toBe('0#3');
    });
  });
});
