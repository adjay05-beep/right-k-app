import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/design-system';

export default function TaxGuideScreen() {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={t('tax.title')}
                subtitle={t('tax.subtitle')}
                colors={['#6366f1', '#4338ca']} // Indigo Theme
            />

            <ScrollView contentContainerStyle={styles.content}>

                <Card style={styles.highlightCard} variant="elevated">
                    <Text style={styles.highlightTitle}>{t('tax.whatIsIt')}</Text>
                    <Text style={styles.highlightDesc}>
                        {t('tax.whatIsItDesc').replace('<bold>', '').replace('</bold>', '')}
                    </Text>
                </Card>

                <Text style={styles.sectionTitle}>{t('tax.timelines')}</Text>
                <Card>
                    <View style={styles.timeline}>
                        <TimelineItem
                            date={t('tax.timeline_1_date')}
                            title={t('tax.timeline_1_title')}
                            desc={t('tax.timeline_1_desc')}
                            active
                        />
                        <TimelineItem
                            date={t('tax.timeline_2_date')}
                            title={t('tax.timeline_2_title')}
                            desc={t('tax.timeline_2_desc')}
                        />
                        <TimelineItem
                            date={t('tax.timeline_3_date')}
                            title={t('tax.timeline_3_title')}
                            desc={t('tax.timeline_3_desc')}
                            isLast
                        />
                    </View>
                </Card>
            </ScrollView>
        </View>
    );
}

const TimelineItem = ({ date, title, desc, active = false, isLast = false }: { date: string, title: string, desc: string, active?: boolean, isLast?: boolean }) => (
    <View style={styles.timelineItem}>
        {/* Left Indicator */}
        <View style={styles.indicatorContainer}>
            <View style={[styles.dot, active ? styles.dotActive : styles.dotInactive]} />
            {!isLast && <View style={styles.line} />}
        </View>

        {/* Content */}
        <View style={[styles.itemContent, isLast && { paddingBottom: 0 }]}>
            <Text style={[styles.dateText, active ? styles.textActive : styles.textInactive]}>{date}</Text>
            <Text style={styles.itemTitle}>{title}</Text>
            <Text style={styles.itemDesc}>{desc}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.lg,
    },
    highlightCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#6366f1',
    },
    highlightTitle: {
        ...TYPOGRAPHY.h3,
        marginBottom: SPACING.sm,
    },
    highlightDesc: {
        ...TYPOGRAPHY.body,
        lineHeight: 22,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        marginBottom: SPACING.md,
        marginTop: SPACING.lg,
    },
    timeline: {
        paddingLeft: SPACING.sm,
    },
    timelineItem: {
        flexDirection: 'row',
    },
    indicatorContainer: {
        alignItems: 'center',
        marginRight: SPACING.md,
        width: 20,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 6,
    },
    dotActive: {
        backgroundColor: '#6366f1',
    },
    dotInactive: {
        backgroundColor: COLORS.secondary[300],
    },
    line: {
        width: 2,
        flex: 1,
        backgroundColor: COLORS.secondary[200],
        marginVertical: 4,
    },
    itemContent: {
        flex: 1,
        paddingBottom: SPACING.xl,
    },
    dateText: {
        ...TYPOGRAPHY.caption,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    textActive: {
        color: '#6366f1',
    },
    textInactive: {
        color: COLORS.text.tertiary,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginBottom: 4,
    },
    itemDesc: {
        ...TYPOGRAPHY.caption,
        lineHeight: 20,
    },
});
