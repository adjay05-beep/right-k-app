import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useVisaStore } from '../../store/visaStore';
import { analyzeARC } from '../../utils/ocrService';
import { LANGUAGES } from '../language';

export default function ProfileScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuthStore();
    const { visaType, expiryDate, entryDate, setVisaDetails } = useVisaStore();

    const [isScanning, setIsScanning] = useState(false);

    const currentLangLabel = LANGUAGES.find(l => l.code === i18n.language)?.label || 'English';

    const handleLogout = async () => {
        await logout();
    };

    const estimateExpiryDate = (type: string, issueDateStr: string | null) => {
        if (!issueDateStr) return null;
        const date = new Date(issueDateStr);
        if (isNaN(date.getTime())) return null;
        if (type.includes('D-10')) {
            date.setMonth(date.getMonth() + 6);
        } else {
            date.setFullYear(date.getFullYear() + 1);
        }
        return date.toISOString().split('T')[0];
    };

    const handleScanARC = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert(t('common.error'), t('visaStatus.permissionRequired'));
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (pickerResult.canceled) return;

        setIsScanning(true);

        try {
            const result = await analyzeARC(pickerResult.assets[0].uri);
            if (!result) throw new Error("No result from OCR");

            const finalIssueDate = result.issueDate || null;
            const finalExpiryDate = result.expiryDate || estimateExpiryDate(result.visaType || visaType, finalIssueDate) || expiryDate;

            setVisaDetails({
                regNumber: result.regNumber,
                name: result.name,
                country: result.country,
                visaType: result.visaType,
                issueDate: finalIssueDate,
                expiryDate: finalExpiryDate
            });

            Alert.alert(t('visaStatus.scanComplete'), t('visaStatus.scanSuccess'));
        } catch (error) {
            console.error("OCR Error:", error);
            Alert.alert(t('visaStatus.scanFailed'), t('visaStatus.scanError'));
        } finally {
            setIsScanning(false);
        }
    };

    const calculateDDay = (targetDate: string | null) => {
        if (!targetDate) return '-';
        const today = new Date();
        const target = new Date(targetDate);
        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
    };
    const dDay = calculateDDay(expiryDate);

    // Calculate progress
    const calculateProgress = () => {
        if (!entryDate || !expiryDate) return 0.5;
        const start = new Date(entryDate).getTime();
        const end = new Date(expiryDate).getTime();
        const now = new Date().getTime();
        const total = end - start;
        const current = now - start;
        const percent = Math.max(0, Math.min(1, current / total));
        return percent;
    };
    const progress = calculateProgress();
    const progressPercent = Math.round(progress * 100);

    const displayName = user?.displayName || user?.email?.split('@')[0] || "Guest";

    return (
        <View className="flex-1 bg-white">
            <ScrollView>
                {/* Header / Profile Info */}
                <View className="items-center pb-6">
                    <LinearGradient
                        colors={['#1E293B', '#334155']}
                        className="w-full pt-16 pb-12 rounded-b-[40px] items-center mb-6 shadow-lg"
                    >
                        {user ? (
                            <>
                                <View className="w-24 h-24 bg-white/10 rounded-full items-center justify-center mb-4 border-2 border-white/20 backdrop-blur-md">
                                    <Text className="text-4xl">🧑‍🔧</Text>
                                </View>
                                <Text className="text-2xl font-bold text-white mb-1">{displayName}</Text>
                                <Text className="text-gray-300 font-medium">{user.email}</Text>

                                {/* Visa Badge */}
                                <View className="flex-row mt-4 space-x-3">
                                    <View className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/50">
                                        <Text className="text-emerald-300 font-bold text-xs">{t('profile.visaLabel', { type: visaType })}</Text>
                                    </View>
                                    <View className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/50">
                                        <Text className="text-blue-300 font-bold text-xs">{t('profile.entryLabel', { date: entryDate || '-' })}</Text>
                                    </View>
                                </View>
                            </>
                        ) : (
                            <>
                                <View className="w-24 h-24 bg-white/10 rounded-full items-center justify-center mb-4">
                                    <MaterialIcons name="person-outline" size={48} color="white" />
                                </View>
                                <Text className="text-xl font-bold text-white mb-4">{t('profile.guest')}</Text>
                                <TouchableOpacity
                                    className="bg-white px-8 py-3 rounded-full shadow-md"
                                    onPress={() => router.push('/login')}
                                >
                                    <Text className="text-slate-900 font-bold">{t('profile.signInSignUp')}</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </LinearGradient>

                    {/* Visa Status Card (Only if logged in) */}
                    {user && (
                        <TouchableOpacity
                            onPress={() => router.push('/features/visa-status')}
                            activeOpacity={0.9}
                            className="w-[90%] bg-white p-5 rounded-2xl shadow-md border border-gray-100 -mt-16 mb-4"
                        >
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t('profile.stayExpiration')}</Text>
                                <MaterialIcons name="edit" size={16} color="#9CA3AF" />
                            </View>
                            <View className="flex-row justify-between items-end">
                                <Text className="text-3xl font-extrabold text-slate-800">{expiryDate || '-'}</Text>
                                <View className={`px-2 py-1 rounded-md ${dDay.startsWith('D-') ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                                    <Text className={`font-bold text-sm ${dDay.startsWith('D-') ? 'text-emerald-600' : 'text-rose-600'}`}>{dDay}</Text>
                                </View>
                            </View>
                            <View className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
                                <View
                                    className="h-full bg-slate-800 rounded-full"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </View>
                            <Text className="text-right text-xs text-gray-400 mt-1">{t('profile.completed', { percent: progressPercent })}</Text>
                        </TouchableOpacity>
                    )}

                    {/* Quick Scan Button */}
                    {user && (
                        <View className="w-[90%] -mt-2 mb-6">
                            <Button
                                title={t('visaStatus.uploadArc')}
                                onPress={handleScanARC}
                                variant="primary"
                                loading={isScanning}
                                icon={<MaterialIcons name="camera-alt" size={20} color="white" />}
                                style={{ backgroundColor: '#2563eb', borderRadius: 16 }}
                            />
                        </View>
                    )}

                </View>

                {/* Menu Items */}
                <View className="px-6 pb-20">
                    <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">{t('profile.settings')}</Text>

                    <MenuItem
                        icon="person"
                        label={t('profile.editProfile')}
                        onPress={() => router.push('/features/visa-status')}
                    />
                    <MenuItem icon="notifications-none" label={t('profile.notifications')} toggle />
                    <MenuItem
                        icon="language"
                        label={t('profile.language')}
                        value={currentLangLabel}
                        onPress={() => router.push('/language')}
                    />
                    <MenuItem icon="headset-mic" label={t('profile.helpSupport')} />

                    {user && (
                        <TouchableOpacity
                            className="bg-rose-50 p-4 rounded-xl flex-row items-center mt-6 border border-rose-100"
                            onPress={handleLogout}
                        >
                            <MaterialIcons name="logout" size={24} color="#F43F5E" />
                            <Text className="flex-1 ml-3 font-semibold text-rose-600">{t('profile.logOut')}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const MenuItem = ({ icon, label, value, toggle, onPress }: { icon: keyof typeof MaterialIcons.glyphMap, label: string, value?: string, toggle?: boolean, onPress?: () => void }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="flex-row items-center p-4 bg-gray-50 rounded-2xl mb-3 border border-gray-100 active:bg-gray-100">
        <View className="bg-white p-2 rounded-lg shadow-sm">
            <MaterialIcons name={icon} size={20} color="#334155" />
        </View>
        <Text className="flex-1 ml-4 text-gray-700 font-medium">{label}</Text>
        {value && <Text className="text-gray-400 text-sm font-medium">{value}</Text>}
        {toggle && <MaterialIcons name="toggle-on" size={28} color="#4F46E5" />}
        {!value && !toggle && <MaterialIcons name="chevron-right" size={20} color="#CBD5E1" />}
    </TouchableOpacity>
);
