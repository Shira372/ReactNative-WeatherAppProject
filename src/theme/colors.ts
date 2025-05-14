// theme/colors.ts
import { DefaultTheme } from 'react-native-paper';

export const colors = {
  primary: '#1976D2',
  secondary: '#03A9F4',
  background: '#F5F5F5',
  lightBackground: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#757575',
  border: '#BDBDBD',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#FFA000',
  white: '#FFFFFF',
  black: '#000000',
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.lightBackground,
    text: colors.textPrimary,
    error: colors.error,
  },
};