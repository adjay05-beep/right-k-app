import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/design-system';

type NoticeVariant = 'info' | 'warning' | 'error' | 'success';

interface NoticeCardProps {
    variant?: NoticeVariant;
    title?: string;
    children: React.ReactNode;
    icon?: keyof typeof MaterialIcons.glyphMap;
    style?: ViewStyle;
}

const THEMES: Record<NoticeVariant, { bg: string; border: string; icon: string; text: string; defaultIcon: keyof typeof MaterialIcons.glyphMap }> = {
    info: {
        bg: COLORS.primary[50], // Light Blue
        border: COLORS.primary[100],
        icon: COLORS.primary[600],
        text: COLORS.primary[900], // Darker text for readability
        defaultIcon: 'info-outline',
    },
    warning: {
        bg: '#FFF8E1', // Light Amber
        border: '#FFE082',
        icon: '#F57C00', // Darker Orange
        text: '#E65100',
        defaultIcon: 'warning-amber',
    },
    error: {
        bg: '#FFEBEE', // Light Red
        border: '#FFCDD2',
        icon: COLORS.error.main,
        text: '#B71C1C', // Dark Red
        defaultIcon: 'error-outline',
    },
    success: {
        bg: '#E8F5E9', // Light Green
        border: '#C8E6C9',
        icon: COLORS.success.main,
        text: '#1B5E20', // Dark Green
        defaultIcon: 'check-circle-outline',
    },
};

export const NoticeCard = ({ variant = 'info', title, children, icon, style }: NoticeCardProps) => {
    const theme = THEMES[variant];
    const iconName = icon || theme.defaultIcon;

    return (
        <View style={[
            styles.container,
            { backgroundColor: theme.bg, borderColor: theme.border },
            style
        ]}>
            <View style={styles.iconContainer}>
                <MaterialIcons name={iconName} size={20} color={theme.icon} />
            </View>
            <View style={styles.contentContainer}>
                {title && (
                    <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                )}
                <Text style={[styles.body, { color: COLORS.text.secondary }]}>
                    {children}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        marginBottom: SPACING.md,
        alignItems: 'flex-start',
    },
    iconContainer: {
        marginRight: SPACING.sm,
        marginTop: 2, // Align with text cap height
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        ...TYPOGRAPHY.h4,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    body: {
        ...TYPOGRAPHY.body,
        fontSize: 13,
        lineHeight: 18,
    },
});
