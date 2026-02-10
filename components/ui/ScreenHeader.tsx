import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../constants/design-system';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    colors?: readonly [string, string, ...string[]]; // Gradient colors
    onBack?: () => void;
    rightAction?: React.ReactNode;
}

// Simplified minimal header
export const ScreenHeader = ({
    title,
    subtitle,
    onBack,
    rightAction,
}: ScreenHeaderProps) => {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) onBack();
        else router.back();
    };

    const insets = useSafeAreaInsets();

    return (
        <BlurView
            intensity={80}
            tint="light"
            style={[
                styles.container,
                { paddingTop: insets.top > 0 ? insets.top : 20 }
            ]}
        >
            <View style={styles.headerRow}>
                {/* Left: Back Button */}
                <View style={styles.leftContainer}>
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styles.backButton}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <MaterialIcons name="arrow-back-ios" size={24} color={COLORS.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Center: Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>{title}</Text>
                </View>

                {/* Right: Action or Placeholder */}
                <View style={styles.rightContainer}>
                    {rightAction}
                </View>
            </View>

            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </BlurView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.lg,
        // paddingTop: 44, // Removed fixed padding
        paddingBottom: SPACING.sm, // Compact bottom padding
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent fallback
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)', // Very subtle border
        zIndex: 10,
        position: 'absolute', // Float over content
        top: 0,
        left: 0,
        right: 0,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 0, // Tight layout
        position: 'relative',
        height: 44, // Standard navigation bar height
    },
    leftContainer: {
        zIndex: 2,
        minWidth: 40,
        alignItems: 'flex-start',
    },
    rightContainer: {
        zIndex: 2,
        minWidth: 40,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: SPACING.sm,
        marginLeft: -SPACING.sm, // Align icon close to edge
    },
    titleContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    title: {
        fontSize: 18, // Standard header size
        fontWeight: '600',
        color: COLORS.text.primary,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.text.tertiary,
        textAlign: 'center',
        marginTop: 2,
        marginBottom: 4,
    },
});
