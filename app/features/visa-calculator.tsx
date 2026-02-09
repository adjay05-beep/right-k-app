import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { COLORS, SHADOWS, SPACING } from '../../constants/design-system';
import { calculateD10, calculateE74, calculateF27, calculateF5, D10Input, E74Input, F27Input, F5Input, VisaScore } from '../../utils/visaCalculator';


import { NoticeCard } from '../../components/ui/NoticeCard';
import { VISA_TYPES } from '../../constants/visa-policy-data';

type VisaType = 'E-7-4' | 'F-2-7' | 'D-10' | 'F-5' | 'ALL';

export default function VisaCalculatorScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState<VisaType>('E-7-4');
    const [result, setResult] = useState<VisaScore | null>(null);

    // E-7-4 State
    const [e74Data, setE74Data] = useState<E74Input>({
        income2YearAvg: 0,
        koreanLevel: 1,
        age: 25,
        currentWorkExperience: 0,
        recommendation: 'none',
        ruralWork: false,
        domesticDegree: false
    });

    // F-2-7 State
    const [f27Data, setF27Data] = useState<F27Input>({
        age: 25,
        education: 'bachelor',
        koreanLevel: 1,
        annualIncome: 0,
        kiipCompleted: false,
        extraPoints: 0
    });

    // D-10 State
    const [d10Data, setD10Data] = useState<D10Input>({
        age: 25,
        education: 'bachelor',
        koreanLevel: 1,
        recentWorkExperience: false,
        globalUniOrCorp: false,
        stemMajor: false
    });

    // F-5 State
    const [f5Data, setF5Data] = useState<F5Input>({
        annualIncome: 4500,
        track: 'generic'
    });

    useEffect(() => {
        calculateScore();
    }, [e74Data, f27Data, d10Data, f5Data, activeTab]);

    const calculateScore = () => {
        let res: VisaScore;
        if (activeTab === 'E-7-4') {
            res = calculateE74(e74Data);
        } else if (activeTab === 'F-2-7') {
            const f27Res = calculateF27(f27Data);
            res = { ...f27Res, details: { validYears: f27Res.validYears } };
        } else if (activeTab === 'D-10') {
            res = calculateD10(d10Data);
        } else if (activeTab === 'F-5') {
            res = calculateF5(f5Data);
        } else {
            res = { score: 0, pass: false };
        }
        setResult(res);
    };

    const TabButton = ({ type, label }: { type: VisaType, label: string }) => (
        <TouchableOpacity
            style={[styles.tabButton, activeTab === type && styles.tabButtonActive]}
            onPress={() => setActiveTab(type)}
        >
            <Text style={[styles.tabText, activeTab === type && styles.tabTextActive]}>{label}</Text>
        </TouchableOpacity>
    );

    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );

    const InputRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
        <View style={styles.inputRow}>
            {/* Using flex: 0.4 for label to give more space for inputs on small screens */}
            <Text style={[styles.inputLabel, { flex: 0.4 }]}>{label}</Text>
            <View style={[styles.inputControl, { flex: 0.6, justifyContent: 'flex-end' }]}>{children}</View>
        </View>
    );

    // Helper Inputs
    const NumberInput = ({ value, onChange, placeholder = '0', unit = '' }: any) => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
                style={styles.numberInput}
                keyboardType="numeric"
                value={value.toString()}
                onChangeText={(text) => onChange(Number(text.replace(/[^0-9]/g, '')))}
                placeholder={placeholder}
            />
            {unit ? <Text style={styles.unitText}>{unit}</Text> : null}
        </View>
    );

    const CheckBox = ({ checked, onChange, label }: any) => (
        <TouchableOpacity style={styles.checkboxRow} onPress={() => onChange(!checked)}>
            <MaterialIcons
                name={checked ? "check-box" : "check-box-outline-blank"}
                size={24}
                color={checked ? COLORS.primary[500] : '#ccc'}
            />
            <Text style={styles.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
    );

    const renderE74Inputs = () => (
        <>
            <Section title={t('visaCalc.e74.sectionEssential')}>
                <InputRow label={t('visaCalc.e74.incomeAvg')}>
                    <NumberInput
                        value={e74Data.income2YearAvg}
                        onChange={(v: number) => setE74Data({ ...e74Data, income2YearAvg: v })}
                        unit={t('visaCalc.common.incomeUnit')}
                    />
                </InputRow>
                <InputRow label={t('visaCalc.common.korean')}>
                    <View style={styles.segmentContainer}>
                        {[1, 2, 3, 4, 5, 6].map(level => (
                            <TouchableOpacity
                                key={level}
                                style={[styles.segmentBtn, e74Data.koreanLevel === level && styles.segmentBtnActive]}
                                onPress={() => setE74Data({ ...e74Data, koreanLevel: level })}
                            >
                                <Text style={[styles.segmentText, e74Data.koreanLevel === level && styles.segmentTextActive]}>
                                    {t('visaCalc.common.level', { level })}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </InputRow>
            </Section>

            <Section title={t('visaCalc.e74.sectionPoints')}>
                <InputRow label={t('visaCalc.common.age')}>
                    <NumberInput
                        value={e74Data.age}
                        onChange={(v: number) => setE74Data({ ...e74Data, age: v })}
                        unit={t('visaCalc.common.ageUnit')}
                    />
                </InputRow>
                <InputRow label={t('visaCalc.e74.workExp')}>
                    <NumberInput
                        value={e74Data.currentWorkExperience}
                        onChange={(v: number) => setE74Data({ ...e74Data, currentWorkExperience: v })}
                        unit={t('visaCalc.common.years')}
                    />
                </InputRow>
                <InputRow label={t('visaCalc.e74.recommendation')}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {(['none', 'central', 'local', 'company'] as const).map(opt => (
                            <TouchableOpacity
                                key={opt}
                                style={[styles.chip, e74Data.recommendation === opt && styles.chipActive]}
                                onPress={() => setE74Data({ ...e74Data, recommendation: opt })}
                            >
                                <Text style={[styles.chipText, e74Data.recommendation === opt && styles.chipTextActive]}>
                                    {opt === 'none' ? t('visaCalc.e74.recNone') :
                                        opt === 'central' ? t('visaCalc.e74.recCentral') :
                                            opt === 'local' ? t('visaCalc.e74.recLocal') : t('visaCalc.e74.recCompany')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </InputRow>
                <CheckBox
                    label={t('visaCalc.e74.rural')}
                    checked={e74Data.ruralWork}
                    onChange={(v: boolean) => setE74Data({ ...e74Data, ruralWork: v })}
                />
                <CheckBox
                    label={t('visaCalc.e74.domesticDegree')}
                    checked={e74Data.domesticDegree}
                    onChange={(v: boolean) => setE74Data({ ...e74Data, domesticDegree: v })}
                />
            </Section>
        </>
    );

    const renderF27Inputs = () => (
        <>
            <Section title={t('visaCalc.f27.sectionBasic')}>
                <InputRow label={t('visaCalc.common.age')}>
                    <NumberInput
                        value={f27Data.age}
                        onChange={(v: number) => setF27Data({ ...f27Data, age: v })}
                        unit={t('visaCalc.common.ageUnit')}
                    />
                </InputRow>
                <InputRow label={t('visaCalc.common.education')}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
                        {(['phd_stem', 'phd', 'master_stem', 'master', 'bachelor', 'associate'] as const).map(opt => (
                            <TouchableOpacity
                                key={opt}
                                style={[styles.chip, f27Data.education === opt && styles.chipActive]}
                                onPress={() => setF27Data({ ...f27Data, education: opt })}
                            >
                                <Text style={[styles.chipText, f27Data.education === opt && styles.chipTextActive]}>
                                    {opt.includes('phd') ? t('visaCalc.f27.phd') :
                                        opt.includes('master') ? t('visaCalc.f27.master') :
                                            opt === 'bachelor' ? t('visaCalc.f27.bachelor') : t('visaCalc.f27.associate')}
                                    {opt.includes('stem') ? ` ${t('visaCalc.f27.stem')}` : ''}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </InputRow>
                <InputRow label={t('visaCalc.common.income')}>
                    <NumberInput
                        value={f27Data.annualIncome}
                        onChange={(v: number) => setF27Data({ ...f27Data, annualIncome: v })}
                        unit={t('visaCalc.common.incomeUnit')}
                    />
                </InputRow>
                <InputRow label={t('visaCalc.common.korean')}>
                    <View style={styles.segmentContainer}>
                        {[1, 2, 3, 4, 5, 6].map(level => (
                            <TouchableOpacity
                                key={level}
                                style={[styles.segmentBtn, f27Data.koreanLevel === level && styles.segmentBtnActive]}
                                onPress={() => setF27Data({ ...f27Data, koreanLevel: level })}
                            >
                                <Text style={[styles.segmentText, f27Data.koreanLevel === level && styles.segmentTextActive]}>
                                    {t('visaCalc.common.level', { level })}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </InputRow>
            </Section>
            <Section title={t('visaCalc.f27.sectionBonus')}>
                <CheckBox
                    label={t('visaCalc.f27.kiip')}
                    checked={f27Data.kiipCompleted}
                    onChange={(v: boolean) => setF27Data({ ...f27Data, kiipCompleted: v })}
                />
                <InputRow label={t('visaCalc.f27.extraPoints')}>
                    <NumberInput
                        value={f27Data.extraPoints}
                        onChange={(v: number) => setF27Data({ ...f27Data, extraPoints: v })}
                        unit={t('visaCalc.common.points')}
                    />
                </InputRow>
            </Section>
        </>
    );

    const renderD10Inputs = () => (
        <>
            <Section title={t('visaCalc.f27.sectionBasic')}>
                <InputRow label={t('visaCalc.common.age')}>
                    <NumberInput
                        value={d10Data.age}
                        onChange={(v: number) => setD10Data({ ...d10Data, age: v })}
                        unit={t('visaCalc.common.ageUnit')}
                    />
                </InputRow>
                <InputRow label={t('visaCalc.common.education')}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {(['phd', 'master', 'bachelor', 'associate'] as const).map(opt => (
                            <TouchableOpacity
                                key={opt}
                                style={[styles.chip, d10Data.education === opt && styles.chipActive]}
                                onPress={() => setD10Data({ ...d10Data, education: opt })}
                            >
                                <Text style={[styles.chipText, d10Data.education === opt && styles.chipTextActive]}>
                                    {opt === 'phd' ? t('visaCalc.f27.phd') :
                                        opt === 'master' ? t('visaCalc.f27.master') :
                                            opt === 'bachelor' ? t('visaCalc.f27.bachelor') : t('visaCalc.f27.associate')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </InputRow>
            </Section>
            <Section title={t('visaCalc.f27.sectionBonus')}>
                <CheckBox
                    label={t('visaCalc.d10.recentWork')}
                    checked={d10Data.recentWorkExperience}
                    onChange={(v: boolean) => setD10Data({ ...d10Data, recentWorkExperience: v })}
                />
                <CheckBox
                    label={t('visaCalc.d10.globalWork')}
                    checked={d10Data.globalUniOrCorp}
                    onChange={(v: boolean) => setD10Data({ ...d10Data, globalUniOrCorp: v })}
                />
                <CheckBox
                    label={t('visaCalc.d10.stemMajor')}
                    checked={d10Data.stemMajor}
                    onChange={(v: boolean) => setD10Data({ ...d10Data, stemMajor: v })}
                />
                <InputRow label={t('visaCalc.d10.koreanOptional')}>
                    <View style={styles.segmentContainer}>
                        {[1, 2, 3, 4, 5, 6].map(level => (
                            <TouchableOpacity
                                key={level}
                                style={[styles.segmentBtn, d10Data.koreanLevel === level && styles.segmentBtnActive]}
                                onPress={() => setD10Data({ ...d10Data, koreanLevel: level })}
                            >
                                <Text style={[styles.segmentText, d10Data.koreanLevel === level && styles.segmentTextActive]}>
                                    {t('visaCalc.common.level', { level })}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </InputRow>
            </Section>
        </>
    );

    const renderF5Inputs = () => (
        <>
            <Section title={t('visaCalc.f5.sectionTrack')}>
                <View style={styles.segmentContainer}>
                    {[
                        { id: 'generic', label: t('visaCalc.f5.trackGeneric') },
                        { id: 'stem', label: t('visaCalc.f5.trackStem') },
                    ].map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.segmentBtn, f5Data.track === item.id && styles.segmentBtnActive]}
                            onPress={() => setF5Data({ ...f5Data, track: item.id as any })}
                        >
                            <Text style={[styles.segmentText, f5Data.track === item.id && styles.segmentTextActive]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Section>

            <Section title={t('visaCalc.common.income')}>
                <InputRow label={t('visaCalc.common.income')}>
                    <TextInput
                        style={styles.numberInput}
                        keyboardType="numeric"
                        value={String(f5Data.annualIncome)}
                        onChangeText={(v) => setF5Data({ ...f5Data, annualIncome: Number(v) || 0 })}
                        placeholder="4500"
                    />
                </InputRow>

                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>{t('visaCalc.common.gniPercent')}</Text>
                        <Text style={styles.progressValue}>{result?.score}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${Math.min(100, result?.score || 0)}%` },
                                (result?.score || 0) >= 100 ? { backgroundColor: COLORS.success.main } : null
                            ]}
                        />
                    </View>
                    <Text style={styles.progressHint}>
                        {t('visaCalc.common.goal', {
                            threshold: (result as any)?.threshold || 0,
                            unit: t('visaCalc.common.incomeUnit'),
                            value: f5Data.annualIncome
                        })}
                    </Text>
                </View>
            </Section>
        </>
    );

    const renderAllVisas = () => {
        // Group by category
        const grouped = Object.values(VISA_TYPES).reduce((acc, visa) => {
            if (!acc[visa.category]) acc[visa.category] = [];
            acc[visa.category].push(visa);
            return acc;
        }, {} as Record<string, typeof VISA_TYPES[string][]>);

        const categoryMap: Record<string, string> = {
            'Professional': t('visaCalc.categories.professional'),
            'Resident': t('visaCalc.categories.resident'),
            'ShortTerm': t('visaCalc.categories.shortTerm'),
            'Education': t('visaCalc.categories.education'),
            'Overseas': t('visaCalc.categories.overseas'),
            'Diplomatic': t('visaCalc.categories.diplomatic'),
            'Other': t('visaCalc.categories.other')
        };

        const categoryOrder = ['Professional', 'Resident', 'Education', 'Overseas', 'ShortTerm', 'Diplomatic', 'Other'];
        const sortedGroups = Object.entries(grouped).sort(([a], [b]) => {
            const idxA = categoryOrder.indexOf(a);
            const idxB = categoryOrder.indexOf(b);
            return (idxA > -1 ? idxA : 99) - (idxB > -1 ? idxB : 99);
        });

        return (
            <View style={{ gap: 24 }}>
                {sortedGroups.map(([category, list]) => (
                    <Section key={category} title={categoryMap[category] || category}>
                        <View style={{ gap: 12 }}>
                            {list.map(visa => (
                                <View key={visa.code} style={styles.visaCard}>
                                    <View style={styles.visaHeader}>
                                        <View style={styles.visaBadge}>
                                            <Text style={styles.visaBadgeText}>{visa.code}</Text>
                                        </View>
                                        <Text style={styles.visaName}>{visa.name}</Text>
                                    </View>
                                    <Text style={styles.visaDesc}>{visa.description}</Text>

                                    {visa.salaryRequirement && (
                                        <View style={styles.visaMetaRow}>
                                            <MaterialIcons name="attach-money" size={14} color="#666" />
                                            <Text style={styles.visaMetaText}>{t('visaCalc.common.minSalary', { salary: visa.salaryRequirement })}</Text>
                                        </View>
                                    )}
                                    {visa.maxStay && (
                                        <View style={styles.visaMetaRow}>
                                            <MaterialIcons name="access-time" size={14} color="#666" />
                                            <Text style={styles.visaMetaText}>{visa.maxStay}</Text>
                                        </View>
                                    )}
                                    {visa.allowedActivities && (
                                        <View style={styles.visaMetaRow}>
                                            <MaterialIcons name="check-circle-outline" size={14} color="#666" />
                                            <Text style={styles.visaMetaText}>{visa.allowedActivities.join(', ')}</Text>
                                        </View>
                                    )}
                                    {visa.notes && visa.notes.length > 0 && (
                                        <View style={styles.visaNotesContainer}>
                                            {visa.notes.map((note, idx) => (
                                                <View key={idx} style={styles.visaNoteRow}>
                                                    <View style={styles.visaNoteDot} />
                                                    <Text style={styles.visaNoteText}>{note}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    </Section>
                ))}
            </View>
        );
    };

    const LegalDisclaimer = () => (
        <NoticeCard
            variant="error"
            title={t('visaDocs.legalDisclaimer')}
        >
            {t('visaDocs.legalContent')}
        </NoticeCard>
    );


    return (
        <View style={styles.container}>
            <ScreenHeader title={t('visaCalc.title')} onBack={() => router.back()} />

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabScrollContent}
                >
                    <TabButton type="E-7-4" label={t('visaCalc.tabs.e74')} />
                    <TabButton type="F-2-7" label={t('visaCalc.tabs.f27')} />
                    <TabButton type="D-10" label={t('visaCalc.tabs.d10')} />
                    <TabButton type="F-5" label={t('visaCalc.tabs.f5')} />
                    <TabButton type="ALL" label={t('visaCalc.tabs.all')} />
                </ScrollView>
            </View>

            <View style={{ padding: SPACING.md, paddingBottom: 0 }}>
                <NoticeCard variant="info" icon="info-outline">
                    {t('visa.calculationNote')}
                </NoticeCard>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {activeTab === 'E-7-4' && <Section title={t('visaCalc.e74.title')}>{renderE74Inputs()}</Section>}
                {activeTab === 'E-7-4' && <LegalDisclaimer />}

                {activeTab === 'F-2-7' && <Section title={t('visaCalc.f27.title')}>{renderF27Inputs()}</Section>}
                {activeTab === 'F-2-7' && <LegalDisclaimer />}

                {activeTab === 'D-10' && <Section title={t('visaCalc.d10.title')}>{renderD10Inputs()}</Section>}
                {activeTab === 'D-10' && <LegalDisclaimer />}

                {activeTab === 'F-5' && renderF5Inputs()}
                {activeTab === 'F-5' && <LegalDisclaimer />}

                {activeTab === 'ALL' && renderAllVisas()}
            </ScrollView>

            {/* Sticky Footer Result */}
            <View style={[styles.footer, result?.pass ? styles.footerPass : styles.footerFail]}>
                <View>
                    <Text style={styles.footerLabel}>{t('visaCalc.common.totalScore')}</Text>
                    <Text style={styles.footerScore}>{result?.score}{t('visaCalc.common.points')}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 16 }}>
                    <Text
                        style={[styles.footerStatus, result?.pass ? { color: COLORS.primary[600] } : { color: COLORS.error.main }]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {result?.pass ? `PASS (${t('visaCalc.f5.eligible')})` : `FAIL (${t('visaCalc.f5.ineligible')})`}
                    </Text>
                    {/* Small detail text */}
                    <Text style={styles.footerDetail}>
                        {activeTab === 'F-2-7' && result?.details?.validYears ? `${result.details.validYears}${t('visaCalc.common.years')} valid` : result?.message}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingTop: 110, // Push content down below absolute header
    },
    tabContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tabScrollContent: {
        paddingHorizontal: SPACING.md,
        flexDirection: 'row',
    },
    tabButton: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
        marginRight: 12,
    },
    tabButtonActive: {
        borderBottomColor: COLORS.primary[500],
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    tabTextActive: {
        color: COLORS.primary[500],
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: SPACING.md,
        paddingBottom: 150, // Increased for footer visibility coverage
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 8,
    },
    inputRow: {
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between', // Push input to right, text to left
        alignItems: 'center',
    },
    inputLabel: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
        flex: 1, // Allow text to take available space
        flexWrap: 'wrap', // Allow wrapping for long languages like German
        marginEnd: 8, // RTL friendly margin
    },
    inputControl: {
        flexDirection: 'row',
        alignItems: 'center',
        // width is auto determined by children
    },
    numberInput: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        width: 100,
        fontSize: 16,
        textAlign: 'right',
    },
    unitText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#777',
    },
    segmentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    segmentBtn: {
        width: '30%',
        flexGrow: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    segmentBtnActive: {
        backgroundColor: COLORS.primary[50],
        borderColor: COLORS.primary[500],
    },
    segmentText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    segmentTextActive: {
        color: COLORS.primary[500],
        fontWeight: 'bold',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 15,
        color: '#333',
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    chipActive: {
        backgroundColor: COLORS.primary[50],
        borderColor: COLORS.primary[500],
    },
    chipText: {
        fontSize: 13,
        color: '#666',
    },
    chipTextActive: {
        color: COLORS.primary[500],
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 24,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: Platform.OS === 'ios' ? 34 : 24, // Safe Area padding
        ...SHADOWS.md,
    },
    footerPass: {
        borderTopColor: COLORS.success.main,
        borderTopWidth: 2,
    },
    footerFail: {
        borderTopColor: COLORS.error.main,
        borderTopWidth: 2,
    },
    footerLabel: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
        marginBottom: 4,
    },
    footerScore: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111',
    },
    footerStatus: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    footerDetail: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
        textAlign: 'right',
    },
    visaCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
    visaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    visaBadge: {
        backgroundColor: COLORS.primary[100],
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
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
    visaDesc: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
        lineHeight: 20,
    },
    visaMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    visaMetaText: {
        fontSize: 12,
        color: '#777',
    },
    visaNotesContainer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        gap: 4,
    },
    visaNoteRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
    },
    visaNoteDot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: '#999',
        marginTop: 7,
    },
    visaNoteText: {
        fontSize: 12,
        color: '#666',
        flex: 1,
        lineHeight: 16,
    },
    progressContainer: {
        marginTop: 20,
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 8,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    progressValue: {
        fontSize: 14,
        color: COLORS.primary[600],
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 10,
        backgroundColor: '#E5E7EB',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary[500],
    },
    progressHint: {
        fontSize: 11,
        color: '#999',
        marginTop: 8,
        textAlign: 'right',
    },

});
