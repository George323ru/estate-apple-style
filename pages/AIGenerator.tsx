
import React, { useState, useRef, useEffect } from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import Modal from '../components/Modal';
import ServiceLanding from '../components/ServiceLanding';
import { generateSellingDescription, blobToBase64 } from '../services/aiService';
import { Sparkles, Copy, Check, AlertCircle, MapPin, X, UploadCloud, ShieldCheck, Plus, ChevronRight, ArrowLeft, PenTool, Zap, Image, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_ADDRESSES = [
  "Москва, Пресненская набережная, 12",
  "Москва, Мосфильмовская, 8",
  "Москва, Кутузовский проспект, 32",
  "Москва, Ленинский проспект, 45",
  "Санкт-Петербург, Невский проспект, 114",
  "Сочи, Курортный проспект, 105",
  "Казань, ул. Сибгата Хакима, 50"
];

const PROPERTY_TYPES = ["Квартира", "Дом/Коттедж", "Коммерция", "Участок"];
const ROOM_OPTIONS = ["Студия", "1", "2", "3", "4", "5+"];
const REPAIR_OPTIONS = ["Черновая", "White Box", "Косметический", "Евроремонт", "Дизайнерский"];

const FEATURES_DATABASE: Record<string, Record<string, string[]>> = {
  "Квартира": {
    "Интерьер": ["Высокие потолки", "Панорамные окна", "Гардеробная", "2+ санузла", "Мебель остается", "Техника остается", "Теплый пол", "Кондиционер", "Бойлер", "Джакузи", "Камин (био)", "Умный дом"],
    "Дом/Двор": ["Закрытая территория", "Подземный паркинг", "Двор без машин", "Консьерж", "Охрана 24/7", "Видеонаблюдение", "Детская площадка", "Спортивная площадка", "Колясочная", "Вид на парк", "Вид на воду", "Вид на сити"],
    "Локация": ["Метро < 5 мин", "Метро < 15 мин", "Рядом парк", "Рядом школа", "Рядом детский сад", "Фитнес в доме", "ТЦ рядом", "Тихий центр", "Спальный район", "Удобный выезд"],
    "Сделка": ["Свободная продажа", "Один собственник", "Более 5 лет", "Ипотека возможна", "Мат. капитал", "Никто не прописан", "Быстрый выход", "Торг"]
  },
  "Дом/Коттедж": {
    "Участок": ["ИЖС", "СНТ", "Лесной участок", "У воды", "Ландшафтный дизайн", "Газон", "Автополив", "Беседка", "Мангальная зона", "Гараж", "Навес для авто"],
    "Дом": ["Кирпич", "Брус", "Каркасный", "Газоблок", "Панорамное остекление", "Второй свет", "Терраса", "Балкон", "Баня/Сауна", "Бассейн", "Камин", "Подвал/Цоколь"],
    "Коммуникации": ["Газ магистральный", "Электричество 15кВт+", "Скважина", "Септик", "Центральная вода", "Центральная канализация", "Интернет оптоволокно", "Асфальт до дома"],
    "Сделка": ["Дом зарегистрирован", "Прописка", "Ипотека", "Вся сумма в договоре", "Срочно"]
  },
  "Коммерция": {
    "Помещение": ["Отдельный вход", "Витринные окна", "Первый этаж", "Свободная планировка", "Кабинетная планировка", "Мокрая точка", "Вытяжка", "Электричество 30кВт+"],
    "Бизнес": ["Высокий трафик", "Густонаселенный район", "Первая линия", "Реклама на фасаде", "Есть арендатор", "Готовый бизнес", "Зона разгрузки", "Парковка для клиентов"],
    "Сделка": ["С НДС", "УСН", "ППА (Переуступка)", "Долгосрочный договор", "Собственник физ.лицо"]
  },
  "Участок": {
    "Характеристики": ["ИЖС", "СНТ", "Промназначение", "Ровный", "На склоне", "Правильной формы", "Угловой", "На берегу", "Лесной"],
    "Коммуникации": ["Газ по границе", "Газ заведен", "Электричество", "Вода", "Дороги чистят"],
    "Инфраструктура": ["Магазин в поселке", "Охрана поселка", "Шлагбаум", "Рядом ж/д станция", "Лес рядом", "Озеро/Река рядом"]
  }
};

const AIGenerator: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [address, setAddress] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [phone, setPhone] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(true); 
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [propertyType, setPropertyType] = useState('Квартира');
  const [selectedRooms, setSelectedRooms] = useState<string>('');
  const [selectedRepair, setSelectedRepair] = useState<string>('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [activeFeatureTab, setActiveFeatureTab] = useState<string>("Интерьер");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const auth = localStorage.getItem('estate_auth');
      if (auth === 'true') setIsAuthorized(true);
  }, []);

  const currentFeatures = FEATURES_DATABASE[propertyType] || {};
  const featureTabs = Object.keys(currentFeatures);
  
  useEffect(() => {
    const tabs = Object.keys(FEATURES_DATABASE[propertyType] || {});
    if (tabs.length > 0) setActiveFeatureTab(tabs[0]);
    setSelectedFeatures([]);
  }, [propertyType]);

  const filteredAddresses = MOCK_ADDRESSES.filter(addr => 
    addr.toLowerCase().includes(address.toLowerCase()) && address.length > 0
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      const totalFiles = imageFiles.length + newFiles.length;
      if (totalFiles > 10) {
        setError("Максимум 10 фотографий");
        return;
      }
      setImageFiles(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      setError(null);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validatePhone = (input: string) => {
    const digits = input.replace(/\D/g, '');
    if (digits.length === 10) return true;
    if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) return true;
    return false;
  };

  const formatPhone = (input: string) => {
    let digits = input.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length === 10) digits = '7' + digits;
    if (digits.length === 11 && digits.startsWith('8')) digits = '7' + digits.substring(1);
    if (digits.length === 11) {
      return `+7 (${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7, 9)}-${digits.substring(9, 11)}`;
    }
    return input;
  };

  const handleGenerate = async () => {
    if (!address) return setError('Укажите адрес для анализа инфраструктуры.');
    if (!validatePhone(phone)) return setError('Неверный формат телефона.');
    if (imageFiles.length === 0) return setError('Загрузите хотя бы одно фото.');
    if (!selectedRepair && propertyType === 'Квартира') return setError('Укажите тип ремонта.');
    if (!privacyAccepted) return setError('Примите соглашение.');

    setLoading(true);
    setError(null);
    setGeneratedDescription('');

    try {
      const imageBase64Promises = imageFiles.map(file => blobToBase64(file));
      const imagesBase64 = await Promise.all(imageBase64Promises);
      const specs = [];
      if (selectedRooms && propertyType === 'Квартира') specs.push(`${selectedRooms} комн.`);
      if (selectedRepair && propertyType !== 'Участок') specs.push(selectedRepair);
      const desc = await generateSellingDescription(address, propertyType, specs, selectedFeatures, imagesBase64);
      setGeneratedDescription(desc);
    } catch (e) {
      console.error(e);
      setError('Ошибка соединения с AI. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generatedDescription;
    navigator.clipboard.writeText(tempDiv.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAuthorized) {
      return (
          <ServiceLanding 
            title="Генератор описаний"
            subtitle="Идеальное объявление о продаже за 30 секунд."
            description="AI анализирует ваши фото, находит инфраструктуру на картах и составляет продающий текст, который повышает конверсию в звонки на 40%."
            icon={<PenTool />}
            colorTheme="blue"
            buttonText="Создать объявление"
            onStart={() => setIsAuthorized(true)}
            features={[
                { title: "Анализ фото", desc: "Нейросеть видит детали интерьера: 'паркет', 'дизайнерская лампа', 'вид на закат'.", icon: <Image className="text-blue-600"/> },
                { title: "Инфраструктура", desc: "Автоматически находит школы, парки и метро рядом с домом.", icon: <MapPin className="text-blue-600"/> },
                { title: "Продающая структура", desc: "Текст разбивается на блоки с эмоциональными заголовками и призывом к действию.", icon: <Layout className="text-blue-600"/> }
            ]}
          />
      );
  }

  return (
    <div className="pt-32 pb-12 min-h-screen bg-[#F5F5F7]">
      <Section className="py-8">
        <div className="mb-8">
             <Link to="/ai" className="inline-flex items-center text-gray-500 hover:text-black transition-colors mb-6">
                 <ArrowLeft size={20} className="mr-2" /> Все инструменты AI
             </Link>
             <div className="text-center mb-10">
                <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-4">Powered by Gemini 2.5</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Генератор описания</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                    Создайте идеальное объявление за 1 минуту.
                </p>
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto items-start">
          <GlassCard className="lg:col-span-6 p-6 md:p-8">
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Тип недвижимости</label>
                <div className="grid grid-cols-2 gap-3">
                  {PROPERTY_TYPES.map(t => (
                    <button 
                      key={t} 
                      onClick={() => setPropertyType(t)}
                      className={`py-4 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        propertyType === t 
                          ? 'bg-black text-white shadow-lg scale-[1.02]' 
                          : 'bg-[#F2F2F7] text-gray-600 hover:bg-white border border-transparent hover:border-gray-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative" ref={addressInputRef}>
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Адрес</label>
                 <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      value={address}
                      onChange={e => { setAddress(e.target.value); setShowSuggestions(true); }}
                      className="w-full pl-12 pr-4 py-4 rounded-xl apple-input text-lg outline-none"
                      placeholder="Введите адрес..."
                    />
                 </div>
                 {showSuggestions && filteredAddresses.length > 0 && (
                   <div className="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                     {filteredAddresses.map((addr, i) => (
                       <div key={i} onClick={() => { setAddress(addr); setShowSuggestions(false); }} className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-none flex items-center gap-2">
                         <MapPin size={14} className="text-blue-500" /> {addr}
                       </div>
                     ))}
                   </div>
                 )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Фотографии ({imageFiles.length}/10)
                </label>
                <div className="grid grid-cols-4 gap-2">
                   {imagePreviews.map((src, idx) => (
                     <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200 shadow-sm">
                       <img src={src} alt="preview" className="w-full h-full object-cover" />
                       <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur">
                         <X size={12} />
                       </button>
                     </div>
                   ))}
                   {imageFiles.length < 10 && (
                     <div onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all bg-[#F2F2F7]">
                        <Plus className="text-gray-400" size={24} />
                     </div>
                   )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple className="hidden" />
              </div>

              {propertyType === 'Квартира' && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Комнаты</label>
                    <div className="relative">
                      <select 
                        value={selectedRooms} 
                        onChange={(e) => setSelectedRooms(e.target.value)}
                        className="w-full p-4 rounded-xl apple-input text-base appearance-none outline-none"
                      >
                        <option value="" disabled>Выбрать...</option>
                        {ROOM_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronRight className="absolute right-4 top-4 text-gray-400 rotate-90 pointer-events-none" size={20} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ремонт</label>
                    <div className="relative">
                      <select 
                        value={selectedRepair} 
                        onChange={(e) => setSelectedRepair(e.target.value)}
                        className="w-full p-4 rounded-xl apple-input text-base appearance-none outline-none"
                      >
                         <option value="" disabled>Выбрать...</option>
                         {REPAIR_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronRight className="absolute right-4 top-4 text-gray-400 rotate-90 pointer-events-none" size={20} />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Особенности</label>
                <div className="flex flex-wrap gap-2 mb-4 p-1 bg-[#F2F2F7] rounded-xl">
                  {featureTabs.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveFeatureTab(cat)}
                      className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                        activeFeatureTab === cat 
                          ? 'bg-white text-black shadow-sm' 
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 content-start min-h-[100px]">
                  {FEATURES_DATABASE[propertyType]?.[activeFeatureTab]?.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleFeature(opt)}
                      className={`px-3 py-2 rounded-full border text-xs font-bold transition-all ${
                        selectedFeatures.includes(opt)
                          ? 'bg-black text-white border-black shadow-md' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onBlur={() => setPhone(formatPhone(phone))}
                  placeholder="Телефон (+7...)"
                  className={`w-full p-4 rounded-xl apple-input text-lg outline-none mb-4 font-medium tracking-wide ${error && !validatePhone(phone) ? 'border-red-300 ring-2 ring-red-100' : ''}`}
                />

                <div className="flex items-center gap-3 mb-6">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      id="privacy" 
                      checked={privacyAccepted}
                      onChange={e => setPrivacyAccepted(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:border-blue-500 checked:bg-blue-500 transition-all"
                    />
                    <Check size={14} className="absolute left-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <label htmlFor="privacy" className="text-xs text-gray-500 select-none">
                    Согласен с <button onClick={() => setShowPrivacyModal(true)} className="text-black font-bold hover:underline">правилами</button>
                  </label>
                </div>
                
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 mb-4 text-sm font-medium animate-pulse"><AlertCircle size={18}/> {error}</div>}

                <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="apple-btn-primary w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? <Sparkles className="animate-spin" size={20} /> : <Sparkles size={20} className="text-yellow-400" />}
                  {loading ? "Думаем..." : "Сгенерировать"}
                </button>
              </div>

            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-6 min-h-[600px] bg-white border border-white/60 flex flex-col relative shadow-xl">
             <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <ShieldCheck className="text-green-500" size={20} />
                  Результат
                </h3>
                {generatedDescription && (
                  <button onClick={copyToClipboard} className="apple-btn-secondary text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2">
                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Скопировано" : "Копировать"}
                  </button>
                )}
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
               {generatedDescription ? (
                 <div 
                   className="prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:font-bold prose-h3:text-lg prose-h3:text-blue-700 prose-li:marker:text-blue-500"
                   dangerouslySetInnerHTML={{__html: generatedDescription}}
                 />
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-6">
                    {loading ? (
                      <div className="flex flex-col items-center animate-pulse">
                        <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
                          <Sparkles className="text-blue-500 animate-spin" size={24} />
                        </div>
                        <p className="text-sm mt-2 text-gray-500 font-bold">Gemini пишет текст...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-[#F2F2F7] rounded-3xl flex items-center justify-center border border-gray-200 shadow-inner">
                          <UploadCloud size={32} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-400">Здесь появится описание</p>
                        </div>
                      </>
                    )}
                 </div>
               )}
             </div>
          </GlassCard>
        </div>
      </Section>

      <Modal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} title="Конфиденциальность">
        <div className="prose prose-sm max-w-none text-gray-600">
          <p>Мы обрабатываем данные только для генерации текста. Фотографии не сохраняются на сервере после завершения сессии.</p>
          <div className="mt-6 flex justify-end">
            <button onClick={() => setShowPrivacyModal(false)} className="apple-btn-primary px-6 py-2 rounded-lg font-bold text-xs">Ок</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AIGenerator;
