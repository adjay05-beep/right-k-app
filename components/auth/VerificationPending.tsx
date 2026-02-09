import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VerificationPendingProps {
    onCheckVerification: () => void;
    onResendEmail: () => void;
    onBack: () => void;
    checkVerificationText: string;
    resendEmailText: string;
    backText: string;
    verificationPendingTitle: string;
    linkSentDesc: string;
}

export default function VerificationPending({
    onCheckVerification,
    onResendEmail,
    onBack,
    checkVerificationText,
    resendEmailText,
    backText,
    verificationPendingTitle,
    linkSentDesc,
}: VerificationPendingProps) {
    return (
        <View style={styles.container}>
            <View style={styles.iconBox}>
                <MaterialIcons name="mark-email-read" size={48} color="#2563EB" />
            </View>
            <Text style={styles.title}>{verificationPendingTitle}</Text>
            <Text style={styles.desc}>{linkSentDesc}</Text>

            <TouchableOpacity
                onPress={onCheckVerification}
                style={styles.buttonPrimary}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>{checkVerificationText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onResendEmail}
                style={styles.buttonSecondary}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonTextSecondary}>{resendEmailText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onBack}
                style={styles.backButton}
            >
                <Text style={styles.backText}>{backText}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBox: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 12,
    },
    desc: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
    },
    buttonPrimary: {
        width: '100%',
        backgroundColor: '#2563EB',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonSecondary: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#2563EB',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonTextSecondary: {
        color: '#2563EB',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 12,
    },
    backText: {
        color: '#6b7280',
        fontSize: 14,
    },
});
