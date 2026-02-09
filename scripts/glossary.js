// CommonJS Version for Node.js Scripts
const GLOSSARY = {
    // CRITICAL SAFETY TERMS (절대 오역 금지)
    "예상 수령액": "Estimated Amount", // Not "Payout Amount"
    "단순 안내": "General Guidance",   // Not "Legal Advice"
    "법적 효력이 없음": "No Legal Effect",
    "참고용": "For Reference Only",
    "정확한 내용은 관할 기관 확인": "Verify with Official Authority",

    // VISA TERMS
    "영주권": "Permanent Residency (F-5)", // Specify F-5
    "거주 비자": "Residency Visa (F-2)",
    "소득 요건": "Income Requirement (GNI)",

    // INSURANCE TERMS
    "출국만기보험": "Departure Guarantee Insurance",
    "국민연금": "National Pension",
    "반환일시금": "Lump-sum Refund",

    // APP TERMS
    "모의 계산기": "Simulator", // Not "Calculator" implies exactness, Simulator implies model
    "AI 상담": "AI Consultation (Beta)",
    "자문": "Consultation", // Not "Legal Advice"
};

const SYSTEM_PROMPT_TRANSLATION = `
You are a professional translator for a "Korean Visa & Legal Aid App".
Your goal is to translate UI text from Korean to {targetLang}.

RULES:
1. **STRICT GLOSSARY**: You MUST use the provided glossary terms exactly. Do not synonymize.
   - If the source has "예상 수령액", you MUST write "Estimated Amount".
2. **TONE**: Formal, Objective, and Cautious. 
   - Never sound like a lawyer. Use "Guide", "Help", "Info" instead of "Advise", "Guarantee".
3. **SAFETY**: If a sentence implies a promise (e.g., "You will get money"), soften it (e.g., "You may be eligible").
4. **FORMAT**: Return only the JSON content. Maintain nested structure.
`;

module.exports = { GLOSSARY, SYSTEM_PROMPT_TRANSLATION };
