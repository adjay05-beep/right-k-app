import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { NoticeCard } from '../../components/ui/NoticeCard';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { COLORS, RADIUS, SPACING } from '../../constants/design-system';
import { VISA_TYPES } from '../../constants/visa-policy-data';

export default function VisaDocumentsScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const visasWithDocs = Object.values(VISA_TYPES).filter(v => v.requiredDocuments);

    return (
        <View style={styles.container}>
            <ScreenHeader title={t('dashboard.docs')} onBack={() => router.back()} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <NoticeCard variant="info" icon="gavel">
                    {t('visaDocs.notice')}
                </NoticeCard>

                {visasWithDocs.map(visa => (
                    <Card key={visa.code} style={styles.docsCard}>
                        <View style={styles.visaHeader}>
                            <View style={styles.visaBadge}>
                                <Text style={styles.visaBadgeText}>{visa.code}</Text>
                            </View>
                            <Text style={styles.visaName}>{visa.name}</Text>
                        </View>

                        <View style={styles.docsGrid}>
                            <View style={styles.docsSection}>
                                <View style={styles.docsSectionHeader}>
                                    <MaterialIcons name="person" size={16} color={COLORS.primary[600]} />
                                    <Text style={styles.docsSubTitle}>{t('visaDocs.personal')}</Text>
                                </View>
                                {visa.requiredDocuments?.personal.map((doc, idx) => (
                                    <View key={idx} style={styles.visaNoteRow}>
                                        <MaterialIcons name="check-box-outline-blank" size={14} color={COLORS.primary[400]} />
                                        <Text style={styles.visaNoteText}>{doc}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.docsSection}>
                                <View style={styles.docsSectionHeader}>
                                    <MaterialIcons name="business" size={16} color={COLORS.primary[600]} />
                                    <Text style={styles.docsSubTitle}>{t('visaDocs.company')}</Text>
                                </View>
                                {visa.requiredDocuments?.company.map((doc, idx) => (
                                    <View key={idx} style={styles.visaNoteRow}>
                                        <MaterialIcons name="check-box-outline-blank" size={14} color={COLORS.primary[400]} />
                                        <Text style={styles.visaNoteText}>{doc}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </Card>
                ))}

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
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    docsGrid: {
        flexDirection: 'column', // Stack vertically for better I18n/Mobile safety
        gap: 16,
    },
    docsSection: {
        // flex: 1, // Removed to prevent overlapping
    },
    docsSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 4,
    },
    docsSubTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#555',
    },
    docsCard: {
        backgroundColor: '#fff',
        marginBottom: 16,
        padding: SPACING.md,
    },
    visaNoteRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        marginBottom: 4,
    },
    visaNoteText: {
        fontSize: 12,
        color: '#666',
        flex: 1,
        lineHeight: 16,
    },


});
