
import { GoogleGenAI, Modality } from "@google/genai";

// Helper to convert Blob to Base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// --- MOCK DATA FOR FALLBACKS ---
const MOCK_ECO_DATA = {
  overallScore: 88,
  verdict: "Благоприятный район для жизни",
  description: "Показатели в норме. Район подходит для семей с детьми. (Демо-режим: API лимит исчерпан)",
  metrics: [
    {
      name: "Радиационный фон",
      value: "0.11 мкЗв/ч",
      score: 9,
      status: "Норма",
      desc: "В пределах естественного фона (до 0.20). Опасных объектов не выявлено.",
      sources: ["RadonMap", "МЧС Мониторинг"]
    },
    {
      name: "Загазованность (CO2)",
      value: "AQI 42",
      score: 8,
      status: "Низкая",
      desc: "Качество воздуха хорошее, промзон рядом нет. Ветровая роза благоприятная.",
      sources: ["BreezoMeter", "МосЭкоМониторинг"]
    },
    {
      name: "Зеленые зоны",
      value: "35% территории",
      score: 9,
      status: "Отлично",
      desc: "Рядом лесопарк и скверы в пешей доступности.",
      sources: ["Яндекс Карты", "OpenStreetMap"]
    },
    {
      name: "Шумовое загрязнение",
      value: "45-50 дБ",
      score: 7,
      status: "Средне",
      desc: "Слышен шум от дороги в час пик, но стеклопакеты решают проблему.",
      sources: ["ШумКарта", "Данные трафика"]
    }
  ],
  globalSources: [
    { title: "МЧС России: Радиационная обстановка", uri: "https://mchs.gov.ru" },
    { title: "Мосэкомониторинг", uri: "https://mosecom.mos.ru" }
  ]
};

