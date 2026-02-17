import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const width = (percentage: number): number => {
  if (percentage <= 0) return 0;
  if (percentage >= 100) return SCREEN_WIDTH;

  const value = (SCREEN_WIDTH * percentage) / 100;
  return PixelRatio.roundToNearestPixel(value);
};

export const height = (percentage: number): number => {
  if (percentage <= 0) return 0;
  if (percentage >= 100) return SCREEN_HEIGHT;

  const value = (SCREEN_HEIGHT * percentage) / 100;
  return PixelRatio.roundToNearestPixel(value);
};

export { SCREEN_WIDTH, SCREEN_HEIGHT };
