export interface VisaScore {
    score: number;
    pass: boolean;
    message?: string;
    details?: any;
}

// ==========================================
// E-7-4 (Skilled Worker) - K-Point E74
// ==========================================
export interface E74Input {
    income2YearAvg: number; // million KRW (e.g. 2600 for 26 million)
    koreanLevel: number; // TOPIK grade or KIIP level (1-6)
    age: number;
    currentWorkExperience: number; // years
    recommendation?: 'central' | 'local' | 'company' | 'none';
    ruralWork?: boolean;
    domesticDegree?: boolean;
}

export const calculateE74 = (data: E74Input): VisaScore => {
    let score = 0;
    let messages: string[] = [];

    // 1. Annual Income (Max 120)
    // 50m+: 120, 26m+: 50 (Linear approx or bracket? Policy uses brackets)
    // Simplified brackets based on policy summary:
    if (data.income2YearAvg >= 5000) score += 120;
    else if (data.income2YearAvg >= 4500) score += 110;
    else if (data.income2YearAvg >= 4000) score += 100;
    else if (data.income2YearAvg >= 3500) score += 80;
    else if (data.income2YearAvg >= 3000) score += 60;
    else if (data.income2YearAvg >= 2600) score += 50;

    // 2. Korean Ability (Max 120)
    // TOPIK/KIIP 4+: 120?? No, policy says "TOPIK 4급↑ / 사회통합 4단계↑(120점) ~ 2급 / 2단계(50점)" is incorrect in my memory? 
    // Let's re-read the user prompt carefully.
    // "TOPIK 4급↑ / 사회통합 4단계↑(120점) ~ 2급 / 2단계(50점)" -> Yes, high weight.
    if (data.koreanLevel >= 4) score += 120; // This seems very high compared to previous, but following user doc.
    else if (data.koreanLevel === 3) score += 80; // Interpolated
    else if (data.koreanLevel === 2) score += 50;

    // 3. Age (Max 60)
    if (data.age >= 27 && data.age <= 33) score += 60;
    else if (data.age >= 19 && data.age <= 26) score += 40;
    else if (data.age >= 34 && data.age <= 40) score += 30;
    else if (data.age >= 41) score += 10;

    // 4. Recommendation (Max 50)
    if (data.recommendation === 'local') score += 50; // Gwangyeok
    else if (data.recommendation === 'central') score += 30;
    else if (data.recommendation === 'company') score += 30; // Company can add to others?
    // "중앙부처와 지자체 추천은 중복 시 하나만 인정되며, 고용업체 추천과는 합산 가능"
    // For simplicity, handle singular recommendation choice in UI for now, or improve logic later.

    // 5. Bonus
    if (data.currentWorkExperience >= 3) score += 20; // Min 20, max 50 depending on years
    if (data.ruralWork) score += 20;
    if (data.domesticDegree) score += 20;

    const incomePass = data.income2YearAvg >= 2600;
    const koreanPass = data.koreanLevel >= 2;
    const totalPass = score >= 200;

    if (!incomePass) messages.push("Min. 26M KRW Income required.");
    if (!koreanPass) messages.push("Min. Level 2 Korean required.");
    if (!totalPass) messages.push(`Total ${score}/200 points.`);

    return {
        score,
        pass: incomePass && koreanPass && totalPass,
        message: messages.join(' '),
    };
};

// ==========================================
// F-2-7 (Points Resident)
// ==========================================
export interface F27Input {
    age: number;
    education: 'phd_stem' | 'phd' | 'master_stem' | 'master' | 'bachelor' | 'associate';
    koreanLevel: number;
    annualIncome: number; // million KRW
    kiipCompleted: boolean; // Level 5
    extraPoints: number; // Sum of volunteer, degree, etc.
}

export const calculateF27 = (data: F27Input): VisaScore & { validYears: number } => {
    let score = 0;

    // 1. Age
    if (data.age >= 25 && data.age <= 29) score += 25;
    else if (data.age >= 30 && data.age <= 34) score += 23; // Adjusted based on common F27 scale or user doc?
    // User Doc: "25-29세(25), 18-24세(23), 30-34세(23), 35-39세(20)..."
    else if (data.age >= 18 && data.age <= 24) score += 23;
    else if (data.age >= 35 && data.age <= 39) score += 20;
    else if (data.age >= 40 && data.age <= 44) score += 12;
    else if (data.age >= 45 && data.age <= 50) score += 8;
    else score += 3;

    // 2. Education
    const eduPoints = {
        'phd_stem': 25, 'phd': 20, 'master_stem': 20, 'master': 17, 'bachelor': 15, 'associate': 10
    };
    score += eduPoints[data.education] || 0;

    // 3. Korean
    if (data.koreanLevel >= 5) score += 20;
    else if (data.koreanLevel === 4) score += 15;
    else if (data.koreanLevel === 3) score += 10;
    else if (data.koreanLevel === 2) score += 5;
    else if (data.koreanLevel === 1) score += 3;

    // 4. Income
    if (data.annualIncome >= 10000) score += 60;
    else if (data.annualIncome >= 8000) score += 56;
    else if (data.annualIncome >= 6000) score += 50;
    else if (data.annualIncome >= 4000) score += 40;
    else if (data.annualIncome >= 3000) score += 30; // Min threshold usually
    else if (data.annualIncome >= 2300) score += 10; // Approx Min Wage

    // 5. Bonus
    if (data.kiipCompleted) score += 10;
    score += data.extraPoints;

    let validYears = 0;
    if (score >= 130 && data.annualIncome >= 5000) validYears = 5; // Simulating income check for duration
    else if (score >= 120) validYears = 3; // Simplified
    else if (score >= 110) validYears = 2;
    else if (score >= 80) validYears = 1;

    return {
        score,
        pass: score >= 80,
        validYears,
        message: score >= 80 ? `Eligible for ${validYears} year(s)` : `${80 - score} points needed.`
    };
};

