const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

// Debug Env Loading
const envPath = path.resolve(__dirname, '../.env');
const result = require('dotenv').config({ path: envPath });

console.log("Loaded Env Keys:", Object.keys(result.parsed || {}));
const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error("❌ CRITICAL ERROR: API Key not found in .env");
    process.exit(1);
}

const openai = new OpenAI({ apiKey: apiKey });

// 1. Configuration
const SOURCE_LANG = 'ko';
const TARGET_LANGS = ['en', 'vi', 'th', 'uz', 'zh', 'tl', 'mn'];
const GLOSSARY = require('./glossary').GLOSSARY;
const SYSTEM_PROMPT_TEMPLATE = require('./glossary').SYSTEM_PROMPT_TRANSLATION;

// 2. Load Source JSON
const localesDir = path.join(__dirname, '../locales');
const sourcePath = path.join(localesDir, `${SOURCE_LANG}.json`);

if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source file not found: ${sourcePath}`);
    process.exit(1);
}

const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// 3. Recursive Translation Function
async function translateObject(obj, lang) {
    const glossaryText = Object.entries(GLOSSARY)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n');

    const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace('{targetLang}', lang) +
        "\n\nGLOSSARY:\n" + glossaryText;

    try {
        console.log(`\n🔄 Translating to ${lang}...`);
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: JSON.stringify(obj, null, 2) }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        return JSON.parse(content);
    } catch (error) {
        console.error(`❌ Error translating to ${lang}:`, error.message);
        return null;
    }
}

// 4. Main Execution
(async () => {
    console.log(`🚀 Starting AI Translation (Source: ${SOURCE_LANG})`);
    console.log(`📝 Targets: ${TARGET_LANGS.join(', ')}`);
    console.log(`📚 Glossary Terms: ${Object.keys(GLOSSARY).length}`);

    for (const lang of TARGET_LANGS) {
        if (lang === SOURCE_LANG) continue;

        const translatedData = await translateObject(sourceData, lang);

        if (translatedData) {
            const targetPath = path.join(localesDir, `${lang}.json`);
            fs.writeFileSync(targetPath, JSON.stringify(translatedData, null, 2));
            console.log(`✅ Saved ${lang}.json`);
        }
    }

    console.log("\n✨ All translations updated successfully.");
})();
