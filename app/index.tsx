import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { auth } from '../utils/firebase';

export default function SplashScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        let timer: NodeJS.Timeout;

        // Fade in and scale animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Navigate based on auth status
        const checkNavigation = async () => {
            try {
                // Wait for auth to initialize if it hasn't already
                // Since this is a splash screen, we can afford a small delay or use onAuthStateChanged
                const user = auth.currentUser;
                const hasLaunched = await AsyncStorage.getItem('has_launched');

                timer = setTimeout(() => {
                    if (!user) {
                        // Not logged in -> go to Welcome (if first time) or Login
                        if (hasLaunched === 'true') {
                            router.replace('/login');
                        } else {
                            router.replace('/welcome');
                        }
                    } else if (!user.emailVerified) {
                        // Logged in but not verified -> go to Verification status in Login screen
                        router.replace('/login');
                    } else {
                        // Logged in and verified -> Go home
                        router.replace('/(tabs)');
                    }
                }, 2500);

                return () => clearTimeout(timer);
            } catch (error) {
                console.error('Navigation check failed:', error);
                router.replace('/welcome');
            }
        };

        checkNavigation();

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* Logo Image */}
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Slogan */}
                <Text style={styles.slogan}>Find Your Right,</Text>
                <Text style={styles.slogan}>Enjoy Korea.</Text>

                {/* Decorative Line */}
                <View style={styles.decorativeLine} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logo: {
        width: 320,
        height: 100,
        marginBottom: 50,
    },
    slogan: {
        fontSize: 22,
        fontWeight: '300',
        color: '#1f2937',
        letterSpacing: 1,
        textAlign: 'center',
        marginVertical: 2,
    },
    decorativeLine: {
        width: 60,
        height: 3,
        backgroundColor: '#34D399',
        marginTop: 24,
        borderRadius: 2,
    },
});
