import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen() {
    const router = useRouter();
    const { signIn, signUp, isLoading, error } = useAuthStore();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                await signUp(email, password);
            }
            // Navigate back or to profile on success
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/(tabs)/profile');
            }
        } catch (e: any) {
            Alert.alert("Authentication Failed", e.message);
        }
    };

    return (
        <View className="flex-1 bg-gray-50 p-6 justify-center">
            <View className="items-center mb-10">
                <View className="bg-blue-600 w-16 h-16 rounded-2xl items-center justify-center mb-4 shadow-md">
                    <MaterialIcons name="lock-person" size={32} color="white" />
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </Text>
                <Text className="text-gray-500 text-center mt-2 px-6">
                    {isLogin
                        ? "Sign in to access your saved data and settings."
                        : "Join us to manage your visa and financial goals."}
                </Text>
            </View>

            <View className="bg-white p-6 rounded-3xl shadow-sm">
                <Text className="text-gray-500 ml-1 mb-2 font-medium">Email</Text>
                <TextInput
                    className="bg-gray-100 p-4 rounded-xl mb-4 text-gray-800"
                    placeholder="hello@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text className="text-gray-500 ml-1 mb-2 font-medium">Password</Text>
                <TextInput
                    className="bg-gray-100 p-4 rounded-xl mb-6 text-gray-800"
                    placeholder="••••••••"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity
                    className={`p-4 rounded-xl items-center shadow-sm ${isLoading ? 'bg-gray-400' : 'bg-blue-600 active:bg-blue-700'}`}
                    onPress={handleAuth}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-lg font-bold">
                            {isLogin ? "Sign In" : "Sign Up"}
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    className="mt-6 items-center"
                    onPress={() => setIsLogin(!isLogin)}
                >
                    <Text className="text-gray-500">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <Text className="text-blue-600 font-bold">
                            {isLogin ? "Sign Up" : "Log In"}
                        </Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
