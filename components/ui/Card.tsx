import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/design-system';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'default' | 'outlined' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ children, style, variant = 'elevated', padding = 'md' }: CardProps) => {
    const getVariantStyle = () => {
        switch (variant) {
            case 'outlined':
                return styles.outlined;
            case 'elevated':
                return styles.elevated;
            default:
                return {};
        }
    };

    const getPadding = () => {
        switch (padding) {
            case 'none': return 0;
            case 'sm': return SPACING.sm;
            case 'md': return SPACING.lg; // Visual comfort
            case 'lg': return SPACING.xl;
            default: return SPACING.lg;
        }
    };

    return (
        <View style={[
            styles.base,
            getVariantStyle(),
            { padding: getPadding() },
            style
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
    },
    elevated: {
        ...SHADOWS.md,
    },
    outlined: {
        borderWidth: 1,
        borderColor: COLORS.border,
    },
});
