import { useRouter } from 'expo-router';
import { sendEmailVerification, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import VerificationPending from '../components/auth/VerificationPending';
import { useAuthStore } from '../store/authStore';
import { auth } from '../utils/firebase';
import { deleteEmailFromStorage, loadEmailFromStorage, saveEmailToStorage } from '../utils/storage';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 40,
    },
    logo: {
        width: 288,
        height: 90,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
    },
    formContainer: {
        marginBottom: 24,
    },
});


type AuthMode = 'login' | 'signup' | 'verification';

export default function LoginScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { signIn, signUp, isLoading } = useAuthStore();

    // Mode management
    const [mode, setMode] = useState<AuthMode>('login');

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [saveEmail, setSaveEmail] = useState(false);

    const addLog = (msg: string) => {
        console.log(msg);
    };

    // Load saved email on mount
    useEffect(() => {
        const loadEmail = async () => {
            try {
                const saved = await loadEmailFromStorage();
                if (saved) {
                    setEmail(saved);
                    setSaveEmail(true);
                    addLog('Saved email loaded.');
                } else {
                    addLog('No saved email found.');
                }
            } catch (e) {
                addLog('Failed to load email: ' + e);
            }
        };
        loadEmail();
    }, []);

    // Verification handlers
    const handleCheckVerification = async () => {
        addLog("Checking verification status...");
        const user = auth.currentUser;
        if (user) {
            try {
                await user.reload();
                addLog(`User reloaded. Verified: ${user.emailVerified}`);
                if (user.emailVerified) {
                    Alert.alert(t('common.ok'), t('login.verifiedSuccess'));
                    router.replace('/(tabs)');
                } else {
                    Alert.alert(t('common.error'), t('login.notVerifiedYet'));
                }
            } catch (e: any) {
                addLog('Verification check error: ' + e.message);
            }
        } else {
            addLog('No user found for verification check.');
        }
    };

    const handleResendLink = async () => {
        addLog("Resending verification link...");
        const user = auth.currentUser;
        if (user) {
            try {
                await sendEmailVerification(user);
                addLog('Verification email sent.');
                Alert.alert(t('common.ok'), t('login.emailSent'));
            } catch (e: any) {
                addLog('Resend error: ' + e.message);
                Alert.alert(t('common.error'), e.message);
            }
        }
    };

    const handleBackFromVerification = () => {
        setMode('login');
    };

    // Authentication handlers
    const handleLogin = async () => {
        addLog(`Attempting sign in for: ${email}`);

        if (!email || !password) {
            addLog('Validation failed: Missing fields.');
            Alert.alert(t('common.error'), t('common.fillAllFields'));
            return;
        }

        try {
            await signIn(email, password);
            addLog('Sign in successful.');

            try {
                if (saveEmail) {
                    await saveEmailToStorage(email);
                    addLog('Email saved to storage.');
                } else {
                    await deleteEmailFromStorage();
                    addLog('Email removed from storage.');
                }
            } catch (storeErr: any) {
                addLog(`Storage Error (Ignored): ${storeErr.message}`);
            }

            const currentUser = auth.currentUser;
            if (currentUser) {
                await currentUser.reload();
                addLog(`Current user loaded: ${currentUser.email}, Verified: ${currentUser.emailVerified}`);
            }

            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/(tabs)');
            }
        } catch (err: any) {
            addLog(`Auth Error: ${err.code} - ${err.message}`);
            Alert.alert(t('common.authFailed'), err.message);
        }
    };

    const handleSignup = async () => {
        addLog(`Attempting sign up for: ${email}`);

        if (!email || !password || !name) {
            addLog('Validation failed: Missing fields.');
            Alert.alert(t('common.error'), t('common.fillAllFields'));
            return;
        }

        if (password !== confirmPassword) {
            addLog('Validation failed: Password mismatch.');
            Alert.alert(t('common.error'), t('login.passwordMismatch'));
            return;
        }

        try {
            const signedUpUser = await signUp(email, password);

            if (signedUpUser) {
                addLog('Sign up successful via AuthStore.');
                await updateProfile(signedUpUser, { displayName: name });
                addLog('Profile updated.');
                await sendEmailVerification(signedUpUser);
                addLog('Verification email sent.');
                addLog("Switching to Pending View.");
                setMode('verification');
            } else {
                addLog("Signup returned null user.");
                Alert.alert(t('common.error'), t('login.createAccountError'));
            }
        } catch (err: any) {
            addLog(`Auth Error: ${err.code} - ${err.message}`);
            if (err.code === 'auth/email-already-in-use') {
                Alert.alert(
                    t('common.error'),
                    t('login.emailInUse'),
                    [{ text: t('login.signInButton'), onPress: () => setMode('login') }]
                );
            } else {
                Alert.alert(t('common.authFailed'), err.message);
            }
        }
    };

    // Render verification pending screen
    if (mode === 'verification') {
        return (
            <View style={styles.container}>
                <VerificationPending
                    onCheckVerification={handleCheckVerification}
                    onResendEmail={handleResendLink}
                    onBack={handleBackFromVerification}
                    checkVerificationText={t('login.checkVerification')}
                    resendEmailText={t('login.resendEmail')}
                    backText={t('common.back')}
                    verificationPendingTitle={t('login.verificationPending')}
                    linkSentDesc={t('login.linkSentDesc')}
                />
            </View>
        );
    }

    // Render main login/signup screen
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>
                        {mode === 'login' ? t('login.welcome') : t('login.createAccount')}
                    </Text>
                    <Text style={styles.subtitle}>
                        {mode === 'login' ? t('login.signInDesc') : t('login.joinDesc')}
                    </Text>
                </View>

                {/* Form Container */}
                <View style={styles.formContainer}>
                    {mode === 'login' ? (
                        <LoginForm
                            email={email}
                            password={password}
                            saveEmail={saveEmail}
                            isLoading={isLoading}
                            onEmailChange={setEmail}
                            onPasswordChange={setPassword}
                            onSaveEmailToggle={() => setSaveEmail(!saveEmail)}
                            onSubmit={handleLogin}
                            onSwitchToSignup={() => setMode('signup')}
                            emailPlaceholder={t('login.emailPlaceholder')}
                            passwordPlaceholder={t('login.passwordPlaceholder')}
                            saveEmailText={t('login.saveEmail')}
                            signInButtonText={t('login.signInButton')}
                            noAccountText={t('login.noAccount')}
                            signUpLinkText={t('login.signUpButton')}
                        />
                    ) : (
                        <SignupForm
                            name={name}
                            email={email}
                            password={password}
                            confirmPassword={confirmPassword}
                            isLoading={isLoading}
                            onNameChange={setName}
                            onEmailChange={setEmail}
                            onPasswordChange={setPassword}
                            onConfirmPasswordChange={setConfirmPassword}
                            onSubmit={handleSignup}
                            onSwitchToLogin={() => setMode('login')}
                            namePlaceholder={t('login.namePlaceholder')}
                            emailPlaceholder={t('login.emailPlaceholder')}
                            passwordPlaceholder={t('login.passwordPlaceholder')}
                            confirmPasswordPlaceholder={t('login.confirmPasswordPlaceholder')}
                            signUpButtonText={t('login.signUpButton')}
                            hasAccountText={t('login.hasAccount')}
                            signInLinkText={t('login.signInButton')}
                        />
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
