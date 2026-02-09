import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LiquidBackground } from '../components/ui/LiquidBackground';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/design-system';

export default function WelcomeScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const handleAction = async (route: string) => {
        try {
            await AsyncStorage.setItem('has_launched', 'true');
            if (route === '/login') {
                router.replace('/login');
            } else {
                router.push(route as any);
            }
        } catch (e) {
            console.error(e);
            router.push(route as any);
        }
    };

    return (
        <LiquidBackground style={styles.container}>
            <View style={styles.content}>
                {/* Hero Section */}
                <View style={styles.hero}>
                    <View style={styles.iconCircle}>
                        <MaterialIcons name="public" size={48} color={COLORS.primary[600]} />
                    </View>
                    <Text style={styles.title}>
                        {t('welcome.title1')}{'\n'}
                        <Text style={styles.highlight}>{t('welcome.title2')}</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                        {t('welcome.subtitle')}
                    </Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    {/* Primary Action: Try Calculator (Guest) */}
                    <TouchableOpacity
                        style={styles.touchable}
                        activeOpacity={0.8}
                        onPress={() => handleAction('/features/visa-calculator')}
                    >
                        <BlurView intensity={80} tint="light" style={styles.primaryButton}>
                            <MaterialIcons name="calculate" size={24} color={COLORS.primary[600]} />
                            <View style={styles.buttonTextContainer}>
                                <Text style={styles.buttonTitle}>{t('welcome.tryCalculator')}</Text>
                                <Text style={styles.buttonSubtitle}>{t('welcome.tryCalculatorSubtitle')}</Text>
                            </View>
                            <MaterialIcons name="arrow-forward" size={20} color={COLORS.primary[600]} />
                        </BlurView>
                    </TouchableOpacity>

                    {/* Secondary Action: Sign In */}
                    <TouchableOpacity
                        style={styles.touchable}
                        activeOpacity={0.8}
                        onPress={() => handleAction('/login')}
                    >
                        <BlurView intensity={40} tint="light" style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>{t('welcome.alreadyHaveAccount')}</Text>
                        </BlurView>
                    </TouchableOpacity>
                </View>
            </View>
        </LiquidBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: SPACING.xl,
        justifyContent: 'space-between',
        paddingVertical: 80,
    },
    hero: {
        alignItems: 'center',
        marginTop: SPACING.xxl,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    title: {
        ...TYPOGRAPHY.h1,
        textAlign: 'center',
        fontSize: 32,
        marginBottom: SPACING.md,
        color: COLORS.text.primary,
    },
    highlight: {
        color: COLORS.primary[600],
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
        color: COLORS.text.secondary,
        lineHeight: 24,
    },
    actions: {
        gap: SPACING.md,
    },
    touchable: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        gap: SPACING.md,
    },
    buttonTextContainer: {
        flex: 1,
    },
    buttonTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: 2,
    },
    buttonSubtitle: {
        fontSize: 12,
        color: COLORS.text.secondary,
    },
    secondaryButton: {
        padding: SPACING.lg,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
});
