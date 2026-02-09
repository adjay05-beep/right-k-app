import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../../constants/design-system';

export const AIChatEntry = () => {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.touchable}
                activeOpacity={0.7}
                onPress={() => router.push('/features/ai-chat')}
            >
                <BlurView intensity={70} tint="light" style={styles.chatBox}>
                    <View style={styles.iconCircle}>
                        <MaterialIcons name="auto-awesome" size={20} color={COLORS.primary[500]} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{t('aiChat.title')}</Text>
                        <Text style={styles.subtitle}>{t('aiChat.subtitle')}</Text>
                    </View>
                    <MaterialIcons name="arrow-forward" size={18} color={COLORS.text.tertiary} />
                </BlurView>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    touchable: {
        borderRadius: 16,
        overflow: 'hidden',
        // No shadow to keep it looking like an input field
        borderWidth: 1,
        borderColor: COLORS.white,
        backgroundColor: COLORS.white,
        ...SHADOWS.sm,
        elevation: 2,
    },
    chatBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: SPACING.lg,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary[600],
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
});
