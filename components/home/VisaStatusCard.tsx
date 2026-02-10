import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../../constants/design-system';
import { useVisaStore } from '../../store/visaStore';

export const VisaStatusCard = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { visaType, expiryDate } = useVisaStore();

    const calculateDDay = (targetDate: string | null) => {
        if (!targetDate) return '-';
        const today = new Date();
        const target = new Date(targetDate);
        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
    };

    const dDay = calculateDDay(expiryDate);
    const isPositive = dDay.startsWith('D-');

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.touchable}
                activeOpacity={0.8}
                onPress={() => router.push('/features/visa-status')}
            >
                <BlurView intensity={60} tint="light" style={styles.card}>
                    <Text style={styles.cardTitle}>{t('visaStatusCard.title')}</Text>
                    <View style={styles.content}>
                        {/* Removed iconBox */}
                        <View style={styles.info}>
                            <Text style={styles.visaType}>{visaType || t('visaStatusCard.noVisa')}</Text>
                            <Text style={[styles.expiry, !isPositive && styles.textError]}>
                                {expiryDate ? t('visaStatusCard.expiresOn', { date: expiryDate }) : t('visaStatusCard.noExpiry')}
                            </Text>
                            {!isPositive && expiryDate && (
                                <Text style={styles.expiredWarning}>
                                    {t('visaStatusCard.expiredWarning')}
                                </Text>
                            )}
                        </View>
                        <View style={[styles.badge, isPositive ? styles.badgePositive : styles.badgeNegative]}>
                            <Text style={[styles.badgeText, isPositive ? styles.textPositive : styles.textNegative]}>
                                {dDay}
                            </Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color={COLORS.text.tertiary} />
                    </View>
                </BlurView>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        color: COLORS.text.primary,
        fontWeight: '400',
    },
    touchable: {
        borderRadius: 16,
        overflow: 'hidden',
        ...SHADOWS.sm,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        padding: SPACING.md,
    },
    cardTitle: {
        fontSize: 12,
        color: COLORS.text.tertiary,
        fontWeight: '600',
        marginBottom: SPACING.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        display: 'none', // Remove the icon box to simplify
    },
    info: {
        flex: 1,
    },
    visaType: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: 2,
    },
    expiry: {
        fontSize: 12,
        color: COLORS.text.tertiary,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: SPACING.sm,
    },
    badgePositive: {
        backgroundColor: COLORS.success.light,
    },
    badgeNegative: {
        backgroundColor: COLORS.error.light,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    textPositive: {
        color: COLORS.success.dark,
    },
    textNegative: {
        color: COLORS.error.dark,
    },
    textError: {
        color: COLORS.error.main,
        fontWeight: 'bold',
    },
    expiredWarning: {
        fontSize: 11,
        color: COLORS.error.main,
        marginTop: 2,
        fontWeight: '600',
    },
});
