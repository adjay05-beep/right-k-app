import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface LoginFormProps {
    email: string;
    password: string;
    saveEmail: boolean;
    isLoading: boolean;
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onSaveEmailToggle: () => void;
    onSubmit: () => void;
    onSwitchToSignup: () => void;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    saveEmailText: string;
    signInButtonText: string;
    noAccountText: string;
    signUpLinkText: string;
}

export default function LoginForm({
    email,
    password,
    saveEmail,
    isLoading,
    onEmailChange,
    onPasswordChange,
    onSaveEmailToggle,
    onSubmit,
    onSwitchToSignup,
    emailPlaceholder,
    passwordPlaceholder,
    saveEmailText,
    signInButtonText,
    noAccountText,
    signUpLinkText,
}: LoginFormProps) {
    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <MaterialIcons name="email" size={24} color="#6B7280" />
                <TextInput
                    placeholder={emailPlaceholder}
                    value={email}
                    onChangeText={onEmailChange}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#9CA3AF"
                />
            </View>

            <View style={styles.inputRow}>
                <MaterialIcons name="lock" size={24} color="#6B7280" />
                <TextInput
                    placeholder={passwordPlaceholder}
                    value={password}
                    onChangeText={onPasswordChange}
                    style={styles.input}
                    secureTextEntry
                    placeholderTextColor="#9CA3AF"
                />
            </View>

            <TouchableOpacity
                style={styles.saveEmailRow}
                onPress={onSaveEmailToggle}
            >
                <MaterialIcons
                    name={saveEmail ? "check-box" : "check-box-outline-blank"}
                    size={24}
                    color={saveEmail ? "#2563EB" : "gray"}
                />
                <Text style={styles.saveEmailText}>{saveEmailText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onSubmit}
                disabled={isLoading}
                style={[styles.authButton, isLoading && styles.authButtonDisabled]}
                activeOpacity={0.7}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.authButtonText}>
                        {signInButtonText}
                    </Text>
                )}
            </TouchableOpacity>

            <View style={styles.switchRow}>
                <Text style={styles.switchText}>
                    {noAccountText}{" "}
                </Text>
                <TouchableOpacity onPress={onSwitchToSignup}>
                    <Text style={styles.switchButtonText}>
                        {signUpLinkText}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    saveEmailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    saveEmailText: {
        marginLeft: 8,
        color: '#4b5563',
        fontSize: 14,
    },
    authButton: {
        backgroundColor: '#2563EB',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    authButtonDisabled: {
        backgroundColor: '#9ca3af',
        shadowOpacity: 0,
    },
    authButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchText: {
        color: '#6b7280',
        fontSize: 14,
    },
    switchButtonText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
