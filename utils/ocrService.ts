import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const GOOGLE_CLOUD_VISION_API_KEY = 'AIzaSyD7hQiL2eM-CMSJuSaqzsjCAFHsG8y4rFw'; // User provided key
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`;

export type OCRResult = {
    category: 'DANGER' | 'SAFE' | 'UNKNOWN';
    summary: string;
    keywords: string[];
    confidence: number;
    // Enhanced Fields
    title?: string;
    amount?: string;
    dueDate?: string;
    paymentInfo?: string;
    rawText?: string; // Added for debugging
};

// Real OCR function for Mail
export const analyzeMailImage = async (imageUri: string): Promise<OCRResult> => {
    console.log(`[Mail OCR] Analyzing Image: ${imageUri}`);

    try {
        // 1. Convert image to Base64 (Reuse logic or extract helper later)
        let base64ImageData;
        const isWeb = Platform.OS === 'web' || (typeof window !== 'undefined' && typeof window.document !== 'undefined');

        if (isWeb) {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            base64ImageData = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    resolve(result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } else {
            base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
        }

        // 2. Call Google Vision API
        const requestBody = {
            requests: [
                {
                    image: { content: base64ImageData },
                    features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
                },
            ],
        };

        const response = await fetch(VISION_API_URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (!response.ok || result.error) {
            throw new Error(result.error?.message || 'Google Vision API request failed');
        }

        const textAnnotations = result.responses[0]?.textAnnotations;
        if (!textAnnotations || textAnnotations.length === 0) {
            return {
                category: 'UNKNOWN',
                summary: "No text detected in the image.",
                keywords: [],
                confidence: 0,
            };
        }

        const fullText = textAnnotations[0].description;
        console.log("[Mail OCR] Detected Text:", fullText.substring(0, 100) + "...");
        const cleanText = fullText.replace(/\r\n/g, '\n');

        // 3. Keyword Analysis
        // DANGER: Actionable bills, fines, warnings
        // Added Utility Keywords: 도시가스(City Gas), 전기(Electric), 수도(Water), 관리비(Maintenance)
        const DANGER_KEYWORDS = ['납부', '고지서', '신고', '독촉', '과태료', '벌금', '세금', '미납', '압류', '청구', '지로', 'fine', 'bill', 'tax', 'payment', 'due', 'penalty', 'warning', 'invoice',
            '도시가스', '전기요금', '수도요금', '관리비', '가스', '전력', '보험료'];

        // SAFE: General info, news, ads
        const SAFE_KEYWORDS = ['안내', '소식', '홍보', '초대', '뉴스', '할인', 'notice', 'news', 'promotion', 'guide', 'welcome', 'event'];

        // PAID/RECEIPT: Already paid, safe to archive
        const PAID_KEYWORDS = ['납부완료', '수납필', '수납인', '완납', '결제완료', '정산완료', 'paid', 'confirmed'];

        // Robust Matching: Check against both original (with spaces) and space-stripped text
        // This handles "도 시 가 스" or "고 지 서" which often happens in OCR headers
        const textToSearch = fullText.toLowerCase();
        const textNoSpaces = cleanText.replace(/\s/g, '').toLowerCase();

        const checkKeywords = (keywords: string[]) => {
            return keywords.filter(k =>
                textToSearch.includes(k.toLowerCase()) ||
                textNoSpaces.includes(k.toLowerCase())
            );
        };

        const detectedDanger = checkKeywords(DANGER_KEYWORDS);
        const detectedSafe = checkKeywords(SAFE_KEYWORDS);
        const detectedPaid = checkKeywords(PAID_KEYWORDS);

        // 4. Detailed Extraction
        const lines = cleanText.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);

        // Title: Usually the first line or large text at top.
        // Better: Search for known Bill Titles.
        const titleKeywords = ['도시가스', '전기요금', '수도요금', '지방세', '국민연금', '건강보험', '자동차세', '등록면허세', '재산세', '주민세', '과태료', '범칙금', 'Giro', 'Bill', 'Invoice'];
        const titleMatch = cleanText.match(new RegExp(`(${titleKeywords.join('|')})`, 'i'));

        let extractedTitle = lines[0]; // Default to first line
        if (titleMatch) {
            extractedTitle = titleMatch[0]; // Use specific known title if found
        } else if (lines.length > 1 && lines[0].length < 30) {
            extractedTitle = lines[0];
        }

        // Amount: Look for number followed by "원" or large numbers with commas near "합계", "금액"
        // Improved Regex: Allow optional spaces between digits (common in OCR) e.g., "1 2, 0 0 0"
        // Also captures "Total 12,000"
        const amountMatch = cleanText.match(/(?:납부.*금액|청구.*금액|합계|금액|Total|Amount|Sum)\s*[:\.]?\s*([0-9\s,]+)(?:\s*원|Won)?/i);

        // Fallback: Just look for "12,345원" (Digits + comma + Won)
        const amountFallbackVal = cleanText.match(/([0-9,]+)\s*원/);

        let extractedAmount: string | undefined = undefined;

        const parseAmount = (raw: string) => {
            // Remove spaces and check if it looks like a number
            const clean = raw.replace(/\s/g, '');
            if (/^[0-9,]+$/.test(clean) && clean.length > 3) { // Min 3 digits to avoid noise
                return clean + '원';
            }
            return undefined;
        };

        if (amountMatch && amountMatch[1]) {
            extractedAmount = parseAmount(amountMatch[1]);
        }
        if (!extractedAmount && amountFallbackVal) {
            extractedAmount = parseAmount(amountFallbackVal[1]);
        }


        // Due Date
        // Regex: YYYY.MM.DD or YY.MM.DD or YYYY-MM-DD
        const dateMatch = cleanText.match(/(?:납부.*기한|마감일|기한|Date|Until|Due)\s*[:\.]?\s*(\d{2,4}[-.\/]\d{2}[-.\/]\d{2})/i);
        const extractedDate = dateMatch ? dateMatch[1] : undefined;

        // Payment Info (Account/Bank)
        const bankKeywords = '농협|국민|신한|우리|하나|기업|대구|부산|광주|전북|경남|SC|씨티|카카오|케이|토스|우체국';
        // Look for "Bank <Number>" or "Account <Number>"
        // Regex: (BankName) (Account Number)
        const accountMatch = cleanText.match(new RegExp(`(${bankKeywords})\\s*은행?\\s*[:\\.]?\\s*([0-9-]{10,})`, 'i'));
        // Also look for "가상계좌 <Number>"
        const virtualAccountMatch = cleanText.match(/(?:가상계좌|입금계좌|Account).*?([\d-]{10,})/i);

        let extractedPaymentInfo = undefined;
        if (accountMatch) {
            extractedPaymentInfo = `${accountMatch[1]}은행 ${accountMatch[2]}`;
        } else if (virtualAccountMatch) {
            extractedPaymentInfo = `가상계좌 ${virtualAccountMatch[1]}`;
        }


        // Logic Refined:
        // 1. If explicit 'PAID' keywords found -> SAFE
        // 2. If 'DANGER' keywords found OR (Amount + DueDate found) -> DANGER
        // 3. Safe keywords -> SAFE

        const baseResult = {
            rawText: fullText, // Attach raw text
            title: extractedTitle,
            amount: extractedAmount,
            dueDate: extractedDate,
            paymentInfo: extractedPaymentInfo
        };

        if (detectedPaid.length > 0) {
            return {
                ...baseResult,
                category: 'SAFE',
                summary: `Payment Confirmed: Looks like a paid receipt for ${extractedAmount || 'payment'}.`,
                keywords: detectedPaid,
                confidence: 0.95,
            };
        } else if (detectedDanger.length > 0 || (extractedAmount && extractedDate)) {
            // Even if no specific danger keyword, having an Amount AND Due Date strongly implies a Bill.
            return {
                ...baseResult,
                category: 'DANGER',
                summary: `Action Required: Pay ${extractedAmount || 'ticket/bill'} by ${extractedDate || 'deadline'}.`,
                keywords: detectedDanger,
                confidence: 0.9,
            };
        } else if (detectedSafe.length > 0) {
            return {
                ...baseResult,
                category: 'SAFE',
                summary: "This appears to be general information or a newsletter.",
                keywords: detectedSafe,
                confidence: 0.8,
            };
        } else {
            return {
                ...baseResult,
                category: 'UNKNOWN',
                summary: "Text detected but could not identify document type.",
                keywords: [],
                confidence: 0.5,
            };
        }

    } catch (error) {
        console.error("analyzeMailImage Error:", error);
        throw error;
    }
};

export type ARCResult = {
    regNumber: string;
    name: string;
    country: string;
    visaType: string;
    issueDate?: string;
    expiryDate?: string;
};

export const analyzeARC = async (imageUri: string): Promise<ARCResult> => {
    console.log(`[OCR] Analyzing Image: ${imageUri}`);
    console.log(`[OCR] Platform.OS: ${Platform.OS}`);

    try {
        let base64ImageData;

        // 1. Convert image to Base64 (Platform Specific)
        // Check both Platform.OS and window existence to be sure
        const isWeb = Platform.OS === 'web' || (typeof window !== 'undefined' && typeof window.document !== 'undefined');
        console.log(`[OCR] isWeb determined as: ${isWeb}`);

        if (isWeb) {
            console.log("[OCR] Using Web Fetch/Blob method");
            const response = await fetch(imageUri);
            const blob = await response.blob();
            base64ImageData = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
                    resolve(result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } else {
            console.log("[OCR] Using Native FileSystem method");
            base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
        }

        console.log(`[OCR] Image converted to Base64 (Length: ${base64ImageData.length})`);


        // 2. Prepare Request Body
        const requestBody = {
            requests: [
                {
                    image: {
                        content: base64ImageData,
                    },
                    features: [
                        {
                            type: 'TEXT_DETECTION',
                            maxResults: 1,
                        },
                    ],
                },
            ],
        };

        // 3. Call Google Cloud Vision API
        const response = await fetch(VISION_API_URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        // 4. Handle API Errors
        if (!response.ok || result.error) {
            console.error('Vision API Error:', result);
            throw new Error(result.error?.message || 'Google Vision API request failed');
        }

        // 5. Parse Text Annotations
        const textAnnotations = result.responses[0]?.textAnnotations;
        if (!textAnnotations || textAnnotations.length === 0) {
            throw new Error('No text found in image');
        }

        const fullText = textAnnotations[0].description;
        console.log("Detected Text:", fullText);

        // 6. Extract Data using Regex (Robust parsing context)
        // clean up text for easier matching
        const cleanText = fullText.replace(/\r\n/g, '\n');

        // A. Registration Number: 000000-0000000
        const regNumberMatch = cleanText.match(/\d{6}\s*-\s*\d{7}/);

        // B. Visa Type: e.g., D-10, E-9, F-6 (Generic match: Letter-Number(-Number)?)
        const visaTypeMatch = cleanText.match(/([A-Z]-[0-9]+(-[0-9]+)?)/);

        // C. Name Extraction
        // Look for lines containing "Name" or "성명"
        // Example: "성명 DO THI PHUONG" or "Name DO THI PHUONG"
        let extractedName = '';
        // Use [ \t] instead of \s to avoid matching across newlines (e.g., "Name\nVICE KOREA")
        // Capture [A-Z ] to extraction only English letters and spaces on the same line
        const nameLabelMatch = cleanText.match(/(?:성명|Name)[ \t]+([A-Z ]+)/i);
        if (nameLabelMatch && nameLabelMatch[1]) {
            extractedName = nameLabelMatch[1].trim();
        } else {
            // Fallback: Use heuristic if label not found on same line
            const lines = cleanText.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                // Look for 2+ uppercase words, ignoring common headers
                if (/^[A-Z]{2,}(\s+[A-Z]{2,})+$/.test(trimmed) &&
                    !trimmed.includes('REPUBLIC') &&
                    !trimmed.includes('KOREA') &&
                    !trimmed.includes('CARD') &&
                    !trimmed.includes('REGISTRATION')) {
                    extractedName = trimmed;
                    break;
                }
            }
        }

        // D. Country Extraction
        // Look for lines containing "Country" or "국가"
        // Example: "국가 / 지역 VIETNAM"
        let extractedCountry = '';
        const countryLabelMatch = cleanText.match(/(?:국가|Country|Region)\s*(?:\/|of)?\s*(?:\/|지역|Origin)?\s+([A-Z]+)/i);

        if (countryLabelMatch && countryLabelMatch[1]) {
            extractedCountry = countryLabelMatch[1];
        } else {
            // Fallback: list of common countries
            const countryMatch = cleanText.match(/VIETNAM|CHINA|THAILAND|PHILIPPINES|UZBEKISTAN|NEPAL|INDONESIA|MONGOLIA|CAMBODIA|SRI LANKA|BANGLADESH|MYANMAR/i);
            if (countryMatch) extractedCountry = countryMatch[0];
        }

        // E. Issue Date Extraction
        // Look for YYYY.MM.DD pattern often found near "Issue Date" or at the bottom
        // Example: "Issue Date 2024.09.02."
        // We also want to find Expiry Date.
        // Regex for dates: YYYY.MM.DD
        const dateMatches = [...cleanText.matchAll(/(\d{4})\.(\d{2})\.(\d{2})/g)];

        let formattedIssueDate = '';
        let formattedExpiryDate = '';

        // Helper to format YYYY.MM.DD -> YYYY-MM-DD
        const formatDate = (m: RegExpMatchArray) => `${m[1]}-${m[2]}-${m[3]}`;

        // Strategy: 
        // 1. Look for explicit labels
        const issueLabelline = cleanText.match(/(?:Issue Date|발급일)[^0-9]*(\d{4}\.\d{2}\.\d{2})/i);
        const expiryLabelMatch = cleanText.match(/(?:Expiry|만료|Period|Until)[^0-9]*(\d{4}\.\d{2}\.\d{2})/i);

        if (issueLabelline) {
            const parts = issueLabelline[1].split('.');
            formattedIssueDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
        }
        if (expiryLabelMatch) {
            const parts = expiryLabelMatch[1].split('.');
            formattedExpiryDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
        }

        // 2. Fallback: If multiple dates found and labels didn't catch them
        if (dateMatches.length >= 1) {
            const dates = dateMatches.map(m => ({
                raw: m[0],
                formatted: formatDate(m),
                index: m.index
            }));

            // If we missed issue date via label but have dates
            if (!formattedIssueDate && dates.length > 0) {
                // Usually Issue Date is at the bottom or the *latest* date found? 
                // Actually, Expiry is usually *after* Issue.
                // Let's sort textually/chronologically.
                dates.sort((a, b) => a.formatted.localeCompare(b.formatted));

                // If we have 2 dates, earlier is usually Issue (or Birth?), Later is Expiry.
                // Birth is usually YYMMDD in Reg Number, not YYYY.MM.DD.
                // So if we see YYYY.MM.DD, it's likely Issue or Expiry.

                // Heuristic: If 2 dates, Early = Issue, Late = Expiry
                if (dates.length >= 2) {
                    if (!formattedIssueDate) formattedIssueDate = dates[0].formatted;
                    if (!formattedExpiryDate) formattedExpiryDate = dates[dates.length - 1].formatted;
                } else if (dates.length === 1) {
                    // Only one date. If it says "Issue", it's issue. If "Until", expiry.
                    // If we are here, regex failed. Assume it's Issue Date if it's near "Chief" or bottom.
                    if (!formattedIssueDate) formattedIssueDate = dates[0].formatted;
                }
            }
        }

        console.log("Parsed Data:", {
            reg: regNumberMatch ? regNumberMatch[0] : 'Not Found',
            visa: visaTypeMatch ? visaTypeMatch[0] : 'Not Found',
            name: extractedName,
            country: extractedCountry,
            issueDate: formattedIssueDate,
            expiryDate: formattedExpiryDate
        });

        return {
            regNumber: regNumberMatch ? regNumberMatch[0].replace(/\s/g, '') : '',
            name: extractedName || '',
            country: extractedCountry ? extractedCountry.toUpperCase() : '',
            visaType: visaTypeMatch ? visaTypeMatch[0] : '',
            issueDate: formattedIssueDate,
            expiryDate: formattedExpiryDate
        };

    } catch (error) {
        console.error("analyzeARC Error:", error);
        throw error;
    }
};
