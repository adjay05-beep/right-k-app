import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface DebugLoggerProps {
    logs: string[];
    visible: boolean;
}

export default function DebugLogger({ logs, visible }: DebugLoggerProps) {
    if (!visible || logs.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Debug Logs</Text>
            <ScrollView style={styles.logScroll} nestedScrollEnabled>
                {logs.map((log, idx) => (
                    <Text key={idx} style={styles.logText}>
                        {log}
                    </Text>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a1a1a',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        maxHeight: 200,
    },
    title: {
        color: '#4ade80',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    logScroll: {
        maxHeight: 150,
    },
    logText: {
        color: '#4ade80',
        fontSize: 10,
        fontFamily: 'monospace',
        marginBottom: 4,
    },
});
