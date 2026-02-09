import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/design-system';

interface TextFieldProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    error?: string;
    style?: ViewStyle;
    suffix?: React.ReactNode;
    multiline?: boolean;
}

export const TextField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    error,
    style,
    suffix,
    multiline = false,
}: TextFieldProps) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputWrapper, error ? styles.inputError : {}]}>
                <TextInput
                    style={[styles.input, multiline && styles.multiline]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.text.tertiary}
                    keyboardType={keyboardType}
                    multiline={multiline}
                />
                {suffix && <View style={styles.suffix}>{suffix}</View>}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    label: {
        ...TYPOGRAPHY.label,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.text.primary,
    },
    multiline: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    inputError: {
        borderColor: COLORS.error.main,
    },
    suffix: {
        marginLeft: SPACING.sm,
    },
    errorText: {
        color: COLORS.error.main,
        fontSize: 12,
        marginTop: 4,
    },
});
