import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/design-system';
import { useAuthStore } from '../../store/authStore';
import { Post } from '../../store/communityStore';
import { translationService } from '../../utils/translationService';

interface PostCardProps {
    post: Post;
    onPress?: () => void;
    onOptionsPress?: (post: Post, position: { x: number; y: number }) => void;
}

export const PostCard = ({ post, onPress, onOptionsPress }: PostCardProps) => {
    const { t, i18n } = useTranslation();
    const { isPremium, user } = useAuthStore();
    const [translatedContent, setTranslatedContent] = useState<string | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const menuButtonRef = useRef<View>(null);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
    };

    const handleTranslate = async () => {
        if (!isPremium) {
            Alert.alert(
                t('common.premiumRequired', 'Premium Required'),
                t('common.upgradeToPremium', 'This feature is for Premium users only.'),
                [
                    { text: t('common.cancel', 'Cancel'), style: 'cancel' },
                    { text: t('common.ok', 'OK'), onPress: () => console.log('Navigate to subscription') }
                ]
            );
            return;
        }

        if (translatedContent) {
            setTranslatedContent(null); // Toggle off
            return;
        }

        setIsTranslating(true);
        try {
            const result = await translationService.translate(post.content, i18n.language);
            setTranslatedContent(result);
        } catch (error) {
            Alert.alert(t('common.error', 'Error'), t('common.translationFailed', 'Translation failed.'));
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.authorInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{post.authorName.charAt(0)}</Text>
                    </View>
                    <View>
                        <Text style={styles.author}>{post.authorName}</Text>
                        <Text style={styles.time}>{formatDate(post.createdAt)}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    ref={menuButtonRef}
                    onPress={() => {
                        menuButtonRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
                            onOptionsPress?.(post, { x, y: y + height });
                        });
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{ padding: 4 }}
                >
                    <MaterialIcons name="more-vert" size={24} color={COLORS.text.tertiary} />
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.content} numberOfLines={3}>{translatedContent || post.content}</Text>

            {translatedContent && (
                <Text style={styles.translationIndicator}>
                    <Ionicons name="language" size={12} color={COLORS.primary[500]} /> Translated by AI
                </Text>
            )}

            {post.imageUrl && (
                <Image source={{ uri: post.imageUrl }} style={styles.image} />
            )}

            <View style={styles.footer}>
                <View style={styles.statContainer}>
                    <View style={styles.stat}>
                        <MaterialIcons name="chat-bubble-outline" size={16} color={COLORS.text.tertiary} />
                        <Text style={styles.statText}>{post.commentCount || 0}</Text>
                    </View>
                    <View style={styles.stat}>
                        <MaterialIcons name="favorite-border" size={16} color={COLORS.text.tertiary} />
                        <Text style={styles.statText}>{post.likes || 0}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.translateButton} onPress={handleTranslate} disabled={isTranslating}>
                    {isTranslating ? (
                        <ActivityIndicator size="small" color={COLORS.primary[500]} />
                    ) : (
                        <>
                            <Ionicons name="language-outline" size={16} color={COLORS.primary[500]} />
                            <Text style={styles.translateText}>
                                {translatedContent ? t('common.showOriginal', 'Original') : t('common.translate', 'Translate')}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: COLORS.primary[600],
        fontWeight: 'bold',
        fontSize: 16,
    },
    author: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    time: {
        fontSize: 12,
        color: COLORS.text.tertiary,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: 4,
    },
    content: {
        fontSize: 14,
        color: COLORS.text.secondary,
        lineHeight: 20,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: RADIUS.md,
        marginTop: 12,
        backgroundColor: '#F1F3F5',
    },
    footer: {
        flexDirection: 'row',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F3F5',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statContainer: {
        flexDirection: 'row',
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    statText: {
        fontSize: 12,
        color: COLORS.text.tertiary,
        marginLeft: 4,
    },
    translateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary[50],
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    translateText: {
        fontSize: 12,
        color: COLORS.primary[600],
        fontWeight: '600',
    },
    translationIndicator: {
        fontSize: 11,
        color: COLORS.primary[500],
        marginBottom: 8,
        fontStyle: 'italic',
    },
});
