import { GoogleGenAI } from "@google/genai";

export async function getLogo() {
  const cachedLogo = localStorage.getItem('virenza_logo');
  if (cachedLogo) return cachedLogo;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A minimalist, luxury logo for a jewelry brand named "Virenza". The logo should be elegant, sophisticated, and modern. It should feature a stylized letter "V" combined with a subtle diamond or chain link element. The color palette should be black and white. High-end fashion aesthetic. Clean lines, vector style, white background. No text, just the icon.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const logoData = `data:image/png;base64,${part.inlineData.data}`;
        localStorage.setItem('virenza_logo', logoData);
        return logoData;
      }
    }
  } catch (error) {
    console.error('Error generating logo:', error);
  }
  return null;
}
