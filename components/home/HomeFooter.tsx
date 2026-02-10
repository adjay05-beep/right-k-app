import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../../constants/design-system';

export const HomeFooter = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const navigateToLegal = (type: string) => {
        router.push(`/legal/${type}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.divider} />

            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.expandButton}
                    activeOpacity={0.7}
                >
                    <Text style={styles.companyName}>© Right K</Text>
                    <Ionicons name="chevron-down" size={16} color={COLORS.text.tertiary} />
                </TouchableOpacity>

                <View style={styles.linksRow}>
                    <TouchableOpacity onPress={() => navigateToLegal('terms')}>
                        <Text style={styles.linkText}>{t('footer.terms')}</Text>
                    </TouchableOpacity>
                    <View style={styles.verticalDivider} />

                    <TouchableOpacity onPress={() => navigateToLegal('privacy')}>
                        <Text style={[styles.linkText, styles.boldLink]}>{t('footer.privacy')}</Text>
                    </TouchableOpacity>
                    <View style={styles.verticalDivider} />

                    <TouchableOpacity onPress={() => navigateToLegal('location')}>
                        <Text style={styles.linkText}>{t('footer.location')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoText}>{t('footer.company_desc')}</Text>
                </View>

                <View style={styles.contactRow}>
                    <Text style={styles.labelText}>{t('footer.customer_center')}</Text>
                    <Text style={styles.contactText}>contact@rightk.com</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 32,
        paddingHorizontal: SPACING.lg,
        backgroundColor: '#F9FAFB', // Very light gray background
        marginTop: SPACING.xl,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: 24,
    },
    content: {
        gap: 12,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    companyName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.secondary,
        marginRight: 4,
    },
    linksRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    linkText: {
        fontSize: 12,
        color: COLORS.text.tertiary,
    },
    boldLink: {
        fontWeight: '700',
        color: COLORS.text.secondary,
    },
    verticalDivider: {
        width: 1,
        height: 10,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 8,
    },
    infoRow: {
        marginBottom: 4,
    },
    infoText: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.text.tertiary,
        marginRight: 8,
    },
    contactText: {
        fontSize: 11,
        color: COLORS.text.tertiary,
    },
});
