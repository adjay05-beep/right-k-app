import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { COLORS, SPACING } from '../../constants/design-system';
import { LEGAL_TEXTS } from '../../constants/legalText';

export default function LegalPage() {
    const { type } = useLocalSearchParams<{ type: string }>();

    // Default to terms if type is invalid or missing
    const contentKey = (type as keyof typeof LEGAL_TEXTS) || 'terms';
    const data = LEGAL_TEXTS[contentKey] || LEGAL_TEXTS.terms;

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScreenHeader title={data.title} />

            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: SPACING.lg,
                    paddingTop: 100, // Account for header height
                    paddingBottom: SPACING.xl
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={{
                    fontSize: 15,
                    color: COLORS.text.secondary,
                    lineHeight: 24,
                    textAlign: 'justify'
                }}>
                    {data.content}
                </Text>
            </ScrollView>
        </View>
    );
}
