import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        // Optional: Navigate to home or stay here
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollView>
                {/* Header / Profile Info */}
                <View className="p-6 pt-12 items-center bg-gray-50 pb-10 rounded-b-[40px] shadow-sm">
                    {user ? (
                        <>
                            <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm">
                                <Text className="text-3xl">👤</Text>
                            </View>
                            <Text className="text-2xl font-bold text-gray-900 mb-1">{user.email?.split('@')[0]}</Text>
                            <Text className="text-gray-400">{user.email}</Text>
                        </>
                    ) : (
                        <>
                            <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-4">
                                <MaterialIcons name="person-outline" size={48} color="#9CA3AF" />
                            </View>
                            <Text className="text-xl font-bold text-gray-900 mb-2">Guest User</Text>
                            <TouchableOpacity
                                className="bg-blue-600 px-6 py-2 rounded-full shadow-sm"
                                onPress={() => router.push('/login')}
                            >
                                <Text className="text-white font-bold">Sign In / Sign Up</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* Menu Items */}
                <View className="p-6">
                    <Text className="text-gray-900 font-bold text-lg mb-4 ml-1">Settings</Text>

                    <MenuItem icon="language" label="Language" value="English" />
                    <MenuItem icon="notifications-none" label="Notifications" toggle />
                    <MenuItem icon="shield" label="Privacy & Security" />
                    <MenuItem icon="help-outline" label="Help & Support" />

                    {user && (
                        <TouchableOpacity
                            className="bg-red-50 p-4 rounded-xl flex-row items-center mt-6"
                            onPress={handleLogout}
                        >
                            <MaterialIcons name="logout" size={24} color="#EF4444" />
                            <Text className="flex-1 ml-3 font-semibold text-red-500">Log Out</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const MenuItem = ({ icon, label, value, toggle }: { icon: keyof typeof MaterialIcons.glyphMap, label: string, value?: string, toggle?: boolean }) => (
    <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-2xl mb-3">
        <View className="bg-white p-2 rounded-lg">
            <MaterialIcons name={icon} size={20} color="#374151" />
        </View>
        <Text className="flex-1 ml-4 text-gray-700 font-medium">{label}</Text>
        {value && <Text className="text-gray-400 text-sm">{value}</Text>}
        {toggle && <MaterialIcons name="toggle-on" size={24} color="#3B82F6" />}
        {!value && !toggle && <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />}
    </TouchableOpacity>
);
