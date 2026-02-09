import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export interface SimplifiedMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

/**
 * Generic OpenAI Chat Completion Wrapper
 */
export const fetchOpenAICompletion = async (
    messages: SimplifiedMessage[],
    model: string = "gpt-4o",
    maxTokens: number = 500,
    temperature: number = 0.7
): Promise<string | null> => {
    try {
        if (!API_KEY) {
            console.error("OpenAI API Key is missing.");
            return null;
        }

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: maxTokens,
                temperature
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("OpenAI Error:", data.error.message);
            throw new Error(data.error.message);
        }

        return data.choices[0]?.message?.content?.trim() || null;
    } catch (error) {
        console.error("AI Service Error:", error);
        return null;
    }
};

/**
 * Helper to create a safe document ID from text
 */
const generateDocId = (text: string, lang: string) => {
    // Simple hash replacement for demo. In production, use a proper hash.
    // We limit length and remove special chars to be safe for Doc ID.
    const cleanText = text.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
    const simpleHash = text.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    return `${lang}_${cleanText}_${Math.abs(simpleHash)}`;
};


/**
 * Batch translate text array to target language using GPT-4o with Firestore Caching
 */
export const translateTexts = async (
    texts: string[],
    targetLangCode: string
): Promise<string[]> => {
    if (texts.length === 0) return [];
    if (targetLangCode === 'ko') return texts;

    const results: string[] = new Array(texts.length).fill('');
    const missingIndices: number[] = [];
    const missingTexts: string[] = [];

    try {
        // 1. Check Cache
        await Promise.all(texts.map(async (text, index) => {
            const docId = generateDocId(text, targetLangCode);
            const docRef = doc(db, 'translations', docId);
            const snapshot = await getDoc(docRef);

            if (snapshot.exists()) {
                results[index] = snapshot.data().translatedText;
            } else {
                missingIndices.push(index);
                missingTexts.push(text);
            }
        }));

        // All cached? Return early
        if (missingTexts.length === 0) {
            console.log(`[AI] All ${texts.length} items found in cache.`);
            return results;
        }

        console.log(`[AI] Fetching ${missingTexts.length} items from OpenAI.`);

        // 2. Fetch from OpenAI for missing items
        const systemPrompt = `
You are a professional translator for a visa/immigration app.
Translate the following JSON array of news headlines into language code "${targetLangCode}".
Maintain the original meaning but make it natural.
Return ONLY a raw JSON string array. No markdown, no explanation.
Example Input: ["Hello", "World"]
Example Output: ["안녕하세요", "세상"]
        `;

        const userPrompt = JSON.stringify(missingTexts);

        const aiResult = await fetchOpenAICompletion(
            [
                { role: 'system', content: systemPrompt.trim() },
                { role: 'user', content: userPrompt }
            ],
            "gpt-4o",
            1000,
            0.3
        );

        let translatedMissing: string[] = missingTexts; // Fallback

        if (aiResult) {
            try {
                const jsonString = aiResult.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(jsonString);
                if (Array.isArray(parsed) && parsed.length === missingTexts.length) {
                    translatedMissing = parsed;
                }
            } catch (e) {
                console.error("AI Parse Error:", e);
            }
        }

        // 3. Save to Cache & Merge
        const batch = writeBatch(db);

        translatedMissing.forEach((translated, i) => {
            const originalIndex = missingIndices[i];
            const originalText = missingTexts[i];

            results[originalIndex] = translated;

            // Add to Firestore Batch
            const docId = generateDocId(originalText, targetLangCode);
            const docRef = doc(db, 'translations', docId);
            batch.set(docRef, {
                originalText,
                translatedText: translated,
                lang: targetLangCode,
                createdAt: new Date().toISOString()
            });
        });

        await batch.commit();
        console.log(`[AI] Cached ${translatedMissing.length} new translations.`);

        return results;

    } catch (e) {
        console.error("Translation Flow Error:", e);
        return texts; // Fail safe
    }
};