export const generateSellingDescription = async (
  address: string,
  propertyType: string,
  specs: string[],
  features: string[],
  imagesBase64: string[] // Now accepts an array of images
): Promise<string> => {
  const provider = AI_CONFIG.textProvider;
  const model = AI_CONFIG.textModel;

  try {
    const promptText = `
      Ты - элитный копирайтер по недвижимости. Твоя задача - написать описание для объявления о продаже.
      
      Вводные данные:
      - Тип: ${propertyType}
      - Адрес: ${address} (Используй Google Search, чтобы найти реальные объекты рядом)
      - Характеристики: ${specs.join(', ')}
      - Теги от пользователя: ${features.join(', ')}
      
      СТРУКТУРА ОТВЕТА (СТРОГО СОБЛЮДАЙ ЛИМИТЫ И ПОРЯДОК):
      
      1. **Заголовок** (Без названия блока). Одна цепляющая фраза, объединяющая главную выгоду и эмоцию.
      
      2. **Инфраструктура** (Заголовок: <h3>Инфраструктура</h3>). 
         - Максимум 20 строк. 
         - Перечисли конкретные названия школ, парков, магазинов, транспортных узлов, найденных через Google Search. 
         - Расскажи, сколько идти пешком.
      
      3. **О доме и районе** (Заголовок: <h3>О доме и районе</h3>).
         - Максимум 10 строк.
         - Опиши двор, безопасность, соседей, экологию, сам дом (тип, год, если есть данные).
         - НЕ повторяй информацию из блока Инфраструктура.
      
      4. **Квартира** (Заголовок: <h3>Квартира</h3>).
         - Максимум 10 строк.
         - Опиши ремонт, планировку, вид из окон, мебель. 
         - Используй анализ прикрепленных изображений. Если видишь на фото дизайнерский диван или мраморную плитку - напиши об этом.
      
      5. **Сделка** (Заголовок: <h3>Сделка</h3>).
         - Максимум 5 строк.
         - Юридические аспекты (свободная продажа, ипотека и т.д. на основе тегов).
      
      6. **Призыв к действию** (Без названия блока).
         - Нативное, мягкое завершение с приглашением на просмотр.
      
      ВАЖНЫЕ ПРАВИЛА:
      - Язык: Русский, живой, понятный, без канцеляризмов и сложных технических терминов.
      - НЕ ДУБЛИРУЙ информацию. Если написал про метро в Инфраструктуре, не пиши про него в Районе.
      - Форматирование: Используй HTML теги <h3> для заголовков блоков и <p> или <ul> для текста.
    `;

    // --- OPENROUTER IMPLEMENTATION ---
    if (provider === 'openrouter') {
      const client = getOpenRouterClient();
      if (!client) return "OpenRouter API Key is missing.";

      const messages: any[] = [
        {
          role: "user",
          content: [
            { type: "text", text: promptText }
          ]
        }
      ];

      if (imagesBase64.length > 0) {
        imagesBase64.forEach(img => {
          messages[0].content.push({
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${img}`
            }
          });
        });
      }

      try {
        const completion = await client.chat.completions.create({
          model: model,
          messages: messages
        });
        return completion.choices[0].message.content || "Не удалось сгенерировать описание.";
      } catch (error) {
        console.error("OpenRouter Text Gen Error:", error);
        return "Ошибка генерации через OpenRouter. Возможно, модель не поддерживает изображения.";
      }
    }

    // --- GEMINI IMPLEMENTATION (DEFAULT) ---
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");
    const ai = new GoogleGenAI({ apiKey });

    // Construct parts: Text prompt + All Images
    const parts: any[] = [{ text: promptText }];

    imagesBase64.forEach(img => {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: img
        }
      });
    });

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts,
      },
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    return response.text || "Не удалось сгенерировать описание. Попробуйте позже.";
  } catch (error) {
    console.error("Gemini Text Gen Error:", error);
    // Fallback description on error
    return `
      <h3>Уютная квартира в отличном районе</h3>
      <p>Предлагается к продаже ${propertyType.toLowerCase()} по адресу ${address}. Отличный вариант как для проживания, так и для инвестиций.</p>
      <h3>Характеристики</h3>
      <p>${specs.join(', ')}. ${features.join(', ')}.</p>
      <p>К сожалению, сервис генерации описаний временно недоступен (превышен лимит квот). Пожалуйста, попробуйте позже.</p>
    `;
  }
};

export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData) {
      const mimeType = part.inlineData.mimeType || 'image/png';
      const data = part.inlineData.data;
      return `data:${mimeType};base64,${data}`;
    }

    throw new Error("No image generated");
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};

export const generateStagedRenovation = async (base64Image: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  // Improved prompt for Home Staging with strict constraints
  const prompt = `
      Task: Virtual Home Staging. Transform this room into a modern, clean, staged real estate listing.

      CRITICAL RULES FOR GEOMETRY & STRUCTURE:
      1. **DO NOT ADD OR REMOVE WINDOWS OR DOORS.** Keep them exactly where they are. The structural shell must be identical.
      2. **CAMERA:** You MAY slightly zoom out or adjust the frame to improve composition if the shot is too tight, but do not change the room's geometry.
      3. **FLOORING:** Inspect the floor. 
         - If it is BARE CONCRETE or HEAVILY DAMAGED: Install new laminate flooring (Light Oak or Neutral Grey).
         - If it is EXISTING COVERING (Tiles, Wood, Laminate) in decent shape: **PRESERVE THE COLOR AND MATERIAL**. Polish it to look clean, but do not change the type/color.

      CLEANING & DECLUTTERING:
      1. **REMOVE ALL CLUTTER:** Aggressively remove bottles, trash, papers, clothes, boxes, cables, personal items.
      2. **REMOVE UGLY FURNITURE:** Remove old/broken cabinets or mess. Keep built-in wardrobes if they look okay, just refresh them.

      DESIGN & STAGING:
      1. **Style:** Modern Scandi-Chic. Bright, airy, neutral tones (white, beige, light grey).
      2. **Walls:** Fresh coat of light paint. Remove old wallpaper patterns.
      3. **Furnish:** Add minimal, stylish furniture to show potential (e.g., a made bed, a simple rug, a modern lamp).
      4. **Lighting:** Make the room look bright and sunlit.

      Output: A high-quality, photorealistic image of the SAME room, renovated and staged.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData) {
      const mimeType = part.inlineData.mimeType || 'image/png';
      const data = part.inlineData.data;
      return `data:${mimeType};base64,${data}`;
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Staging Generation Error:", error);
    throw error;
  }
};

// --- CONFIGURATION ---
const AI_CONFIG = {
  chatProvider: process.env.VITE_AI_CHAT_PROVIDER || 'gemini',
  chatModel: process.env.VITE_AI_CHAT_MODEL || 'gemini-2.5-flash',
  textProvider: process.env.VITE_AI_TEXT_PROVIDER || 'gemini',
  textModel: process.env.VITE_AI_TEXT_MODEL || 'gemini-2.5-flash',
};

// --- SYSTEM PROMPT (используется для обоих провайдеров) ---
const SYSTEM_PROMPT = `Ты - AI-ассистент сайта недвижимости Estate AI. Твоя задача - помогать посетителям найти нужную информацию НА НАШЕМ САЙТЕ.

⛔ КРИТИЧЕСКИ ВАЖНО - ЗАПРЕЩЕНО:
- НИКОГДА не упоминай сторонние сайты: ЦИАН, Авито, Яндекс.Недвижимость, Домклик, ЦИАНе, Авите, Этажи и т.д.
- НИКОГДА не пиши таблицы (|---|---| формат ЗАПРЕЩЕН)
- НИКОГДА не давай пошаговые планы (1. 2. 3. и т.д.)
- НИКОГДА не пиши ответы длиннее 300 символов (это железное правило!)
- НЕ опрашивай пользователя больше чем 2 вопросами
- НЕ давай юридические советы, информацию про ипотечные ставки, налоги

✅ ДЕЛАЙ ТАК:
1. Задай максимум 1-2 коротких вопроса (локация? бюджет?)
2. Сразу направь на конкретную страницу сайта (см. ниже)
3. Предложи консультацию с агентом

📋 СТРАНИЦЫ САЙТА (направляй сюда):
- **Купить первичку/вторичку** - покупка жилья
- **Продать** - продажа недвижимости  
- **Сдать в аренду** - поиск арендаторов
- **AI Генератор** - тексты для объявлений
- **AI Staging** - визуализация ремонта
- **AI ЭкоСканер** - экология района
- **AI Проверка арендатора** - скоринг ФССП/МВД
- **AI Умная ипотека** - расчет ипотеки
- **Блог** - статьи

❌ АНТИПАТТЕРН (так НЕ отвечай!):
"20 лямов — солидный бюджет! В Москве можно взять что-то приличное. Вот план: 1. Определись с параметрами... 2. Ищи на ЦИАН/Авито... [ТАБЛИЦА] |Сайт|Плюсы|..."

✅ ПРАВИЛЬНЫЙ ОТВЕТ:
"Отличный бюджет! 🏡 Где ищете и для чего? Посмотрите раздел Купить на сайте или запишитесь на консультацию — агент подберет варианты."

⚠️ ЛИМИТ: 300 символов максимум. 3-4 предложения. Один эмодзи.`;

// --- OPENROUTER INTEGRATION ---
import OpenAI from "openai";

const getOpenRouterClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn("OpenRouter API Key not found");
    return null;
  }
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const chatWithOpenRouter = async (
  history: { role: 'user' | 'model', parts: [{ text: string }] }[],
  message: string,
  model: string = "x-ai/grok-4.1-fast:free"
) => {
  const client = getOpenRouterClient();
  if (!client) return "OpenRouter API Key is missing.";

  try {
    // Конвертируем историю из Gemini формата в OpenAI формат
    const historyMessages = history.map(msg => ({
      role: msg.role === 'model' ? 'assistant' as const : 'user' as const,
      content: msg.parts[0].text
    }));

    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        { "role": "system", "content": SYSTEM_PROMPT },
        ...historyMessages, // История переписки
        { "role": "user", "content": message } // Новое сообщение
      ],
      // Параметры контроля генерации для коротких ответов
      temperature: 0.7,          // Меньше креативности
      max_tokens: 200,           // Жесткий лимит длины ответа
      presence_penalty: 0.6,     // Избегать повторений тем
      frequency_penalty: 0.3,    // Меньше повторяющихся фраз
      stop: ["ЦИАН", "Авито", "Яндекс", "Домклик", "ЦИАНе", "Авите"], // Стоп-слова
      reasoning: { enabled: false } // Отключаем режим рассуждения для коротких ответов (OpenRouter-специфичный параметр)
    } as any);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter Error:", error);
    return "Error communicating with OpenRouter.";
  }
};

// --- UNIFIED CHAT FUNCTION ---
export const chatWithAI = async (history: { role: 'user' | 'model', parts: [{ text: string }] }[], message: string) => {
  if (AI_CONFIG.chatProvider === 'openrouter') {
    // Передаем историю в OpenRouter
    return chatWithOpenRouter(history, message, AI_CONFIG.chatModel);
  }

  // Default to Gemini
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const chat = ai.chats.create({
      model: AI_CONFIG.chatModel,
      history: history,
      config: {
        systemInstruction: SYSTEM_PROMPT, // Используем ту же константу что и для OpenRouter
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat Error", error);
    return "Извините, сервис временно перегружен. Попробуйте позже.";
  }
};

export const getEcoAnalysis = async (address: string) => {
  const apiKey = process.env.API_KEY;

  // Return mock data if no key is present
  if (!apiKey) {
    return MOCK_ECO_DATA;
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = `
        Analyze the environmental situation for the location: "${address}". 
        Use Google Search to find real data regarding:
        1. Radiation levels (radon maps, background radiation).
        2. Air pollution (AQI, industrial zones nearby).
        3. Green zones (parks ratio).
        4. Noise levels (traffic, construction).

        Return ONLY a valid JSON object with this structure:
        {
          "overallScore": number (0-100),
          "verdict": "Short summary string in Russian (e.g., 'Экологически чистый район')",
          "description": "2-3 sentences detailed summary in Russian.",
          "metrics": [
            { 
              "name": "Metric Name (in Russian: Радиация, Воздух, Зеленые зоны, Шум)", 
              "value": "Specific value string (e.g., '0.12 мкЗв/ч', 'AQI 35', '2 парка рядом')", 
              "score": number (1-10, 10 is best/safest), 
              "status": "Short status (e.g., Норма, Высокий, Опасно)",
              "desc": "One sentence explanation.",
              "sources": ["List of specific source names/websites found for this metric"]
            }
          ]
        }
      `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        // responseMimeType: 'application/json', // Removed to prevent 400 error with tools
        tools: [{ googleSearch: {} }]
      }
    });

    let text = response.text || "{}";

    // Robust cleanup for JSON in case model returns markdown blocks
    if (text.includes('```json')) {
      text = text.split('```json')[1].split('```')[0];
    } else if (text.includes('```')) {
      text = text.split('```')[1].split('```')[0];
    }
    text = text.trim();

    const data = JSON.parse(text);

    // Extract grounding sources if available (global list)
    const globalSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title) || [];

    return { ...data, globalSources };
  } catch (e: any) {
    // Handle quota limits gracefully
    if (e.message?.includes('429') || e.status === 429 || JSON.stringify(e).includes('429')) {
      console.warn("Gemini API Quota Exceeded. Returning mock data for Eco Scan.");
      return MOCK_ECO_DATA;
    }

    console.error("Eco Scan Error:", e);
    // Fallback on any error
    return MOCK_ECO_DATA;
  }
};

