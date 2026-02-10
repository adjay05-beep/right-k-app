import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/design-system';
import { useCommunityStore } from '../../store/communityStore';
import { useVisaStore } from '../../store/visaStore';
import { communityService } from '../../utils/communityService';
import { Button } from '../ui/Button';
import { TextField } from '../ui/TextField';

interface CreatePostModalProps {
    visible: boolean;
    onClose: () => void;
    communityId: string;
    authorId: string;
    authorName: string;
}

export const CreatePostModal = ({
    visible,
    onClose,
    communityId,
    authorId,
    authorName
}: CreatePostModalProps) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addPost } = useCommunityStore();
    const { country: userCountry } = useVisaStore();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert(t('common.error'), t('common.fillAllFields'));
            return;
        }

        setIsSubmitting(true);
        setIsSubmitting(true);
        try {
            // If posting from "All Threads", default to user's nationality, or fallback to 'GLOBAL'
            let targetCommunityId = communityId;
            if (communityId === 'ALL') {
                targetCommunityId = userCountry || 'GLOBAL';
            }

            await communityService.createPost({
                communityId: targetCommunityId,
                authorId,
                authorName,
                title,
                content,
                imageUri: imageUri || undefined,
            });

            // For immediate local feedback, we could manually construct a post object
            // but for now, let's just close and refresh
            onClose();
            setTitle('');
            setContent('');
            setImageUri(null);
            Alert.alert(t('common.ok'), t('visaStatus.savedSuccess')); // Reusing success msg
        } catch (error: any) {
            console.error('Failed to create post:', error);
            Alert.alert(t('common.error'), error.message || t('common.authFailed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <MaterialIcons name="close" size={24} color={COLORS.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('community.createPost')}</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.content}>
                    <TextField
                        label={t('community.postTitle')}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Title"
                    />
                    <TextField
                        label={t('community.postContent')}
                        value={content}
                        onChangeText={setContent}
                        placeholder="Share your experience..."
                        multiline
                        style={{ height: 150 }}
                    />

                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <MaterialIcons name="add-a-photo" size={32} color={COLORS.text.tertiary} />
                                <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        title={t('community.postButton')}
                        onPress={handleSave}
                        loading={isSubmitting}
                        fullWidth
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: 60,
        paddingBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F3F5',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    content: {
        padding: SPACING.lg,
    },
    imagePicker: {
        width: '100%',
        height: 200,
        borderRadius: RADIUS.md,
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        borderStyle: 'dashed',
        marginTop: SPACING.md,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        alignItems: 'center',
    },
    imagePlaceholderText: {
        color: COLORS.text.tertiary,
        marginTop: 8,
        fontSize: 14,
    },
    footer: {
        padding: SPACING.lg,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: '#F1F3F5',
    },
});
