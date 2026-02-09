import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/design-system';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    fullWidth?: boolean;
}

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    style,
    fullWidth = false,
}: ButtonProps) => {

    const getBackgroundColor = () => {
        if (disabled) return COLORS.secondary[200];
        switch (variant) {
            case 'primary': return COLORS.primary[600];
            case 'secondary': return COLORS.secondary[100];
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            case 'danger': return COLORS.error.main;
            default: return COLORS.primary[600];
        }
    };

    const getTextColor = () => {
        if (disabled) return COLORS.secondary[400];
        switch (variant) {
            case 'primary': return COLORS.text.inverse;
            case 'secondary': return COLORS.text.primary;
            case 'outline': return COLORS.primary[600];
            case 'ghost': return COLORS.primary[600];
            case 'danger': return COLORS.text.inverse;
            default: return COLORS.text.inverse;
        }
    };

    const getBorder = () => {
        if (variant === 'outline') return { borderWidth: 1, borderColor: disabled ? COLORS.secondary[200] : COLORS.primary[600] };
        return {};
    };

    const containerStyles = [
        styles.base,
        { backgroundColor: getBackgroundColor() },
        getBorder(),
        size === 'sm' && styles.sizeSm,
        size === 'md' && styles.sizeMd,
        size === 'lg' && styles.sizeLg,
        fullWidth && styles.fullWidth,
        variant !== 'ghost' && variant !== 'outline' && !disabled && SHADOWS.sm,
        style,
    ];

    return (
        <TouchableOpacity
            style={containerStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon && <React.Fragment>{icon}</React.Fragment>}
                    <Text style={[
                        styles.text,
                        { color: getTextColor() },
                        icon ? { marginLeft: SPACING.sm } : {},
                        size === 'sm' && { fontSize: 14 },
                        size === 'lg' && { fontSize: 18 },
                    ]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.md,
    },
    sizeSm: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.md,
    },
    sizeMd: {
        paddingVertical: 14,
        paddingHorizontal: SPACING.lg,
    },
    sizeLg: {
        paddingVertical: 18,
        paddingHorizontal: SPACING.xl,
    },
    fullWidth: {
        width: '100%',
    },
    text: {
        fontWeight: '700',
        fontSize: 16,
    },
});
