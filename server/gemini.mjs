const API = 'https://generativelanguage.googleapis.com/v1beta/models';

// Invoke only from an authenticated, budget-limited server workflow using reviewed, public task text.
export async function draftHint(task, { env = process.env, fetcher = fetch } = {}) {
  const fallback = { source: 'curated', text: task.hint };
  if (env.GEMINI_ENABLED !== 'true' || !env.GEMINI_API_KEY) return fallback;
  const model = env.GEMINI_MODEL;
  if (!/^gemini-[a-z0-9.-]+$/.test(model ?? '')) return fallback;

  try {
    const response = await fetcher(API + '/' + model + ':generateContent', {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(6000),
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'Draft one short conceptual hint for this Python exercise. Do not provide its answer, an output value, or a worked solution.' }] },
        contents: [{ parts: [{ text: task.prompt + '\n' + task.code }] }],
        generationConfig: { maxOutputTokens: 250 },
      }),
    });
    if (!response.ok) return fallback;
    const candidate = (await response.json()).candidates?.[0];
    if (candidate?.finishReason !== 'STOP') return fallback;
    const content = candidate.content?.parts?.filter(part => !part.thought).map(part => part.text).join('').trim();
    return content && content.length <= 300
      ? { source: 'gemini', text: content, reviewRequired: true }
      : fallback;
  } catch {
    return fallback;
  }
}
