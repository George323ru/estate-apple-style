import React, { useState, useRef } from 'react';
import Section from '../components/Section';
import { Upload, Wand2, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { editImageWithGemini, blobToBase64 } from '../services/aiService';

const StagingAI: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const base64 = await blobToBase64(file);
      setSelectedImage(base64);
      setResultImage(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Ошибка загрузки файла.");
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) {
      setError("Пожалуйста, загрузите фото и введите описание.");
      return;
    }
    if (!process.env.API_KEY) {
      setError("API ключ не найден. Пожалуйста, настройте окружение.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await editImageWithGemini(selectedImage, prompt);
      setResultImage(result);
    } catch (err: any) {
      console.error(err);
      setError("Не удалось обработать изображение. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen">
      <Section title="AI Стейджинг" subtitle="Преобразите интерьер силой Gemini 2.5 Flash Image.">
        
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-12 max-w-5xl mx-auto">
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Input Section */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">1. Загрузите фото</h3>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    selectedImage ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {selectedImage ? (
                    <img src={`data:image/png;base64,${selectedImage}`} alt="Original" className="h-full w-full object-cover rounded-2xl" />
                  ) : (
                    <>
                      <Upload size={48} className="text-gray-400 mb-4" />
                      <p className="text-gray-500">Нажмите или перетащите фото</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">2. Опишите изменения</h3>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Например: 'Добавь современный диван', 'Убери человека', 'Сделай стиль лофт', 'Добавь ретро фильтр'"
                    className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-32 text-lg"
                  />
                  <div className="absolute bottom-4 right-4">
                    <Wand2 size={20} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !selectedImage || !prompt}
                className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  loading || !selectedImage || !prompt 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800 hover:scale-[1.02] shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" /> Обработка...
                  </>
                ) : (
                  <>
                    <Wand2 /> Преобразить
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}
            </div>

            {/* Output Section */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Результат</h3>
                <div className="bg-gray-100 rounded-2xl h-[500px] flex items-center justify-center overflow-hidden relative">
                  {loading ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-500 animate-pulse">Gemini думает...</p>
                    </div>
                  ) : resultImage ? (
                    <>
                      <img src={resultImage} alt="Generated" className="w-full h-full object-contain" />
                      <a 
                        href={resultImage} 
                        download="estate-ai-edit.png"
                        className="absolute bottom-6 right-6 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:scale-110 transition-transform text-gray-900"
                      >
                        <Download size={24} />
                      </a>
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <PaintbrushIcon />
                      </div>
                      <p className="text-gray-400 text-lg">Здесь появится ваше новое пространство</p>
                    </div>
                  )}
                </div>
              </div>
              
              {resultImage && (
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                  <h4 className="font-bold text-green-800 mb-2">Успех!</h4>
                  <p className="text-green-700">Изображение успешно обработано с помощью Gemini 2.5 Flash Image.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

const PaintbrushIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <path d="M18.375 2.625a3.86 3.86 0 0 0-3.86 3.86c0 1.805 1.04 3.4 2.575 4.225.895 2.465.315 5.86-3.135 9.315-3.45 3.45-6.85 4.03-9.315 3.135-.825-1.535-2.42-2.575-4.225-2.575A3.86 3.86 0 0 0 2.625 18.375" />
  </svg>
);

export default StagingAI;