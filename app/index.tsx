import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

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

        // Navigate based on onboarding status
        const checkOnboarding = async () => {
            try {
                // await AsyncStorage.clear(); // Uncomment to reset for testing
                const hasLaunched = await AsyncStorage.getItem('has_launched');

                // Timer validation (min 2.5s)
                timer = setTimeout(() => {
                    if (hasLaunched === 'true') {
                        router.replace('/(tabs)');
                    } else {
                        router.replace('/welcome');
                    }
                }, 2500);

                return () => clearTimeout(timer);
            } catch (error) {
                console.error('Onboarding check failed:', error);
                router.replace('/welcome'); // Fallback
            }
        };

        checkOnboarding();

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
