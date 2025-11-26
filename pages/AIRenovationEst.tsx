
import React, { useState, useRef, useEffect } from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import ServiceLanding from '../components/ServiceLanding';
import { Hammer, ArrowLeft, Upload, CheckCircle, AlertCircle, Calculator, Plus, X, ChevronRight, Download, Phone, Sparkles, Ruler, RefreshCw, Clock, FileText, Palette, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blobToBase64, generateStagedRenovation } from '../services/aiService';
import Modal from '../components/Modal';
import LeadForm from '../components/LeadForm';

const PRICES = {
    primer_walls: 40, 
    wallpaper: 255,   
    stretch_ceiling: 590, 
    ceiling_skirting: 155, 
    floor_skirting_pvc: 250, 
    laminate: 350, 
    socket_install: 450, 
    light_install: 735,  
    cleaning: 150, 
    door_install: 4500 
};

const AIRenovationEst: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentGeneratingIndex, setCurrentGeneratingIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [photos, setPhotos] = useState<{original: string, generated: string | null, error?: string}[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [planImage, setPlanImage] = useState<string | null>(null);
  const [area, setArea] = useState('');
  const [ceilingHeight, setCeilingHeight] = useState('2.7');
  const planInputRef = useRef<HTMLInputElement>(null);
  const [estimateItems, setEstimateItems] = useState<any[]>([]);
  const [totalWorkSum, setTotalWorkSum] = useState(0);
  const [isGeometryAssumed, setIsGeometryAssumed] = useState(false);
  const [isSurveyorModalOpen, setIsSurveyorModalOpen] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
      const auth = localStorage.getItem('estate_auth');
      if (auth === 'true') setIsAuthorized(true);
  }, []);

  useEffect(() => {
    let interval: number;
    if (currentGeneratingIndex !== null && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentGeneratingIndex, timeLeft]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newPhotos = await Promise.all(files.map(async (file) => ({
        original: await blobToBase64(file as Blob),
        generated: null,
        error: undefined
    })));
    setPhotos(prev => [...prev, ...newPhotos]);
    e.target.value = ''; 
  };

  const removePhoto = (index: number) => {
      setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const startAIGeneration = async () => {
      setGlobalError(null);
      if (photos.length === 0) return;
      setLoading(true);
      try {
          for (let i = 0; i < photos.length; i++) {
              if (photos[i].generated) continue;
              setCurrentGeneratingIndex(i);
              setTimeLeft(90); 
              try {
                  const timeoutPromise = new Promise<string>((_, reject) => 
                      setTimeout(() => reject(new Error("Timeout")), 240000)
                  );
                  const generatePromise = generateStagedRenovation(photos[i].original);
                  const staged = await Promise.race([generatePromise, timeoutPromise]);
                  setPhotos(prev => prev.map((p, idx) => idx === i ? { ...p, generated: staged, error: undefined } : p));
              } catch (err) {
                  console.error(`Failed to generate photo ${i + 1}`, err);
                  setPhotos(prev => prev.map((p, idx) => idx === i ? { ...p, error: "Ошибка API. Повторите.", generated: null } : p));
              }
          }
      } catch (e) {
          console.error("System Error", e);
          setGlobalError("Произошла системная ошибка при генерации.");
      } finally {
          setLoading(false);
          setCurrentGeneratingIndex(null);
          setTimeLeft(0);
      }
  };

  const handlePlanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const base64 = await blobToBase64(file);
          setPlanImage(base64);
      }
  };

  const calculateEstimate = () => {
      setGlobalError(null);
      const areaNum = parseFloat(area);
      const heightNum = parseFloat(ceilingHeight);
      if (!areaNum || !heightNum) {
          setGlobalError("Пожалуйста, укажите площадь и высоту потолков для точного расчета.");
          return false;
      }
      const perimeter = Math.sqrt(areaNum) * 4; 
      const wallAreaTotal = perimeter * heightNum;
      const wallAreaNet = wallAreaTotal * 0.85;
      setIsGeometryAssumed(true);
      const items = [
          { name: "Монтаж натяжного потолка", price: PRICES.stretch_ceiling, unit: "м²", qty: areaNum },
          { name: "Монтаж потолочного плинтуса", price: PRICES.ceiling_skirting, unit: "мп", qty: perimeter },
          { name: "Грунтовка стен (1 цикл)", price: PRICES.primer_walls, unit: "м²", qty: wallAreaNet },
          { name: "Поклейка обоев (без подгонки)", price: PRICES.wallpaper, unit: "м²", qty: wallAreaNet },
          { name: "Монтаж плинтуса ПВХ", price: PRICES.floor_skirting_pvc, unit: "мп", qty: perimeter },
          { name: "Монтаж углов плинтуса", price: 82, unit: "шт", qty: 6 },
          { name: "Монтаж розетки/выкл", price: PRICES.socket_install, unit: "шт", qty: Math.ceil(areaNum / 6) },
          { name: "Монтаж люстры", price: PRICES.light_install, unit: "шт", qty: Math.ceil(areaNum / 15) },
          { name: "Установка межкомнатных дверей", price: PRICES.door_install, unit: "шт", qty: 1 },
          { name: "Уборка строительная", price: PRICES.cleaning, unit: "м²", qty: areaNum }
      ];
      const total = items.reduce((acc, item) => acc + (Math.ceil(item.qty) * item.price), 0);
      setEstimateItems(items);
      setTotalWorkSum(total);
      return true;
  };

  const handleGenerateEstimate = () => {
      const success = calculateEstimate();
      if (success) {
          setStep(3);
      }
  };

  const downloadPDF = async () => {
      setGlobalError(null);
      try {
          // Dynamic import to avoid Script Error on load if CDN is flaky
          const jsPDFModule = await import('jspdf');
          const autoTableModule = await import('jspdf-autotable');
          
          // Robust export handling
          const jsPDF = jsPDFModule.default || (jsPDFModule as any).jsPDF || jsPDFModule;
          const autoTable = autoTableModule.default || autoTableModule;

          const doc = new jsPDF();
          doc.setFontSize(22);
          doc.text("СМЕТА НА РЕМОНТ (HOME STAGING)", 20, 20);
          doc.setFontSize(10);
          doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 150, 20);
          doc.text(`Площадь: ${area} м²`, 150, 25);
          doc.text(`Высота: ${ceilingHeight} м`, 150, 30);
          if (isGeometryAssumed) {
              doc.setTextColor(220, 38, 38);
              doc.setFontSize(9);
              doc.text("ВНИМАНИЕ: Объемы работ рассчитаны математически на основе площади. Требуется замер.", 20, 40);
              doc.setTextColor(0);
          }
          const tableData = estimateItems.map(item => [
              item.name,
              `${Math.ceil(item.qty)} ${item.unit}`,
              `${item.price} ₽`,
              `${(Math.ceil(item.qty) * item.price).toLocaleString()} ₽`
          ]);
          tableData.push([
              { content: 'ИТОГО РАБОТЫ:', styles: { fontStyle: 'bold' } }, 
              "", 
              "", 
              { content: `${totalWorkSum.toLocaleString()} ₽`, styles: { fontStyle: 'bold', fillColor: [220, 255, 220] } }
          ]);
          
          autoTable(doc, {
              head: [['Вид работ', 'Кол-во', 'Цена', 'Стоимость']],
              body: tableData,
              startY: 50,
              theme: 'grid',
              headStyles: { fillColor: [0, 0, 0] },
              styles: { font: "helvetica", fontSize: 10 } 
          });
          
          const finalY = (doc as any).lastAutoTable.finalY || 150;
          doc.text("Смета действительна 14 дней.", 20, finalY + 20);
          doc.text("Estate AI", 20, finalY + 25);
          doc.save("estate_ai_estimate.pdf");
      } catch(e) {
          console.error("PDF Generation Error", e);
          setGlobalError("Ошибка при создании PDF. Пожалуйста, проверьте подключение к интернету.");
      }
  };

  const hasGeneratedImages = photos.some(p => p.generated);

  if (!isAuthorized) {
      return (
          <ServiceLanding 
            title="AI Смета ремонта"
            subtitle="Визуализация и расчет стоимости за 5 минут."
            description="Загрузите фото, и нейросеть покажет, как может выглядеть квартира после ремонта (хоумстейджинга), а также составит точную смету на работы с учетом актуальных рыночных цен."
            icon={<Hammer />}
            colorTheme="orange"
            buttonText="Начать проект"
            onStart={() => setIsAuthorized(true)}
            features={[
                { title: "Визуализация", desc: "Генерация фотореалистичного дизайна интерьера на основе ваших фото.", icon: <Palette className="text-orange-600"/> },
                { title: "Точный расчет", desc: "Автоматический подсчет материалов и работ на основе площади.", icon: <Calculator className="text-orange-600"/> },
                { title: "PDF Смета", desc: "Готовый документ с ценами, который можно отправить подрядчику.", icon: <FileText className="text-orange-600"/> }
            ]}
          />
      );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Section className="py-8">
        <div className="mb-8">
             <Link to="/ai" className="inline-flex items-center text-gray-500 hover:text-black transition-colors mb-6">
                 <ArrowLeft size={20} className="mr-2" /> Все инструменты AI
             </Link>
             <div className="text-center mb-10">
                <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-700 font-bold text-sm mb-4">Nano Banana Engine</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Смета и Визуализация</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Загрузите фото — получите дизайн-проект и точный расчет стоимости работ.
                </p>
            </div>
        </div>

        <div className="max-w-5xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-12 gap-4">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>1</div>
                    <span>Визуализация</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-200"></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>2</div>
                    <span>Детали</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-200"></div>
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>3</div>
                    <span>Смета</span>
                </div>
            </div>

            {/* STEP 1: PHOTOS */}
            {step === 1 && (
                <div className="space-y-8 animate-fade-in">
                    {globalError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2">
                            <AlertCircle size={20} />
                            {globalError}
                        </div>
                    )}
                    
                    <GlassCard className="text-center py-12 border-2 border-dashed border-orange-200 hover:bg-orange-50 transition-colors cursor-pointer" onClick={() => photoInputRef.current?.click()}>
                        <input type="file" ref={photoInputRef} multiple onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus size={32} className="text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Загрузите фото квартиры</h3>
                        <p className="text-gray-500">Можно выбрать несколько файлов.</p>
                    </GlassCard>

                    {photos.length > 0 && (
                        <>
                            <div className="grid gap-8">
                                {photos.map((item, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-[2rem] shadow-lg relative">
                                        {!item.generated && !loading && (
                                            <button onClick={() => removePhoto(idx)} className="absolute top-2 right-2 z-20 bg-white/80 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">
                                                <X size={20} />
                                            </button>
                                        )}
                                        
                                        <div className="flex items-center justify-between mb-4 px-2">
                                            <h4 className="font-bold text-lg">Фото {idx + 1}</h4>
                                            {item.generated && <span className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1"><Sparkles size={12}/> AI Ready</span>}
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="relative group rounded-2xl overflow-hidden h-64">
                                                <img src={`data:image/jpeg;base64,${item.original}`} className="w-full h-full object-cover" />
                                                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur">До</div>
                                            </div>
                                            
                                            <div className="relative group rounded-2xl overflow-hidden bg-gray-100 h-64 flex flex-col items-center justify-center">
                                                {item.generated ? (
                                                    <>
                                                        <img src={item.generated} className="w-full h-full object-cover" />
                                                        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur shadow-lg">После</div>
                                                    </>
                                                ) : item.error ? (
                                                    <div className="text-center p-6">
                                                        <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
                                                        <p className="text-red-600 font-bold text-sm">{item.error}</p>
                                                        {!loading && (
                                                            <button onClick={startAIGeneration} className="mt-4 text-xs font-bold bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1 mx-auto">
                                                                <RefreshCw size={12}/> Повторить
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : idx === currentGeneratingIndex ? (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md z-10">
                                                        <div className="relative mb-4 w-32 h-32">
                                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                                                <circle cx="60" cy="60" r="54" stroke="#F3F4F6" strokeWidth="6" fill="none" />
                                                                <circle 
                                                                    cx="60" cy="60" r="54" 
                                                                    stroke="#f97316" 
                                                                    strokeWidth="6" 
                                                                    strokeLinecap="round" 
                                                                    fill="none" 
                                                                    strokeDasharray="339" 
                                                                    strokeDashoffset={339 - (339 * (90 - timeLeft) / 90)}
                                                                    className="transition-all duration-1000 ease-linear"
                                                                />
                                                            </svg>
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                                <span className="text-4xl font-bold text-gray-900 tabular-nums">{timeLeft}</span>
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">секунд</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-bold text-orange-600 uppercase tracking-widest animate-pulse bg-orange-50 px-3 py-1 rounded-full">
                                                            Генерация...
                                                        </span>
                                                    </div>
                                                ) : loading ? (
                                                    <div className="flex flex-col items-center justify-center opacity-50">
                                                        <Clock className="mb-2 text-gray-400" size={24} />
                                                        <span className="text-xs font-medium text-gray-400">В очереди...</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl w-full h-full flex flex-col items-center justify-center p-4">
                                                        <Sparkles className="mb-2 opacity-20" size={32} />
                                                        <span className="font-medium text-sm">Ожидает запуска</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-orange-100">
                                {!hasGeneratedImages && (
                                    <button 
                                        onClick={startAIGeneration}
                                        disabled={loading}
                                        className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-700 transition-transform shadow-xl flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? 'Процесс...' : 'Запустить AI Дизайн'}
                                        {!loading && <Sparkles />}
                                    </button>
                                )}
                                
                                {hasGeneratedImages && (
                                    <button 
                                        onClick={() => setStep(2)} 
                                        disabled={loading}
                                        className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center gap-2 disabled:opacity-50"
                                    >
                                        Далее к смете <ChevronRight />
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8 animate-slide-up">
                    {globalError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2">
                            <AlertCircle size={20} />
                            {globalError}
                        </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-8">
                        <GlassCard>
                            <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><FileText size={20}/> План квартиры</h3>
                            <div 
                                onClick={() => planInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all relative overflow-hidden"
                            >
                                {planImage ? (
                                    <img src={`data:image/jpeg;base64,${planImage}`} className="w-full h-full object-contain" />
                                ) : (
                                    <>
                                        <Upload className="text-gray-400 mb-4" size={32} />
                                        <p className="text-gray-500 font-medium">Загрузить план БТИ</p>
                                        <p className="text-xs text-gray-400 mt-2">(Фото или скан)</p>
                                    </>
                                )}
                                <input type="file" ref={planInputRef} onChange={handlePlanUpload} className="hidden" accept="image/*" />
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Calculator size={20}/> Параметры</h3>
                            <div className="bg-blue-50 p-4 rounded-xl mb-6 text-sm text-blue-800">
                                Укажите точную площадь. AI рассчитает количество материалов и работ на основе геометрии помещения.
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">Общая площадь (м²)</label>
                                    <input 
                                        type="number" 
                                        value={area}
                                        onChange={e => { setArea(e.target.value); setGlobalError(null); }}
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 font-bold text-lg outline-none focus:border-orange-500"
                                        placeholder="50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">Высота потолков (м)</label>
                                    <input 
                                        type="number" 
                                        value={ceilingHeight}
                                        onChange={e => { setCeilingHeight(e.target.value); setGlobalError(null); }}
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 font-bold text-lg outline-none focus:border-orange-500"
                                        placeholder="2.7"
                                    />
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        <button onClick={() => setStep(1)} className="text-gray-500 font-bold hover:text-black">Назад</button>
                        <button 
                            onClick={handleGenerateEstimate}
                            disabled={!area}
                            className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
                        >
                            Рассчитать смету <ChevronRight />
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="animate-scale-in max-w-3xl mx-auto">
                    <GlassCard className="border-2 border-green-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-4 py-2 rounded-bl-2xl">
                            ГОТОВО
                        </div>
                        
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={40} className="text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Смета сформирована</h2>
                            <p className="text-gray-500">
                                Расчет стоимости работ для площади {area} м².
                            </p>
                        </div>

                        {isGeometryAssumed && (
                            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-6 flex gap-3 items-start">
                                <Ruler size={20} className="text-yellow-600 flex-shrink-0 mt-0.5"/>
                                <div>
                                    <h4 className="font-bold text-yellow-800 text-sm">Внимание к размерам</h4>
                                    <p className="text-yellow-700 text-xs mt-1">
                                        Объемы работ рассчитаны математически на основе площади. Реальная стоимость может отличаться после замера.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                <span className="font-bold text-gray-600">Итого работы</span>
                                <span className="font-bold text-4xl text-gray-900">
                                    {totalWorkSum.toLocaleString()} ₽
                                </span>
                            </div>
                            <div className="space-y-2 mb-4">
                                {estimateItems.slice(0, 6).map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-gray-500">{item.name} <span className="text-xs opacity-50">({Math.ceil(item.qty)} {item.unit})</span></span>
                                        <span className="font-medium">{(Math.ceil(item.qty) * item.price).toLocaleString()} ₽</span>
                                    </div>
                                ))}
                                <div className="text-xs text-gray-400 pt-2 text-center">...полный список в PDF</div>
                            </div>
                            
                            <div className="flex gap-3 text-sm text-gray-500 items-start bg-orange-50 p-3 rounded-lg border border-orange-100">
                                <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-orange-500" />
                                <p>
                                    В расчет включены <strong>только работы</strong> (без учета стоимости черновых и чистовых материалов).
                                </p>
                            </div>
                        </div>

                        {globalError && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 mb-4 text-sm font-bold">
                                <AlertCircle size={16} />
                                {globalError}
                            </div>
                        )}

                        <div className="grid gap-4">
                            <button 
                                onClick={downloadPDF}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-3"
                            >
                                <Download size={20} /> Скачать PDF
                            </button>
                            
                            <button 
                                onClick={() => setIsSurveyorModalOpen(true)}
                                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-3"
                            >
                                <Phone size={20} /> Вызвать замерщика
                            </button>
                        </div>
                    </GlassCard>
                    
                    <button onClick={() => setStep(1)} className="w-full text-center mt-8 text-gray-400 hover:text-black font-bold">
                        Начать заново
                    </button>
                </div>
            )}
        </div>
      </Section>

      <Modal isOpen={isSurveyorModalOpen} onClose={() => setIsSurveyorModalOpen(false)} title="Вызов замерщика">
          <LeadForm 
            title="Бесплатный замер" 
            subtitle="Специалист приедет с лазерным оборудованием и каталогом материалов." 
            buttonText="Жду звонка" 
            className="p-0" 
            embedded={true} 
          />
      </Modal>
    </div>
  );
};

export default AIRenovationEst;
