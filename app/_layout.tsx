import { Stack } from 'expo-router';
import '../global.css';
import '../i18n';

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="language" />
            <Stack.Screen name="features/visa-status" options={{ headerShown: false }} />
        </Stack>
    );
}
