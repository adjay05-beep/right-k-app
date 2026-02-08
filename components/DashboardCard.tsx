import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { styled } from 'nativewind';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

interface DashboardCardProps {
    title: string;
    subtitle?: string;
    iconName: keyof typeof MaterialIcons.glyphMap;
    href: string;
    color?: string;
}

export default function DashboardCard({ title, subtitle, iconName, href, color = "bg-white" }: DashboardCardProps) {
    return (
        <Link href={href} asChild>
            <StyledTouchableOpacity className={`p-4 rounded-3xl shadow-sm mb-4 ${color} w-[48%] active:opacity-80`}>
                <StyledView className="bg-blue-50 w-12 h-12 rounded-2xl items-center justify-center mb-3">
                    <MaterialIcons name={iconName} size={24} color="#00264B" />
                </StyledView>
                <StyledText className="text-lg font-bold text-gray-900 mb-1">{title}</StyledText>
                {subtitle && <StyledText className="text-xs text-gray-500">{subtitle}</StyledText>}
            </StyledTouchableOpacity>
        </Link>
    );
}
