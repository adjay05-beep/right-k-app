
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/design-system';
import { analyzeMailImage, OCRResult } from '../../utils/ocrService';

export default function MailScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [image, setImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<OCRResult | null>(null);
    const [showRaw, setShowRaw] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(t('common.error'), t('mail.permissionRequired'));
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Allow cropping
            quality: 1, // High quality for OCR
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            handleAnalyze(result.assets[0].uri);
        }
    };

    const handleAnalyze = async (uri: string) => {
        setAnalyzing(true);
        setResult(null);
        try {
            const realResult = await analyzeMailImage(uri);
            setResult(realResult);
        } catch (error) {
            Alert.alert(t('common.error'), t('mail.analyzeError'));
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('mail.title')}
                subtitle={t('mail.subtitle')}
                colors={[COLORS.secondary[700], COLORS.secondary[800]]} // Slate Theme
            />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Image Preview / Placeholder */}
                <View style={[styles.imageContainer, !image && styles.imagePlaceholder]}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.placeholderContent}>
                            <MaterialIcons name="cloud-upload" size={48} color={COLORS.text.tertiary} />
                            <Text style={styles.placeholderText}>{t('mail.instruction')}</Text>
                        </View>
                    )}
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                    <Button
                        title={t('mail.btn_gallery')}
                        onPress={pickImage}
                        variant="primary"
                        style={{ flex: 1 }}
                        icon={<MaterialIcons name="photo-library" size={20} color={COLORS.white} />}
                        loading={analyzing}
                    />
                </View>

                {/* Analysis Result */}
                {analyzing && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary[600]} />
                        <Text style={styles.loadingText}>{t('mail.analyzing')}</Text>
                    </View>
                )}

                {result && !analyzing && (
                    <View>
                        <Card style={
                            result.category === 'DANGER' ? styles.resultDanger : styles.resultSafe
                        }>
                            <View style={styles.resultHeader}>
                                <MaterialIcons
                                    name={result.category === 'DANGER' ? "warning" : "check-circle"}
                                    size={28}
                                    color={result.category === 'DANGER' ? COLORS.error.main : COLORS.success.main}
                                />
                                <View style={{ marginLeft: SPACING.md, flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={[styles.resultTitle, result.category === 'DANGER' ? styles.textDanger : styles.textSafe]}>
                                            {result.category === 'DANGER' ? t('mail.danger_title') : t('mail.safe_title')}
                                        </Text>
                                        <View style={[styles.confidenceBadge, { backgroundColor: result.confidence > 0.8 ? COLORS.success.light : COLORS.warning.light }]}>
                                            <Text style={styles.confidenceText}>{t('mail.match', { percent: Math.round(result.confidence * 100) })}</Text>
                                        </View>
                                    </View>
                                    {result.title && <Text style={styles.docTitle}>{result.title}</Text>}
                                </View>
                            </View>

                            {/* Digital Receipt Design */}
                            <View style={styles.receiptContainer}>
                                <View style={styles.receiptRow}>
                                    <Text style={styles.receiptLabel}>{t('mail.receipt.amount')}</Text>
                                    <Text style={styles.receiptAmount}>{result.amount || '-'}</Text>
                                </View>
                                <View style={styles.receiptDivider} />
                                <View style={styles.receiptRowSmall}>
                                    <Text style={styles.receiptLabelSmall}>{t('mail.receipt.dueDate')}</Text>
                                    <Text style={styles.receiptValue}>{result.dueDate || '-'}</Text>
                                </View>
                                <View style={styles.receiptRowSmall}>
                                    <Text style={styles.receiptLabelSmall}>{t('mail.receipt.paymentInfo')}</Text>
                                    <Text style={styles.receiptValue}>{result.paymentInfo || '-'}</Text>
                                </View>
                            </View>

                            <Text style={styles.resultDesc}>
                                {result.summary}
                            </Text>

                            {result.keywords.length > 0 && (
                                <View style={styles.keywordBox}>
                                    <Text style={styles.keywordTitle}>{t('mail.keyword_match')}:</Text>
                                    <View style={styles.keywordList}>
                                        {result.keywords.map((k, i) => (
                                            <View key={i} style={styles.keywordBadge}>
                                                <Text style={styles.keywordText}>{k}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </Card>

                        {/* Raw Text Toggle */}
                        <TouchableOpacity
                            style={styles.rawTextToggle}
                            onPress={() => setShowRaw(!showRaw)}
                        >
                            <MaterialIcons name={showRaw ? "expand-less" : "code"} size={20} color={COLORS.text.secondary} />
                            <Text style={styles.rawTextToggleLabel}>{showRaw ? t('mail.hideRaw') : t('mail.viewRaw')}</Text>
                        </TouchableOpacity>

                        {showRaw && (
                            <View style={styles.rawTextContainer}>
                                <Text style={styles.rawText}>{result.rawText}</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.lg,
        paddingTop: 120, // Clear absolute header
    },
    imageContainer: {
        width: '100%',
        height: 250,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        marginBottom: SPACING.lg,
        backgroundColor: COLORS.surface,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
            android: { elevation: 4 },
        }),
    },
    imagePlaceholder: {
        backgroundColor: COLORS.secondary[100],
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.secondary[300],
        borderStyle: 'dashed',
    },
    placeholderContent: {
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    placeholderText: {
        ...TYPOGRAPHY.body,
        marginTop: SPACING.md,
        color: COLORS.text.tertiary,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: SPACING.lg,
    },
    loadingText: {
        ...TYPOGRAPHY.body,
        marginTop: SPACING.md,
        color: COLORS.text.secondary,
    },
    resultSafe: {
        backgroundColor: COLORS.success.light,
        borderWidth: 1,
        borderColor: COLORS.success.main,
    },
    resultDanger: {
        backgroundColor: COLORS.error.light,
        borderWidth: 1,
        borderColor: COLORS.error.main,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    resultTitle: {
        ...TYPOGRAPHY.h2,
        marginLeft: SPACING.sm,
    },
    textSafe: {
        color: COLORS.success.dark,
    },
    textDanger: {
        color: COLORS.error.dark,
    },
    resultDesc: {
        ...TYPOGRAPHY.body,
        color: COLORS.text.primary,
        marginBottom: SPACING.lg,
    },
    keywordBox: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: SPACING.md,
    },
    keywordTitle: {
        ...TYPOGRAPHY.caption,
        fontWeight: 'bold',
        marginBottom: SPACING.sm,
    },
    keywordList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    keywordBadge: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    keywordText: {
        ...TYPOGRAPHY.caption,
        fontWeight: '600',
        color: COLORS.text.secondary,
    },
    docTitle: {
        ...TYPOGRAPHY.body,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginTop: 2,
    },
    detailsContainer: {
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: RADIUS.sm,
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        paddingBottom: 4,
    },
    detailLabel: {
        ...TYPOGRAPHY.caption,
        color: COLORS.text.secondary,
        fontWeight: 'bold',
    },
    detailValue: {
        ...TYPOGRAPHY.body,
        fontWeight: '500',
        color: COLORS.text.primary,
        flex: 1,
        textAlign: 'right',
        marginLeft: SPACING.sm,
    },
    detailValueAmount: {
        ...TYPOGRAPHY.h3,
        color: COLORS.error.main,
        fontWeight: 'bold',
    },
    detailValueDate: {
        ...TYPOGRAPHY.body,
        color: COLORS.primary[700],
        fontWeight: 'bold',
    },
    receiptContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginVertical: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    receiptRowSmall: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    receiptLabel: {
        fontSize: 14,
        color: COLORS.text.secondary,
        fontWeight: '600',
    },
    receiptLabelSmall: {
        fontSize: 13,
        color: COLORS.text.tertiary,
    },
    receiptAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    receiptValue: {
        fontSize: 14,
        color: COLORS.text.primary,
        fontWeight: '500',
    },
    receiptDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.sm,
        borderStyle: 'dashed',
        borderWidth: 0.5,
    },
    confidenceBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    confidenceText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.text.secondary,
    },
    rawTextToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
    },
    rawTextToggleLabel: {
        marginLeft: SPACING.xs,
        color: COLORS.text.secondary,
        fontSize: 14,
        fontWeight: '500',
    },
    rawTextContainer: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginTop: SPACING.xs,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    rawText: {
        fontSize: 11,
        color: COLORS.text.tertiary,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
});
