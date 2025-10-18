

import { GoogleGenAI, Type } from "@google/genai";
import { vi } from '../lang/vi';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const analyzeFeedbackSentiment = async (comment: string) => {
  if (!API_KEY) return { sentiment: 'neutral', confidence: 0.99 };
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Phân tích cảm xúc của phản hồi sự kiện này: "${comment}". Phân loại nó là tích cực, trung tính, hoặc tiêu cực.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              description: "Cảm xúc của phản hồi (tích cực, trung tính, tiêu cực, hoặc hỗn hợp).",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Điểm tin cậy từ 0 đến 1."
            }
          },
          required: ["sentiment", "confidence"],
        },
      },
    });
    
    // FIX: Trim whitespace from the response before parsing to prevent errors.
    const jsonResponse = JSON.parse(response.text.trim());
    return jsonResponse;

  } catch (error) {
    console.error("Error analyzing feedback sentiment:", error);
    return { sentiment: 'neutral', confidence: 0.5 };
  }
};


export const analyzeFeedbackTopics = async (comment: string) => {
  if (!API_KEY) return { topics: ["general"] };
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Xác định các chủ đề chính từ phản hồi sự kiện này: "${comment}". Các chủ đề có thể bao gồm 'diễn giả', 'địa điểm', 'giá vé', 'đồ ăn', 'tổ chức', 'âm nhạc'. Trả về tối đa 3 chủ đề.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Một mảng các chủ đề được xác định.'
            },
          },
          required: ["topics"],
        },
      },
    });

    // FIX: Trim whitespace from the response before parsing to prevent errors.
    const jsonResponse = JSON.parse(response.text.trim());
    return jsonResponse;
  } catch (error) {
    console.error("Error analyzing feedback topics:", error);
    return { topics: ["general"] };
  }
};

export const getChatbotResponseStream = async (history: { role: string, parts: { text: string }[] }[], newMessage: string, eventContext?: any) => {
  if (!API_KEY) {
    async function* dummyStream() {
      const message = vi.chatbot.disabledMessage;
      yield { text: message };
    }
    return dummyStream();
  }
  
  const systemInstruction = `Bạn là một trợ lý hữu ích cho nền tảng Eventify AI. Mục tiêu của bạn là trả lời các câu hỏi của người dùng về các sự kiện.
  ${eventContext ? `Bối cảnh sự kiện hiện tại: ${JSON.stringify(eventContext, null, 2)}` : ''}
  Hãy thân thiện và ngắn gọn.`;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
    history
  });
  
  return chat.sendMessageStream({ message: newMessage });
};
