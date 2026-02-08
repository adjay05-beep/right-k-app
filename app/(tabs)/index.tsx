import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import DashboardCard from '../../components/DashboardCard';

export default function HomeScreen() {
  const { t } = useTranslation();
  const currentDate = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Section with Gradient */}
      <LinearGradient
        colors={['#00264B', '#004E89']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-16 pb-12 px-6 rounded-b-[40px] shadow-lg"
      >
        <View className="flex-row justify-between items-start mb-6">
          <View>
            <Text className="text-blue-200 text-sm font-medium mb-1">{currentDate}</Text>
            <Text className="text-white text-3xl font-extrabold">Hello, Guest</Text>
          </View>
          <View className="bg-white/20 p-2 rounded-full">
            <MaterialIcons name="notifications-none" size={24} color="white" />
          </View>
        </View>

        {/* Summary / Status Card (Mock) */}
        <View className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md flex-row items-center">
          <View className="bg-blue-400/20 p-3 rounded-full mr-4">
            <MaterialIcons name="verified-user" size={24} color="#60A5FA" />
          </View>
          <View>
            <Text className="text-white font-bold text-lg">E-9 Visa Status</Text>
            <Text className="text-blue-100 text-xs">Valid until 2025.12.31</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 -mt-6">
        {/* Quick Actions Grid */}
        <Text className="text-gray-800 text-lg font-bold mb-4 ml-1">Tools</Text>
        <View className="flex-row flex-wrap justify-between">
          <DashboardCard
            title="Pension"
            subtitle="Est. Refund"
            iconName="volunteer-activism"
            href="/features/pension"
          />
          <DashboardCard
            title="Salary"
            subtitle="Net Pay Calc"
            iconName="attach-money"
            href="/features/salary"
          />
          <DashboardCard
            title="Tax Refund"
            subtitle="Year-end adj."
            iconName="receipt-long"
            href="/features/tax"
          />
          <DashboardCard
            title="Guide"
            subtitle="Living in KR"
            iconName="menu-book"
            href="/features/guide"
          />
        </View>

        {/* Recent Activity / News */}
        <Text className="text-gray-800 text-lg font-bold mb-4 mt-4 ml-1">Updates</Text>
        <View className="bg-white p-5 rounded-3xl shadow-sm mb-20">
          <View className="flex-row items-center mb-3">
            <View className="bg-red-100 px-2 py-1 rounded-md mr-2">
              <Text className="text-red-600 text-[10px] font-bold">HOT</Text>
            </View>
            <Text className="text-gray-900 font-bold flex-1" numberOfLines={1}>
              2024 Tax Law Changes
            </Text>
            <Text className="text-gray-400 text-xs">2d ago</Text>
          </View>
          <Text className="text-gray-500 text-sm leading-5">
            New income tax brackets have been applied for 2024. Check out how it affects your salary...
          </Text>
          <View className="flex-row justify-end mt-2">
            <Text className="text-blue-600 text-xs font-bold">Read More →</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}