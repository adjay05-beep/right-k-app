import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { NoticeCard } from '../../components/ui/NoticeCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { VisaDropdown } from '../../components/visa/VisaDropdown';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/design-system';

export default function VisaDocumentsScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [selectedVisaCode, setSelectedVisaCode] = useState<string>('E-7-4');

    // Get selected visa details
    const docs = t(`visaTypes.${selectedVisaCode}.requiredDocuments`, { returnObjects: true });

    const isValidDocs = docs && typeof docs === 'object' && !Array.isArray(docs) && 'personal' in docs;
    const requiredDocs = isValidDocs ? (docs as { personal: string[], company: string[] }) : { personal: [], company: [] };

    return (
        <View style={styles.container}>
            <ScreenHeader title={t('dashboard.docs')} onBack={() => router.back()} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <NoticeCard variant="info" icon="gavel" style={{ marginBottom: SPACING.lg }}>
                    {t('visaDocs.notice')}
                </NoticeCard>

                <View style={{ marginBottom: SPACING.lg }}>
                    <VisaDropdown selectedVisaCode={selectedVisaCode} onSelect={setSelectedVisaCode} />
                </View>

                <Card style={styles.docsCard}>
                    <View style={styles.visaHeader}>
                        <View style={styles.visaBadge}>
                            <Text style={styles.visaBadgeText}>{selectedVisaCode}</Text>
                        </View>
                        <Text style={styles.visaName}>{t(`visaTypes.${selectedVisaCode}.name`)}</Text>
                    </View>

                    {requiredDocs.personal.length > 0 || requiredDocs.company.length > 0 ? (
                        <View style={styles.docsGrid}>
                            <View style={styles.docsSection}>
                                <View style={styles.docsSectionHeader}>
                                    <MaterialIcons name="person" size={16} color={COLORS.primary[600]} />
                                    <Text style={styles.docsSubTitle}>{t('visaDocs.personal')}</Text>
                                </View>
                                {requiredDocs.personal.length > 0 ? (
                                    requiredDocs.personal.map((doc, idx) => (
                                        <View key={idx} style={styles.visaNoteRow}>
                                            <MaterialIcons name="check-box-outline-blank" size={14} color={COLORS.primary[400]} />
                                            <Text style={styles.visaNoteText}>{doc}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.emptyText}>-</Text>
                                )}
                            </View>

                            <View style={styles.docsSection}>
                                <View style={styles.docsSectionHeader}>
                                    <MaterialIcons name="business" size={16} color={COLORS.primary[600]} />
                                    <Text style={styles.docsSubTitle}>{t('visaDocs.company')}</Text>
                                </View>
                                {requiredDocs.company.length > 0 ? (
                                    requiredDocs.company.map((doc, idx) => (
                                        <View key={idx} style={styles.visaNoteRow}>
                                            <MaterialIcons name="check-box-outline-blank" size={14} color={COLORS.primary[400]} />
                                            <Text style={styles.visaNoteText}>{doc}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.emptyText}>-</Text>
                                )}
                            </View>
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>{t('common.noData', '상세 준비 서류 정보가 없습니다.')}</Text>
                        </View>
                    )}
                </Card>

                <View style={{ marginTop: 10 }}>
                    <NoticeCard
                        variant="error"
                        title={t('visaDocs.legalDisclaimer')}
                    >
                        {t('visaDocs.legalContent')}
                    </NoticeCard>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    scrollContent: {
        padding: SPACING.md,
        paddingTop: 120, // Clear absolute header
        paddingBottom: 40,
    },
    visaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 12,
    },
    visaBadge: {
        backgroundColor: COLORS.primary[100],
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
        marginRight: 8,
    },
    visaBadgeText: {
        color: COLORS.primary[700],
        fontWeight: 'bold',
        fontSize: 12,
    },
    visaName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    docsGrid: {
        flexDirection: 'column',
        gap: 24,
    },
    docsSection: {
    },
    docsSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    docsSubTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#444',
    },
    docsCard: {
        backgroundColor: '#fff',
        marginBottom: 16,
        padding: SPACING.lg,
        ...SHADOWS.sm,
    },
    visaNoteRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 8,
        paddingLeft: 4,
    },
    visaNoteText: {
        fontSize: 14,
        color: '#555',
        flex: 1,
        lineHeight: 20,
    },
    emptyText: {
        fontSize: 13,
        color: '#999',
        fontStyle: 'italic',
        paddingLeft: 10,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
    emptyStateText: {
        color: '#888',
    }
});
