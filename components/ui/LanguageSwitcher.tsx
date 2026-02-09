import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/design-system';

const LANGUAGES = [
    { code: 'ko', label: '한국어', icon: '🇰🇷' },
    { code: 'zh', label: '中文', icon: '🇨🇳' },
    { code: 'vi', label: 'Tiếng Việt', icon: '🇻🇳' },
    { code: 'en', label: 'English', icon: '🇺🇸' },
    { code: 'th', label: 'ภาษาไทย', icon: '🇹🇭' },
    { code: 'uz', label: 'O\'zbek', icon: '🇺🇿' },
];

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);

    const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

    const handleSelectLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setModalVisible(false);
    };

    return (
        <>
            {/* Current Language Button */}
            <TouchableOpacity
                style={styles.languageButton}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <View style={styles.buttonContent}>
                    <MaterialIcons name="language" size={18} color={COLORS.primary[600]} />
                    <Text style={styles.languageCode}>{currentLanguage.code.toUpperCase()}</Text>
                    <Text style={styles.languageIcon}>{currentLanguage.icon}</Text>
                    <MaterialIcons name="expand-more" size={16} color={COLORS.primary[600]} />
                </View>
            </TouchableOpacity>

            {/* Language Selection Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <BlurView intensity={90} tint="dark" style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Language</Text>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    style={styles.closeButton}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <MaterialIcons name="close" size={24} color={COLORS.text.secondary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.languageGrid}>
                                {LANGUAGES.map((lang) => {
                                    const isSelected = lang.code === i18n.language;
                                    return (
                                        <TouchableOpacity
                                            key={lang.code}
                                            style={[
                                                styles.languageOption,
                                                isSelected && styles.languageOptionSelected
                                            ]}
                                            onPress={() => handleSelectLanguage(lang.code)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.optionIcon}>{lang.icon}</Text>
                                            <Text style={[
                                                styles.optionLabel,
                                                isSelected && styles.optionLabelSelected
                                            ]}>
                                                {lang.label}
                                            </Text>
                                            {isSelected && (
                                                <MaterialIcons name="check-circle" size={20} color={COLORS.primary[500]} />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </BlurView>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    // Current Language Button (Top-right corner)
    languageButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 1.5,
        borderColor: COLORS.primary[500],
        borderRadius: RADIUS.full,
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        ...SHADOWS.md,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    languageIcon: {
        fontSize: 14,
        marginLeft: 2,
    },
    languageCode: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary[700],
    },

    // Modal Overlay
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        maxWidth: 400,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
    },
    modalContent: {
        backgroundColor: COLORS.background,
        padding: SPACING.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text.primary,
    },
    closeButton: {
        padding: SPACING.xs,
    },

    // Language Grid
    languageGrid: {
        gap: SPACING.sm,
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondary[50],
        borderWidth: 1,
        borderColor: COLORS.secondary[200],
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        gap: SPACING.md,
    },
    languageOptionSelected: {
        backgroundColor: COLORS.primary[50],
        borderColor: COLORS.primary[500],
        borderWidth: 2,
    },
    optionIcon: {
        fontSize: 28,
    },
    optionLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    optionLabelSelected: {
        color: COLORS.primary[700],
    },
});
