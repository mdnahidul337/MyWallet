import { darkColors, lightColors } from '@/constants/colors';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type Theme = 'light' | 'dark' | 'system';

interface ThemeSettings {
  theme: Theme;
}

const THEME_STORAGE_KEY = 'app_theme';

const defaultThemeSettings: ThemeSettings = {
  theme: 'light',
};

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const queryClient = useQueryClient();

  const themeQuery = useQuery({
    queryKey: ['theme'],
    queryFn: async () => {
      const data = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return data ? (JSON.parse(data) as ThemeSettings) : defaultThemeSettings;
    },
  });

  const themeMutation = useMutation({
    mutationFn: async (settings: ThemeSettings) => {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
      return settings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['theme'], data);
    },
  });

  const updateTheme = (theme: Theme) => {
    themeMutation.mutate({ theme });
  };

  const currentTheme = themeQuery.data?.theme || 'light';
  const isDark = currentTheme === 'dark' || (currentTheme === 'system' && false); // TODO: Add system theme detection
  const colors = isDark ? darkColors : lightColors;

  return {
    theme: currentTheme,
    colors,
    updateTheme,
    isLoading: themeQuery.isLoading,
  };
});