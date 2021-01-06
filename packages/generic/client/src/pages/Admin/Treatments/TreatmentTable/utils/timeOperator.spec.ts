import { timeOperator } from './timeOperator';

describe('timeOperator', () => {
  describe('convertDurationToReadableDuration', () => {
    it('should return 0s for milliseconds < 1000', () => {
      expect(timeOperator.convertDurationToReadableDuration(900)).toBe('0s');
    });

    it('should return 14s for 14 seconds', () => {
      expect(timeOperator.convertDurationToReadableDuration(14000)).toBe('14s');
    });

    it(`should return 10m2s" for 602 seconds`, () => {
      expect(timeOperator.convertDurationToReadableDuration(602000)).toBe(`10m2s`);
    });

    it(`should return 2h6m40s" for 7600 seconds`, () => {
      expect(timeOperator.convertDurationToReadableDuration(7600000)).toBe(`2h6m40s`);
    });
  });
});