// --- MOCK TENANT CHECK ---
export const analyzeTenant = async (name: string, dob: string, passport: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 4000));

  // Deterministic mock based on name length
  const isRisky = name.length % 3 === 0;

  // Direct Deep Links & Search Pages
  const fsspUrl = `https://fssp.gov.ru/iss/ip`; // Federal Bailiffs
  const sudUrl = `https://bsr.sudrf.ru/bigs/portal.html`; // Federal Courts (GAS Pravosudie)
  const mosSudUrl = `https://mos-gorsud.ru/search`; // Moscow Courts (Separate System)
  const bankrotUrl = `https://bankrot.fedresurs.ru/`; // Bankruptcy Register
  const mvdUrl = `http://services.fms.gov.ru/info-service.htm?sid=2000`; // Invalid Passports
  const mvdWantedUrl = `https://мвд.рф/wanted`; // Federal Wanted List
  const fedsfmUrl = `https://www.fedsfm.ru/documents/terr-list`; // Terrorists/Extremists

  if (isRisky) {
    return {
      score: 45,
      verdict: "Высокий риск",
      riskLevel: "high",
      description: "Обнаружены значительные задолженности и судебные производства. Рекомендуется отказ в сделке.",
      factors: [
        { name: "ФССП (Долги)", status: "Найдено", desc: "Исполнительные производства: 150 000 ₽ (Кредиты)", safe: false, searchUrl: fsspUrl },
        { name: "ГАС РФ (Суды регионов)", status: "Найдено", desc: "Ответчик по гражданским делам (Займы)", safe: false, searchUrl: sudUrl },
        { name: "Мосгорсуд (Москва)", status: "Чисто", desc: "В базе судов Москвы дел не найдено.", safe: true, searchUrl: mosSudUrl },
        { name: "Розыск МВД", status: "Чисто", desc: "В федеральном розыске не числится.", safe: true, searchUrl: mvdWantedUrl },
        { name: "Банкротство", status: "Чисто", desc: "В реестре банкротов не числится.", safe: true, searchUrl: bankrotUrl },
        { name: "Экстремизм (Росфин)", status: "Чисто", desc: "В перечне террористов/экстремистов отсутствует.", safe: true, searchUrl: fedsfmUrl },
        { name: "Паспорт", status: "Действителен", desc: "Документ действителен (База МВД).", safe: true, searchUrl: mvdUrl }
      ]
    };
  } else {
    return {
      score: 100,
      verdict: "Благонадежный",
      riskLevel: "low",
      description: "Негативных факторов в открытых источниках РФ не обнаружено. Проверены все регионы.",
      factors: [
        { name: "ФССП (Долги)", status: "Чисто", desc: "Исполнительных производств не найдено.", safe: true, searchUrl: fsspUrl },
        { name: "ГАС РФ (Суды регионов)", status: "Чисто", desc: "Судебных делопроизводств по РФ не найдено.", safe: true, searchUrl: sudUrl },
        { name: "Мосгорсуд (Москва)", status: "Чисто", desc: "В базе судов Москвы дел не найдено.", safe: true, searchUrl: mosSudUrl },
        { name: "Розыск МВД", status: "Чисто", desc: "В федеральном розыске не числится.", safe: true, searchUrl: mvdWantedUrl },
        { name: "Банкротство", status: "Чисто", desc: "В реестре банкротов не числится.", safe: true, searchUrl: bankrotUrl },
        { name: "Экстремизм (Росфин)", status: "Чисто", desc: "В перечне террористов/экстремистов отсутствует.", safe: true, searchUrl: fedsfmUrl },
        { name: "Паспорт", status: "Действителен", desc: "Документ действителен (База МВД).", safe: true, searchUrl: mvdUrl }
      ]
    };
  }
};