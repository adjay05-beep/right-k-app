import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next'; // Anti-Gravity 다국어 훅
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const features = [
    { id: 'pension', title: t('home.menu1'), icon: '💰', path: '/features/pension', color: 'bg-pension', text: 'text-blue-900' },
    { id: 'mail', title: t('home.menu2'), icon: '📩', path: '/features/mail', color: 'bg-mail', text: 'text-green-900' },
    { id: 'center', title: t('home.menu3'), icon: '🏢', path: '/features/center', color: 'bg-center', text: 'text-orange-900' },
    { id: 'visa', title: t('home.menu4'), icon: '🏆', path: '/features/visa', color: 'bg-visa', text: 'text-purple-900' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      
      {/* 1. 상단 헤더 (Navy) */}
      <View className="bg-primary px-6 py-8 rounded-b-3xl shadow-md">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-3xl font-extrabold tracking-wider">Right K</Text>
            <Text className="text-secondary text-sm mt-1 font-medium">
              {t('slogan')}
            </Text>
          </View>
          {/* 로고 이미지 자리 (아이콘) */}
          <View className="w-12 h-12 bg-white/20 rounded-full justify-center items-center">
             <Text className="text-2xl">🛡️</Text>
          </View>
        </View>
      </View>

      {/* 2. 메인 컨텐츠 */}
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        
        {/* 섹션 타이틀 */}
        <Text className="text-primary text-lg font-bold mb-4">
          {t('home.services_title')}
        </Text>
        
        {/* 4대 기능 그리드 */}
        <View className="flex-row flex-wrap justify-between">
          {features.map((item) => (
            <TouchableOpacity 
              key={item.id}
              className={`w-[48%] aspect-square rounded-3xl justify-center items-center mb-4 ${item.color} shadow-sm active:opacity-70`}
              onPress={() => router.push(item.path as any)}
            >
              <Text className="text-4xl mb-3 shadow-sm">{item.icon}</Text>
              <Text className={`font-bold text-center text-base ${item.text}`}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. SOS 긴급 버튼 */}
        <TouchableOpacity 
          className="w-full bg-red-50 p-5 rounded-2xl flex-row items-center justify-center mt-4 border border-red-100 active:bg-red-100"
          onPress={() => router.push('/features/sos')}
        >
          <View className="bg-red-500 w-10 h-10 rounded-full justify-center items-center mr-3 shadow-sm">
            <Text className="text-white text-lg font-bold">!</Text>
          </View>
          <View>
            <Text className="text-red-600 font-bold text-lg">{t('home.sos')}</Text>
            <Text className="text-red-400 text-xs">Emergency Call (112, 119)</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}