import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface LiquidBackgroundProps extends ViewProps {
    children: React.ReactNode;
}

export const LiquidBackground = ({ children, style, ...props }: LiquidBackgroundProps) => {
    return (
        <View style={[styles.container, style]} {...props}>
            {/* Background Mesh Gradients */}
            <View style={styles.orb1} />
            <View style={styles.orb2} />
            <View style={styles.orb3} />

            {/* Glass Overlay to soften the orbs */}
            <LinearGradient
                colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.8)']}
                style={styles.overlay}
            />

            {/* Content */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', // Slate 50 base
        position: 'relative',
        overflow: 'hidden',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    content: {
        flex: 1,
        zIndex: 2,
    },
    orb1: {
        position: 'absolute',
        top: -100,
        left: -50,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#DBEAFE', // Blue 100
        opacity: 0.6,
        transform: [{ scale: 1.5 }],
    },
    orb2: {
        position: 'absolute',
        top: '20%',
        right: -100,
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: '#F3E8FF', // Purple 100
        opacity: 0.5,
    },
    orb3: {
        position: 'absolute',
        bottom: -50,
        left: '10%',
        width: 350,
        height: 350,
        borderRadius: 175,
        backgroundColor: '#E0E7FF', // Indigo 100
        opacity: 0.5,
    },
});
