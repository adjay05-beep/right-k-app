import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SignupFormProps {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    isLoading: boolean;
    onNameChange: (name: string) => void;
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onConfirmPasswordChange: (password: string) => void;
    onSubmit: () => void;
    onSwitchToLogin: () => void;
    namePlaceholder: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    confirmPasswordPlaceholder: string;
    signUpButtonText: string;
    hasAccountText: string;
    signInLinkText: string;
}

export default function SignupForm({
    name,
    email,
    password,
    confirmPassword,
    isLoading,
    onNameChange,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onSubmit,
    onSwitchToLogin,
    namePlaceholder,
    emailPlaceholder,
    passwordPlaceholder,
    confirmPasswordPlaceholder,
    signUpButtonText,
    hasAccountText,
    signInLinkText,
}: SignupFormProps) {
    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <MaterialIcons name="person" size={24} color="#6B7280" />
                <TextInput
                    placeholder={namePlaceholder}
                    value={name}
                    onChangeText={onNameChange}
                    style={styles.input}
                    autoCapitalize="words"
                    placeholderTextColor="#9CA3AF"
                />
            </View>

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

            <View style={[styles.inputRow, styles.inputRowLast]}>
                <MaterialIcons name="lock-outline" size={24} color="#6B7280" />
                <TextInput
                    placeholder={confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChangeText={onConfirmPasswordChange}
                    style={styles.input}
                    secureTextEntry
                    placeholderTextColor="#9CA3AF"
                />
            </View>

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
                        {signUpButtonText}
                    </Text>
                )}
            </TouchableOpacity>

            <View style={styles.switchRow}>
                <Text style={styles.switchText}>
                    {hasAccountText}{" "}
                </Text>
                <TouchableOpacity onPress={onSwitchToLogin}>
                    <Text style={styles.switchButtonText}>
                        {signInLinkText}
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
    inputRowLast: {
        marginBottom: 24,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#1f2937',
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
