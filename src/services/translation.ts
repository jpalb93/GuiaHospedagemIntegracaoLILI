import { logger } from '../utils/logger';

/**
 * Translates a batch of texts using the Server-Side Translation API
 * This avoids CORS and 404 errors by using the working server environment.
 */
export interface TranslationFieldConfig {
    source: string;
    targetEn: string;
    targetEs: string;
}

export const translateBatch = async (
    items: any[],
    fields: TranslationFieldConfig[],
    modelName?: string
): Promise<any[]> => {
    const effectiveModelName = modelName || 'gemini-2.5-flash-lite';

    const batchSize = 3; // Reduced to 3 to strictly respect Free Tier limits
    const results: any[] = [];

    // Filter items that actually need translation (missing EN or ES)
    const pendingItems = items.filter((item) => {
        return fields.some(f => !item[f.targetEn] || !item[f.targetEs]);
    });

    if (pendingItems.length === 0) return [];

    logger.info(`Starting translation for ${pendingItems.length} items via Server Proxy...`);

    for (let i = 0; i < pendingItems.length; i += batchSize) {
        const batch = pendingItems.slice(i, i + batchSize);

        // Construct a structured prompt
        const promptData = batch.map((item, index) => {
            const contentToTranslate: Record<string, string> = {};
            fields.forEach((f) => {
                // Determine if we need to send this field
                // If either target is missing, we send the source
                if (item[f.source] && (!item[f.targetEn] || !item[f.targetEs])) {
                    contentToTranslate[f.source] = item[f.source];
                }
            });
            return {
                _id: index,
                content: contentToTranslate
            };
        });

        const prompt = `
            You are a translation engine.
            Task: Translate the values within the "content" object of each item from Portuguese to English and Spanish.

            Rules:
            1. The input is a JSON array. Each item has a "content" object.
            2. For EVERY key in "content" (e.g., "title", "text", "description"), you must generate two new keys:
               - [key]_en: The English translation.
               - [key]_es: The Spanish translation.
            3. Do NOT change the original keys.
            4. Do NOT translate proper names (e.g. "Lili", "Flat", specialized brand names).
            5. Return PURE JSON only. No markdown. No explanations.

            Example Logic:
            Input:  [ { "_id": 0, "content": { "txt": "Olá" } } ]
            Output: [ { "_id": 0, "content": { "txt_en": "Hello", "txt_es": "Hola" } } ]

            DATA TO TRANSLATE:
            ${JSON.stringify(promptData)}
        `;

        try {
            // Call our new Serverless Function
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    model: effectiveModelName
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server API Error: ${response.status} - ${errorText} `);
            }

            const data = await response.json();
            const text = data.text;

            // Clean up code blocks if present
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const translatedBatch = JSON.parse(cleanJson);

            // Merge translations back into results
            translatedBatch.forEach((t: any) => {
                const originalItem = batch[t._id];
                if (originalItem) {
                    const updates: any = { id: originalItem.id };

                    fields.forEach(f => {
                        // AI returns source_en and source_es
                        // We map them to targetEn and targetEs
                        if (t.content[`${f.source}_en`]) updates[f.targetEn] = t.content[`${f.source}_en`];
                        if (t.content[`${f.source}_es`]) updates[f.targetEs] = t.content[`${f.source}_es`];

                        // Fallback: If AI returned the source key itself as translated (unlikely given prompt, but safety)
                        // Actually, relying on suffix is safest.
                    });

                    results.push(updates);
                }
            });

            // STRICT Rate limit for Free Tier
            if (i + batchSize < pendingItems.length) {
                logger.info(`Waiting 12s to respect API quota... (Progress: ${i + batchSize}/${pendingItems.length})`);
                await new Promise(resolve => setTimeout(resolve, 12000));
            }

        } catch (error) {
            logger.error('Error translating batch via API:', error);
            // If it's the first batch and it fails, it's likely a configuration/quota issue.
            // Rethrowing helps the UI know something went wrong.
            if (i === 0) throw error;
        }
    }

    if (pendingItems.length > 0 && results.length === 0) {
        throw new Error('Translation failed: No items were translated.');
    }

    return results;
};
