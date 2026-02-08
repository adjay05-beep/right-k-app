import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import '../global.css';
import '../i18n';

// 스플래시 화면 유지 (폰트 로딩 등 준비)
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 폰트 로딩 (필요시 추가)
  const [fontsLoaded] = useFonts({
    // 'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'), 
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. 스플래시 & 언어 선택 */}
      <Stack.Screen name="index" />

      {/* 2. 로그인/회원가입 그룹 */}
      <Stack.Screen name="(auth)" />

      {/* 3. 메인 탭 화면 (로그인 후 진입) */}
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />

      {/* 4. 기능 상세 페이지들 (뒤로가기 버튼 표시) */}
      <Stack.Screen
        name="features/pension"
        options={{
          headerShown: true,
          title: '국민연금 계산',
          headerBackTitle: 'Back',
          headerTintColor: '#00264B'
        }}
      />
      {/* 나머지 기능들도 여기에 자동 등록됨 */}
    </Stack>
  );
}