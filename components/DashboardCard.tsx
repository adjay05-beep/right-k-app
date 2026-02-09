import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DashboardCardProps {
    title: string;
    subtitle?: string;
    iconName: keyof typeof MaterialIcons.glyphMap;
    href: string;
    color?: string;
}

export default function DashboardCard({ title, subtitle, iconName, href }: DashboardCardProps) {
    return (
        <Link href={href as any} asChild>
            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                <View style={styles.iconBox}>
                    <MaterialIcons name={iconName} size={24} color="#00264B" />
                </View>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </TouchableOpacity>
        </Link>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 24,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 16,
        width: '48%',
    },
    iconBox: {
        backgroundColor: '#eff6ff',
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: '#6b7280',
    },
});