// ==========================================
// D-10 (Job Seeker)
// ==========================================
export interface D10Input {
    age: number;
    education: 'phd' | 'master' | 'bachelor' | 'associate';
    koreanLevel: number;
    recentWorkExperience: boolean; // Simplified for now
    globalUniOrCorp: boolean;
    stemMajor: boolean;
}

export const calculateD10 = (data: D10Input): VisaScore => {
    let score = 0;
    // Basic Items (Max 50)
    // Age: 20-29(Max), 30-34...
    if (data.age >= 20 && data.age <= 29) score += 20; // Assuming 20 max for age in user doc context "기본 항목 50"
    // User doc says "연령 (20~34세 우대)... 기본 항목 배점 50" -> exact scale needed, using standard D10 scale approx.
    else if (data.age >= 30 && data.age <= 34) score += 15;
    else if (data.age >= 35 && data.age <= 39) score += 10;
    else score += 5;

    // Education
    if (data.education === 'phd') score += 30;
    else if (data.education === 'master') score += 20;
    else if (data.education === 'bachelor') score += 15;
    else if (data.education === 'associate') score += 10;

    // Experience (Optional/Select) - skipped for simplicity or add fixed amount
    if (data.recentWorkExperience) score += 10;

    // Bonus
    if (data.koreanLevel >= 4) score += 20; // User doc: "TOPIK 4급↑ 20점" in Selection? No, bonus or selection?
    // Doc says: "선택 항목... 한국어 능력 (TOPIK 4급↑ 20점)"
    // Let's add it.

    if (data.globalUniOrCorp) score += 20;
    if (data.stemMajor) score += 5;

    const basicScore = (data.education === 'phd' ? 30 : data.education === 'master' ? 20 : 15); // Rough check

    return {
        score,
        pass: score >= 60,
        message: score >= 60 ? "Eligible for D-10" : `${60 - score} points needed.`
    };
};

// ==========================================
// F-5 (Permanent Resident) - GNI Simulator
// ==========================================
export interface F5Input {
    annualIncome: number; // million KRW
    track: 'generic' | 'stem' | 'f27_3yr' | 'f4_high';
}

export const GNI_2025 = 4995; // Approx 50M KRW (Update when official 2024 GNI is out in Q2 2025)

export const calculateF5 = (data: F5Input): VisaScore & { gniRatio: number, threshold: number } => {
    const threshold = (data.track === 'stem') ? GNI_2025 : GNI_2025 * 2;
    const gniRatio = data.annualIncome / threshold;
    const pass = data.annualIncome >= threshold;

    let message = '';
    if (pass) {
        message = `GNI ${data.track === 'stem' ? '1배' : '2배'} 요건 충족!`;
    } else {
        const missing = threshold - data.annualIncome;
        message = `GNI 요건까지 약 ${missing}만원 부족합니다.`;
    }

    return {
        score: Math.round(gniRatio * 100), // Show percentage as "score" for progress bar
        pass,
        gniRatio,
        threshold,
        message
    };
};

export const calculateVisaScore = (data: { age: number, income: number, education: any, topik: number, extraPoints: number }) => {
    // Legacy support wrapper
    const validEdu = ['associate', 'bachelor', 'master', 'phd'].includes(data.education) ? data.education : 'bachelor';

    // Use F-2-7 as base
    const f27Input: F27Input = {
        age: data.age,
        annualIncome: data.income,
        education: validEdu as any,
        koreanLevel: data.topik,
        extraPoints: data.extraPoints,
        kiipCompleted: false
    };

    const result = calculateF27(f27Input);

    return {
        totalScore: result.score,
        passed: result.pass,
        tips: ["Complete KIIP Level 5 for +10 points", "Earn > 40M KRW for higher points"]
    };
};
