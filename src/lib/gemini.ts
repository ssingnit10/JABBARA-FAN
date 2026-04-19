import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function translateText(text: string, targetLanguage: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following IPL fan comment to ${targetLanguage}. Keep the sporting passion and context: "${text}"`,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

export async function summarizeThread(messages: { sender: string; text: string }[]) {
  try {
    const threadText = messages.map(m => `${m.sender}: ${m.text}`).join("\n");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following IPL fan discussion thread in 3 concise bullet points. Focus on the main talking points and team sentiments:\n\n${threadText}`,
    });
    return response.text?.trim() || "No summary available.";
  } catch (error) {
    console.error("Summarization error:", error);
    return "Failed to summarize thread.";
  }
}

export async function generateSportsmanshipChallenge(teamA: string, teamB: string, winner: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a 'Sportsmanship Challenge' for fans of ${teamA} and ${teamB} after ${winner} won. 
      Return a JSON object with:
      - 'trivia': { 'question': string, 'options': string[], 'correctIndex': number }
      - 'poll': { 'question': string, 'options': string[] }
      - 'debatePrompt': string
      Keep it light-hearted and focused on match performance.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Challenge generation error:", error);
    return null;
  }
}

export async function generateBanter(teamA: string, teamB: string, winner: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a sportive, light-hearted banter message between a supporter of ${teamA} and ${teamB}. The match ended with ${winner} winning. Keep it friendly and focused on IPL spirit.`,
    });
    return response.text?.trim() || "Good game!";
  } catch (error) {
    console.error("Banter error:", error);
    return "What a match!";
  }
}

export async function getFanSentiment(matchEvents: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the sentiment of these real-time match events from an IPL fan perspective. Respond with a single JSON object having 'sentiment' (number -1 to 1) and 'insight' (short string). Events: ${matchEvents.join(", ")}`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{"sentiment": 0, "insight": "Neutral"}');
  } catch (error) {
    return { sentiment: 0, insight: "Steady match" };
  }
}
