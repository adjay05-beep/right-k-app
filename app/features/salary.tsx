import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { calculateNetPay } from '../../utils/calculators';

export default function SalaryScreen() {
    const router = useRouter();

    const [grossIncome, setGrossIncome] = useState('');
    const [nonTaxable, setNonTaxable] = useState('200000'); // Default 200k (Meal)
    const [dependents, setDependents] = useState('1'); // Default 1 (Self)

    const [result, setResult] = useState<ReturnType<typeof calculateNetPay> | null>(null);

    const handleCalculate = () => {
        if (!grossIncome) {
            Alert.alert("Error", "Please enter your monthly salary.");
            return;
        }

        const incomeVal = parseInt(grossIncome.replace(/,/g, ''));
        const nonTaxableVal = parseInt(nonTaxable.replace(/,/g, '')) || 0;
        const dependentsVal = parseInt(dependents) || 1;

        const calcResult = calculateNetPay(incomeVal, nonTaxableVal, dependentsVal);
        setResult(calcResult);
    };

    const formatCurrency = (val: number) => val.toLocaleString();

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header - Green Theme */}
            <View className="bg-emerald-600 p-6 pt-12 rounded-b-3xl shadow-lg">
                <TouchableOpacity onPress={() => router.back()} className="mb-4 flex-row items-center">
                    <MaterialIcons name="arrow-back-ios" size={18} color="white" />
                    <Text className="text-white text-lg ml-1">Back</Text>
                </TouchableOpacity>
                <Text className="text-white text-3xl font-bold">Salary Calculator</Text>
                <Text className="text-emerald-100 mt-1">Estimate your actual take-home pay</Text>
            </View>

            <ScrollView className="flex-1 p-6">
                {/* Input Section */}
                <View className="bg-white p-5 rounded-2xl shadow-sm mb-6">
                    <Text className="text-gray-500 font-bold mb-2">Monthly Gross Income (₩)</Text>
                    <TextInput
                        className="bg-gray-100 p-4 rounded-xl mb-4 text-xl font-bold text-gray-900"
                        keyboardType="numeric"
                        placeholder="3,000,000"
                        value={grossIncome}
                        onChangeText={setGrossIncome}
                    />

                    <View className="flex-row justify-between mb-2">
                        <View className="w-[48%]">
                            <Text className="text-gray-500 font-bold mb-2 text-xs">Non-taxable (Meal etc.)</Text>
                            <TextInput
                                className="bg-gray-100 p-3 rounded-xl text-gray-900"
                                keyboardType="numeric"
                                value={nonTaxable}
                                onChangeText={setNonTaxable}
                            />
                        </View>
                        <View className="w-[48%]">
                            <Text className="text-gray-500 font-bold mb-2 text-xs">Dependents</Text>
                            <TextInput
                                className="bg-gray-100 p-3 rounded-xl text-gray-900"
                                keyboardType="numeric"
                                value={dependents}
                                onChangeText={setDependents}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-emerald-600 p-4 rounded-xl items-center mt-2 active:bg-emerald-700"
                        onPress={handleCalculate}
                    >
                        <Text className="text-white text-lg font-bold">Calculate Net Pay</Text>
                    </TouchableOpacity>
                </View>

                {/* Result Section */}
                {result && (
                    <View className="mb-20">
                        {/* Main Result Card */}
                        <View className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 mb-4 items-center">
                            <Text className="text-gray-500 text-sm font-medium mb-1">Estimated Net Pay</Text>
                            <Text className="text-emerald-600 text-4xl font-extrabold mb-1">
                                ₩ {formatCurrency(result.netPay)}
                            </Text>
                            <Text className="text-gray-400 text-xs">
                                Total Deductions: -₩ {formatCurrency(result.totalDeduction)}
                            </Text>
                        </View>

                        {/* Breakdown */}
                        <View className="bg-white p-5 rounded-3xl shadow-sm">
                            <Text className="text-gray-800 font-bold text-lg mb-4 ml-1">Deduction Details</Text>

                            <DetailRow label="National Pension (4.5%)" value={result.details.pension} />
                            <DetailRow label="Health Insurance (3.545%)" value={result.details.health} />
                            <DetailRow label="Long-term Care (~12.95%)" value={result.details.care} />
                            <DetailRow label="Employment Ins. (0.9%)" value={result.details.employment} />
                            <View className="h-[1px] bg-gray-100 my-2" />
                            <DetailRow label="Income Tax (Est.)" value={result.details.tax} />
                            <DetailRow label="Local Income Tax (10%)" value={result.details.localTax} />
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const DetailRow = ({ label, value }: { label: string, value: number }) => (
    <View className="flex-row justify-between py-2">
        <Text className="text-gray-500 text-sm">{label}</Text>
        <Text className="text-gray-900 font-semibold">₩ {value.toLocaleString()}</Text>
    </View>
);
