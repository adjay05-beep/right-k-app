import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../../constants/design-system';

interface ActionButtonProps {
    title: string;
    route: string;
}

const ActionButton = ({ title, route, icon }: ActionButtonProps & { icon: keyof typeof MaterialIcons.glyphMap }) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={styles.touchable}
            activeOpacity={0.7}
            onPress={() => router.push(route as any)}
        >
            <BlurView intensity={50} tint="light" style={styles.button}>
                <MaterialIcons name={icon} size={24} color={COLORS.text.tertiary} />
                <Text style={styles.text}>{title.replace('\n', ' ')}</Text>
            </BlurView>
        </TouchableOpacity>
    );
};

export const SecondaryActions = () => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <ActionButton
                    title={t('dashboard.center')}
                    route="/features/center"
                    icon="location-city"
                />
                <ActionButton
                    title={t('dashboard.pension')}
                    route="/features/pension"
                    icon="volunteer-activism"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.xl,
        alignItems: 'center', // Center the row
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: SPACING.md,
    },
    touchable: {
        width: '45%',
        height: 80,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.8)',
        backgroundColor: COLORS.white,
        ...SHADOWS.sm,
        elevation: 2,
    },
    button: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    text: {
        textAlign: 'left', // Left align for horizontal layout
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.secondary,
        lineHeight: 20,
    },
});
