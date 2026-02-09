import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../../constants/design-system';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

interface HomeHeaderProps {
    userName: string;
}

export const HomeHeader = ({ userName }: HomeHeaderProps) => {
    const { t } = useTranslation();
    const currentDate = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.textContainer}>
                    <Text style={styles.date}>{currentDate}</Text>
                    <Text style={styles.greeting}>
                        {t('dashboard.hello', { name: userName })}
                    </Text>
                </View>
                <LanguageSwitcher />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.md,
        paddingHorizontal: SPACING.lg,
        backgroundColor: 'transparent',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    textContainer: {
        flex: 1,
        marginRight: SPACING.md,
    },
    date: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text.secondary, // Darker for contrast on glass
        marginBottom: 2,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    greeting: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.text.primary,
        letterSpacing: -0.5,
    },
});
