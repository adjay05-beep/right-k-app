import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { calculatePension } from '../../utils/calculators'; // 위에서 만든 로직 불러오기

export default function PensionScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [income, setIncome] = useState('');
  const [months, setMonths] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    if (!income || !months) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // E-9 비자 기준 예시 (실제로는 비자 선택 드롭다운 필요)
    const calculated = calculatePension('E-9', parseInt(income), parseInt(months));
    setResult(calculated);
  };

  return (
    <View className="flex-1 bg-white">
      {/* 헤더 */}
      <View className="bg-pension p-6 pt-12 rounded-b-3xl">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-blue-900 text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="text-blue-900 text-3xl font-bold">{t('pension.title')}</Text>
      </View>

      <ScrollView className="p-6">
        {/* 입력 폼 */}
        <Text className="text-gray-600 font-bold mb-2">{t('pension.input_income')}</Text>
        <TextInput 
          className="bg-gray-100 p-4 rounded-xl mb-6 text-lg"
          keyboardType="numeric"
          placeholder="2,500,000"
          value={income}
          onChangeText={setIncome}
        />

        <Text className="text-gray-600 font-bold mb-2">{t('pension.input_months')}</Text>
        <TextInput 
          className="bg-gray-100 p-4 rounded-xl mb-8 text-lg"
          keyboardType="numeric"
          placeholder="36"
          value={months}
          onChangeText={setMonths}
        />

        {/* 계산 버튼 */}
        <TouchableOpacity 
          className="bg-primary p-5 rounded-2xl items-center shadow-lg active:bg-blue-900"
          onPress={handleCalculate}
        >
          <Text className="text-white text-xl font-bold">Calculate Now</Text>
        </TouchableOpacity>

        {/* 결과 표시 */}
        {result !== null && (
          <View className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 items-center">
            <Text className="text-gray-500 text-sm mb-2">{t('pension.result')}</Text>
            <Text className="text-primary text-4xl font-extrabold">
              ₩ {result.toLocaleString()}
            </Text>
            <Text className="text-secondary text-xs mt-2 font-medium">
              * 예상 수령액입니다. (세전 기준)
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}