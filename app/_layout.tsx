import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated'; 
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { initDB } from './sql/AppDatabaseFactory';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    PoppinsBold: require('@/assets/fonts/Poppins-Bold.ttf'),
    PoppinsExtraBold: require('@/assets/fonts/Poppins-ExtraBold.ttf'),
    PoppinsMedium: require('@/assets/fonts/Poppins-Medium.ttf'),
    PoppinsRegular: require('@/assets/fonts/Poppins-Regular.ttf'),
    PoppinsSemiBold: require('@/assets/fonts/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    const prepare = async () => {
      try {
        await initDB();
        console.log('DB initialized');
      } catch (e) {
        console.error('DB init failed', e);
      }

      if (loaded) {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <StatusBar style="light" />
      <GestureHandlerRootView>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ title: 'Home' }}/>
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}