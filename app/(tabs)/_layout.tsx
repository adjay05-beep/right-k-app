import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

export default function TabLayout() {
  const { t } = useTranslation();
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
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
          tabBarLabel: t('tabs.home'),
        }}
      />

      {/* 2. 커뮤니티 탭 */}
      <Tabs.Screen
        name="community"
        options={{
          title: t('tabs.community'),
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💬</Text>,
          tabBarLabel: t('tabs.community'),
        }}
      />

      {/* 3. 내 정보 탭 */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.my'),
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
          tabBarLabel: t('tabs.my'),
        }}
      />
    </Tabs>
  );
}