import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../../constants/design-system';

interface TrustBadgeProps {
    source: string; // e.g. "HiKorea" or "Ministry of Justice"
    date?: string;
}

export const TrustBadge = ({ source, date = '2024.01' }: TrustBadgeProps) => {
    return (
        <View style={styles.container}>
            <MaterialIcons name="verified-user" size={16} color={COLORS.primary[600]} />
            <Text style={styles.text}>
                Verified by <Text style={styles.source}>{source}</Text> • {date}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary[50],
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: COLORS.primary[200],
        gap: 6,
    },
    text: {
        fontSize: 12,
        color: COLORS.primary[800],
        fontWeight: '500',
    },
    source: {
        fontWeight: '700',
    }
});
