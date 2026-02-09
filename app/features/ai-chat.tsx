import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { COLORS, RADIUS, SPACING } from '../../constants/design-system';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
};

export default function AIChatScreen() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: t('aiChat.welcomeMessage'),
            sender: 'ai',
            timestamp: new Date(),
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Construct dynamic system prompt with current language
        const currentLang = i18n.language === 'ko' ? '한국어' :
            i18n.language === 'en' ? 'English' :
                i18n.language === 'vi' ? 'Tiếng Việt' :
                    i18n.language === 'th' ? 'ภาษาไทย' :
                        i18n.language === 'uz' ? 'Oʻzbekcha' :
                            i18n.language === 'zh' ? '中文' :
                                i18n.language === 'tl' ? 'Tagalog' :
                                    i18n.language === 'mn' ? 'Монгол' : '한국어';

        const systemPrompt = `${t('aiChat.systemPrompt')} ${currentLang}`;

        try {
            // Updated to fetch from OpenAI
            // Note: In production, this call should go through a backend proxy to protect the API Key.
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...messages.map(m => ({
                            role: m.sender === 'user' ? 'user' : 'assistant',
                            content: m.text
                        })),
                        { role: "user", content: userMsg.text }
                    ],
                    max_tokens: 500,
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const aiText = data.choices[0].message.content.trim();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: aiText,
                sender: 'ai',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error(error);
            Alert.alert(t('aiChat.error'), t('aiChat.fetchError'));
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: t('aiChat.responseError'),
                sender: 'ai',
                timestamp: new Date(),
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader title={t('aiChat.title')} onBack={() => router.back()} />

            {/* Disclaimer Banner */}
            <View style={styles.disclaimerBanner}>
                <MaterialIcons name="info-outline" size={14} color={COLORS.warning.dark} />
                <Text style={styles.disclaimerText}>
                    {t('aiChat.disclaimer')}
                </Text>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.chatContainer}
                contentContainerStyle={styles.chatContent}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map((msg) => (
                    <View key={msg.id} style={[
                        styles.messageBubble,
                        msg.sender === 'user' ? styles.userBubble : styles.aiBubble
                    ]}>
                        <Text style={[
                            styles.messageText,
                            msg.sender === 'user' ? styles.userText : styles.aiText
                        ]}>{msg.text}</Text>
                        <Text style={styles.timestamp}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                ))}

                {isTyping && (
                    <View style={[styles.messageBubble, styles.aiBubble]}>
                        <Text style={styles.typingText}>{t('aiChat.typing')}</Text>
                    </View>
                )}
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder={t('aiChat.placeholder')}
                        placeholderTextColor={COLORS.text.tertiary}
                        returnKeyType="send"
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || isTyping}
                    >
                        <MaterialIcons name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    disclaimerBanner: {
        backgroundColor: COLORS.warning.light,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.warning.dark,
        marginTop: 100, // Clear the absolute header
    },
    disclaimerText: {
        fontSize: 12,
        color: COLORS.warning.dark,
        marginLeft: SPACING.xs,
        flex: 1,
        textAlign: 'center',
    },
    chatContainer: {
        flex: 1,
    },
    chatContent: {
        padding: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: COLORS.primary[500],
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.surface,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    userText: {
        color: 'white',
    },
    aiText: {
        color: COLORS.text.primary,
    },
    timestamp: {
        fontSize: 10,
        color: 'rgba(0,0,0,0.4)',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    typingText: {
        fontSize: 12,
        color: COLORS.text.tertiary,
        fontStyle: 'italic',
    },
    inputArea: {
        flexDirection: 'row',
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.full,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        fontSize: 15,
        color: COLORS.text.primary,
        maxHeight: 100,
        marginRight: SPACING.sm,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: COLORS.text.tertiary,
    },
});
