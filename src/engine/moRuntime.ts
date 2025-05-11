
// src/engine/moRuntime.ts
import { MoScript, MoScriptResult } from './types';
import { getTemplate } from './voiceTemplates';

const generateWithGROQ = async (result: MoScriptResult, style: string): Promise<string> => {
  try {
    const response = await fetch('https://api.groq.com/v1/voice', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        decision_result: result,
        style,
        template: getTemplate('ranking', style as any)
      })
    });

    if (!response.ok) throw new Error('GROQ API error');
    return (await response.json()).voice_line;
  } catch (error) {
    console.warn('GROQ failed, using local template');
    return getTemplate('ranking', style as any)
      .replace('{name}', result.topAlternative.name)
      .replace('{score}', result.topAlternative.score.toFixed(1));
  }
};

export const generateVoiceLine = async (result: MoScriptResult, style = 'calm'): Promise<string> => {
  // Try GROQ first, fallback to local
  return generateWithGROQ(result, style).catch(() => 
    getTemplate('ranking', style as any)
      .replace('{name}', result.topAlternative.name)
      .replace('{score}', result.topAlternative.score.toFixed(1))
  );
};

export const runMoScript = async (script: MoScript, inputs: Record<string, any>) => {
  // We can't use hooks directly in non-component functions, so we'll return voice data to be handled by the component
  const result = script.logic(inputs);
  let voiceLine = null;

  try {
    if (script.voiceLine) {
      // Try GROQ first, fallback to local voiceLine
      voiceLine = script.voiceLine?.(result) || await generateVoiceLine(result);
    }
  } catch (error) {
    console.error('Voice narration generation failed:', error);
  }

  return { result, voiceLine };
};
