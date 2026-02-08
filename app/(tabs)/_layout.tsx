import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00264B', // 선택되면 네이비
        tabBarInactiveTintColor: '#999',  // 안 선택되면 회색
        tabBarStyle: { paddingBottom: 5, height: 60 },
      }}
    >
      {/* 1. 홈 탭 */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>, // 아이콘 대체
          tabBarLabel: '홈',
        }}
      />

      {/* 2. 내 정보 탭 (추후 개발용 자리) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
          tabBarLabel: '내 정보',
        }}
      />
    </Tabs>
  );
}