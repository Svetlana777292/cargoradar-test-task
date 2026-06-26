import { PixelRatio } from 'react-native';

export const normalize = (size) => {
  const scale = PixelRatio.getFontScale(); // учитывает масштаб
  return size / scale; // возвращаем "немасштабированный" размер
};