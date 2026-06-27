// src/lib/gemini.js

/**
 * Generate an insight using standard Gemini API with model fallback.
 * @param {object} snapshot - Technical snapshot data.
 * @param {string} riskProfile - User's risk profile.
 * @returns {Promise<{insight: object, model: string}>} Insight JSON object and model used.
 */
export async function generateInsight(snapshot, riskProfile) {
  const prompt = `You are an educational stock-market assistant. Give a concise, non-advisory analysis for ${snapshot.symbol}.
Use this technical snapshot data: ${JSON.stringify(snapshot)}.
User risk profile: ${riskProfile}.

You MUST respond with a JSON object matching this schema exactly. Do not add any markdown formatting like \`\`\`json or backticks. Return ONLY the JSON:
{
  "summary": "1-2 sentence educational summary of the stock's current movement and momentum based on the technical data.",
  "metrics": [
    { "label": "Current Price", "value": "$${snapshot.latest.toFixed(2)}" },
    { "label": "20-Day MA", "value": "$${(snapshot.latest - snapshot.latest * 0.05).toFixed(2)} (or actual 20-day MA value if estimated)" },
    { "label": "90-Day Return", "value": "${snapshot.return90d.toFixed(2)}%" }
  ],
  "highlights": [
    { "title": "Trend Status", "value": "e.g. trading below/above 20-day MA with high/low strength" },
    { "title": "90-Day Range", "value": "$${snapshot.low90.toFixed(2)} - $${snapshot.high90.toFixed(2)}" },
    { "title": "Liquidity Indicator", "value": "e.g. strong/moderate volume" }
  ],
  "risks": [
    { "title": "Volatility/Momentum Risk", "description": "e.g. 1 sentence detailing risks relative to the user's ${riskProfile} risk profile." }
  ],
  "disclaimer": "This analysis is for educational purposes only and does not constitute financial, investment, or trading advice."
}`;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined.');
  }

  // Prioritized list of models that are active and not disabled (quota limit 0)
  const models = [
    'gemini-flash-latest', // Points to stable 1.5-flash
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-flash-lite-latest',
  ];
  let lastError = null;

  for (const model of models) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout per request

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Model ${model} returned status ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error(`Model ${model} did not return parts[0].text in response candidates.`);
      }

      try {
        const parsed = JSON.parse(text);
        return {
          insight: parsed,
          model: model,
        };
      } catch (parseErr) {
        console.warn(`Failed to parse JSON for model ${model}:`, parseErr.message);
        // Fallback schema if response JSON parsing fails
        return {
          insight: {
            summary: text,
            metrics: [
              { label: 'Current Price', value: `$${snapshot.latest.toFixed(2)}` },
              { label: '90-Day Return', value: `${snapshot.return90d.toFixed(2)}%` },
            ],
            highlights: [],
            risks: [],
            disclaimer:
              'This analysis is for educational purposes only and does not constitute financial, investment, or trading advice.',
          },
          model: model,
        };
      }
    } catch (err) {
      clearTimeout(timeoutId);
      const errMsg = err.name === 'AbortError' ? 'Request timed out after 8s' : err.message;
      console.warn(`Gemini generation failed for model ${model}:`, errMsg);
      lastError = new Error(errMsg);
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
}
