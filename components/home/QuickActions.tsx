import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../../constants/design-system';

interface QuickActionProps {
    title: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    route: string;
}

const QuickActionButton = ({ title, icon, route }: QuickActionProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={styles.touchable}
            activeOpacity={0.7}
            onPress={() => router.push(route as any)}
        >
            <BlurView intensity={50} tint="light" style={styles.button}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name={icon} size={28} color={COLORS.text.secondary} />
                </View>
                <Text style={styles.text}>{title}</Text>
            </BlurView>
        </TouchableOpacity>
    );
};

export const QuickActions = () => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>

            <View style={styles.row}>
                <QuickActionButton
                    title={t('dashboard.visa')}
                    icon="calculate"
                    route="/features/visa-calculator"
                />
                <QuickActionButton
                    title={t('dashboard.docs')}
                    icon="description"
                    route="/features/visa-documents"
                />
                <QuickActionButton
                    title={t('dashboard.mail')}
                    icon="mail"
                    route="/features/mail"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.xl,
        marginTop: SPACING.xs, // Small top margin to separate from the card
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.md,
    },
    touchable: {
        width: '30%',
        height: 115,
        borderRadius: 16,
        overflow: 'hidden',
        // Shadow for depth
        ...SHADOWS.md,
        elevation: 4,
        backgroundColor: COLORS.white, // Solid background
    },
    button: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // Almost opaque
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.sm,
    },
    iconContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xs,
        // Removed background color
    },
    text: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text.secondary,
        lineHeight: 18,
    },
});
