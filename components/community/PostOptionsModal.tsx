import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/design-system';

interface PostOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    isAuthor: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onReport: () => void;
    onBlock: () => void;
    position?: { x: number; y: number };
}

export const PostOptionsModal = ({
    visible,
    onClose,
    isAuthor,
    onEdit,
    onDelete,
    onReport,
    onBlock,
    position
}: PostOptionsModalProps) => {
    const { t } = useTranslation();
    const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

    // Default position if not provided
    const top = position ? position.y : 0;
    const right = position ? windowWidth - position.x - 10 : SPACING.md;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <View style={[
                        styles.menuContainer,
                        {
                            top: top,
                            right: right,
                        }
                    ]}>
                        {isAuthor ? (
                            <>
                                <TouchableOpacity style={styles.optionItem} onPress={onEdit}>
                                    <MaterialIcons name="edit" size={20} color={COLORS.text.primary} />
                                    <Text style={styles.optionText}>{t('common.edit', 'Edit')}</Text>
                                </TouchableOpacity>
                                <View style={styles.separator} />
                                <TouchableOpacity style={styles.optionItem} onPress={onDelete}>
                                    <MaterialIcons name="delete-outline" size={20} color={COLORS.error.main} />
                                    <Text style={[styles.optionText, { color: COLORS.error.main }]}>{t('common.delete', 'Delete')}</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity style={styles.optionItem} onPress={onReport}>
                                    <MaterialIcons name="flag" size={20} color={COLORS.text.primary} />
                                    <Text style={styles.optionText}>{t('common.report', 'Report')}</Text>
                                </TouchableOpacity>
                                <View style={styles.separator} />
                                <TouchableOpacity style={styles.optionItem} onPress={onBlock}>
                                    <MaterialIcons name="block" size={20} color={COLORS.text.primary} />
                                    <Text style={styles.optionText}>{t('common.block', 'Block')}</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)', // Lighter overlay
    },
    menuContainer: {
        position: 'absolute',
        width: 150,
        backgroundColor: 'white',
        borderRadius: RADIUS.md,
        paddingVertical: 4,
        ...SHADOWS.md,
        elevation: 5,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: SPACING.md,
        gap: 12,
    },
    optionText: {
        ...TYPOGRAPHY.body,
        fontSize: 14,
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#F1F3F5',
        marginHorizontal: 10,
    }
});
