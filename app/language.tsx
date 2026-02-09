import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const LANGUAGES = [
    { code: 'ko', label: '한국어', icon: '🇰🇷' },
    { code: 'zh', label: '中文', icon: '🇨🇳' },
    { code: 'vi', label: 'Tiếng Việt', icon: '🇻🇳' },
    { code: 'en', label: 'English', icon: '🇺🇸' },
    { code: 'th', label: 'ภาษาไทย', icon: '🇹🇭' },
    { code: 'uz', label: 'O\'zbek', icon: '🇺🇿' },
];

export default function LanguageScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();

    const handleSelectLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
        router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('language.selectLanguage')}</Text>
                <Text style={styles.subtitle}>{t('language.subtitle')}</Text>
            </View>

            <View style={styles.gridContainer}>
                {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                        key={lang.code}
                        style={styles.languageButton}
                        onPress={() => handleSelectLanguage(lang.code)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.icon}>{lang.icon}</Text>
                        <Text style={styles.languageLabel}>{lang.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    languageButton: {
        width: '48%',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    icon: {
        fontSize: 32,
        marginBottom: 8,
    },
    languageLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#334155',
    },
});
