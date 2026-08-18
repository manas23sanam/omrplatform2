import type { OMRSection } from '../types/test';

export interface OMRResult {
  rollNumber: string;
  score: number;
  maxScore: number;
  accuracy: number;
  answers: {
    questionNumber: number;
    selectedOption: string | null;
    isCorrect: boolean;
    correctOption: string;
  }[];
}

export const evaluateOMRSheet = async (
  imageBase64: string,
  section: OMRSection,
  apiKey: string
): Promise<OMRResult> => {
  if (!apiKey) {
    throw new Error('Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  // Strip the data:image prefix if present
  const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  const prompt = `You are a highly accurate Optical Mark Recognition (OMR) evaluation system for a NEET coaching institute.
You are given an image of an OMR sheet for the section: ${section}.

Please perform the following tasks:
1. Extract the student's Roll Number (if visible). If not visible, return "UNKNOWN".
2. Identify all answered questions on the sheet. For each question, determine which bubble is filled. (Note: if bubbles are numbered 1, 2, 3, 4, map them to A, B, C, D respectively).
3. Evaluate the answers based on a hypothetical answer key (assume the correct answer for every question is 'A' for demonstration purposes).
4. Calculate the score: +4 for every correct answer, -1 for every incorrect answer, 0 for unattempted.

Return ONLY a valid JSON object with the following structure, and no markdown formatting (do not wrap in \`\`\`json):
{
  "rollNumber": "string",
  "score": number,
  "maxScore": number,
  "accuracy": number,
  "answers": [
    {
      "questionNumber": number,
      "selectedOption": "A" | "B" | "C" | "D" | null,
      "isCorrect": boolean,
      "correctOption": "A" | "B" | "C" | "D"
    }
  ]
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API Error: ${response.statusText} ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textResponse) {
    throw new Error('Failed to parse response from Gemini API');
  }

  try {
    const result: OMRResult = JSON.parse(textResponse.trim());
    return result;
  } catch (error) {
    throw new Error('Failed to parse Gemini JSON output: ' + textResponse);
  }
};




