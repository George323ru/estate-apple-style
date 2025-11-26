
import React, { useState, useMemo, useEffect } from 'react';
import Section from '../components/Section';
import GlassCard from '../components/GlassCard';
import ServiceLanding from '../components/ServiceLanding';
import { 
  TrendingUp, ArrowLeft, Calculator, 
  Building2, Wallet, AlertTriangle, CheckCircle2, 
  Briefcase, PiggyBank, Timer, AlertOctagon, Lightbulb,
  RefreshCw, XCircle, PieChart, LineChart, Coins
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface InvestmentParams {
  price: number;
  repairBudget: number;
  repairDuration: number;
  maintenanceRate: number;
  downPaymentPct: number;
  mortgageRate: number;
  loanTermYears: number;
  monthlyRent: number;
  utilities: number;
  taxRate: number;
  depositRate: number;
  inflation: number;
  holdingPeriod: number;
}

interface CalculationResult {
  isProfitable: boolean;
  verdict: {
    title: string;
    description: string;
    color: string;
  };
  metrics: {
    realNetProfit: number;
    mirr: number;
    holdingCosts: number;
    monthlyCashFlow: number;
    totalInvestment: number;
  };
  risks: string[];
  recommendations: string[];
}

const calculateMIRR = (values: number[], financeRate: number, reinvestRate: number) => {
    const positiveFlows: number[] = [];
    const negativeFlows: number[] = [];

    values.forEach(v => {
        if (v >= 0) positiveFlows.push(v);
        else negativeFlows.push(v);
    });

    let fvPos = 0;
    let pvNeg = 0;
    const n = values.length;

    for (let t = 0; t < n; t++) {
        if (values[t] > 0) {
            fvPos += values[t] * Math.pow(1 + reinvestRate, n - t - 1);
        }
    }

    for (let t = 0; t < n; t++) {
        if (values[t] < 0) {
            pvNeg += values[t] / Math.pow(1 + financeRate, t);
        }
    }

    if (Math.abs(pvNeg) < 0.01) return 0;

    const mirrMonthly = Math.pow(fvPos / Math.abs(pvNeg), 1 / n) - 1;
    return (Math.pow(1 + mirrMonthly, 12) - 1) * 100;
};

const calculateScenario = (params: InvestmentParams, delayMonths: number = 0): CalculationResult => {
    const {
        price, repairBudget, repairDuration, maintenanceRate,
        downPaymentPct, mortgageRate, loanTermYears,
        monthlyRent, utilities, taxRate,
        depositRate, inflation, holdingPeriod
    } = params;

    const totalMonths = holdingPeriod * 12;
    const monthlyMortgageRate = mortgageRate / 100 / 12;
    const monthlyDepositRate = depositRate / 100 / 12;
    const actualRepairTime = repairDuration + delayMonths;

    const loanAmount = price * (1 - downPaymentPct / 100);
    const ownCashStart = price * (downPaymentPct / 100);
    
    let monthlyPayment = 0;
    if (loanAmount > 0) {
        monthlyPayment = (loanAmount * monthlyMortgageRate) / (1 - Math.pow(1 + monthlyMortgageRate, -loanTermYears * 12));
    }

    let loanBalance = loanAmount;
    let propertyValue = price + repairBudget; 
    const cashFlowTimeline: number[] = [];
    let totalNetProfit = 0;
    let holdingCosts = 0;
    let totalOwnInvestment = ownCashStart + repairBudget; 

    cashFlowTimeline.push(-ownCashStart); 

    for (let m = 1; m <= totalMonths; m++) {
        const isRepairing = m <= actualRepairTime;
        const isVacancy = m === actualRepairTime + 1; 
        const income = (isRepairing || isVacancy) ? 0 : monthlyRent;

        const tax = income * (taxRate / 100);
        const maintenance = income > 0 ? income * (maintenanceRate / 100) : 0;
        
        const expenses = monthlyPayment + utilities + tax + maintenance;

        if (income === 0) {
            holdingCosts += expenses;
        }

        const netMonthFlow = income - expenses;
        
        let finalMonthFlow = netMonthFlow;
        if (m === 1) finalMonthFlow -= repairBudget;

        cashFlowTimeline.push(finalMonthFlow);
        totalNetProfit += netMonthFlow;

        const interestPart = loanBalance * monthlyMortgageRate;
        const principalPart = monthlyPayment - interestPart;
        if (loanBalance > 0) loanBalance -= principalPart;

        propertyValue *= (1 + (inflation / 100 / 12));
    }

    const saleCommission = propertyValue * 0.03; 
    const taxableProfit = Math.max(0, propertyValue - price - repairBudget - saleCommission);
    const finalTax = taxableProfit * 0.13; 

    const netSaleProceeds = propertyValue - loanBalance - saleCommission - finalTax;
    
    cashFlowTimeline[cashFlowTimeline.length - 1] += netSaleProceeds;
    
    const absoluteProfit = cashFlowTimeline.reduce((a, b) => a + b, 0);
    const mirr = calculateMIRR(cashFlowTimeline, monthlyMortgageRate, monthlyDepositRate);

    let verdictTitle = "Нейтральный прогноз";
    let verdictDesc = "Проект окупается, но не приносит сверхприбыли.";
    let verdictColor = "bg-yellow-50 border-yellow-200 text-yellow-800";
    
    const risks: string[] = [];
    const recommendations: string[] = [];

    if (absoluteProfit > 0 && mirr > 10) {
        verdictTitle = "Успешный кейс";
        verdictDesc = `Проект генерирует чистую прибыль ${new Intl.NumberFormat('ru-RU').format(Math.round(absoluteProfit))} ₽.`;
        verdictColor = "bg-green-50 border-green-200 text-green-900";
    } else if (absoluteProfit < 0) {
        verdictTitle = "Убыточный проект";
        verdictDesc = "Вложения не окупятся на заданном горизонте.";
        verdictColor = "bg-red-50 border-red-200 text-red-900";
    }

    const monthlyCashFlow = totalNetProfit / totalMonths;
    
    const expensesNoMaint = monthlyPayment + utilities;
    const breakEvenRent = expensesNoMaint / (1 - (taxRate/100) - (maintenanceRate/100));
    
    if (monthlyRent < breakEvenRent) {
        recommendations.push(`📉 **Отрицательный поток:** Поднимите аренду до **${Math.round(breakEvenRent).toLocaleString()} ₽**, чтобы покрывать платежи.`);
    }
    
    if (absoluteProfit < 0) {
        const targetPrice = price - Math.abs(absoluteProfit);
        recommendations.push(`💰 **Торг:** Попробуйте снизить цену покупки до **${(targetPrice/1000000).toFixed(1)} млн ₽**.`);
    }

    if (holdingCosts > 200000 && repairDuration > 2) {
        recommendations.push(`⚡ **Ускорение:** Сократите ремонт на 1 месяц — это сэкономит **${Math.round(monthlyPayment + utilities).toLocaleString()} ₽**.`);
    }

    if (monthlyPayment > monthlyRent) risks.push(`💸 **Кассовый разрыв:** Ипотека (${Math.round(monthlyPayment)}) больше аренды.`);
    if (holdingCosts > 300000) risks.push(`💀 **Дорогой старт:** Вы потеряете ${Math.round(holdingCosts/1000)}к на старте.`);
    if (repairDuration > 6) risks.push(`🔨 **Долгострой:** Ремонт съедает первый год прибыли.`);

    return {
        isProfitable: absoluteProfit > 0,
        verdict: { title: verdictTitle, description: verdictDesc, color: verdictColor },
        metrics: {
            realNetProfit: absoluteProfit,
            mirr,
            holdingCosts,
            monthlyCashFlow,
            totalInvestment: totalOwnInvestment
        },
        risks,
        recommendations
    };
};

const fmt = (num: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(num);

const AIInvestForecast: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [params, setParams] = useState<InvestmentParams>({
    price: 12000000,
    repairBudget: 1500000,
    repairDuration: 3,
    maintenanceRate: 5,
    downPaymentPct: 20,
    mortgageRate: 6,
    loanTermYears: 20,
    monthlyRent: 65000,
    utilities: 8000,
    taxRate: 4,
    depositRate: 12,
    inflation: 5,
    holdingPeriod: 5
  });

  useEffect(() => {
      const auth = localStorage.getItem('estate_auth');
      if (auth === 'true') setIsAuthorized(true);
  }, []);

  const result = useMemo(() => calculateScenario(params), [params]);

  const handleParamChange = (key: keyof InvestmentParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  if (!isAuthorized) {
      return (
          <ServiceLanding 
            title="AI Инвест-прогноз"
            subtitle="Рассчитайте реальную доходность недвижимости."
            description="Профессиональный инструмент для инвесторов. Учитывает ипотеку, налоги, инфляцию, простой и скрытые расходы на ремонт, чтобы показать честный MIRR и чистый денежный поток."
            icon={<TrendingUp />}
            colorTheme="blue"
            buttonText="Создать прогноз"
            onStart={() => setIsAuthorized(true)}
            features={[
                { title: "Финансовая модель", desc: "Расчет MIRR, NPV и Cash-on-Cash доходности.", icon: <PieChart className="text-blue-600"/> },
                { title: "Сценарный анализ", desc: "Что будет, если ремонт затянется или упадет ставка аренды.", icon: <LineChart className="text-blue-600"/> },
                { title: "Скрытые убытки", desc: "Учет налогов, коммуналки в простой и амортизации.", icon: <Coins className="text-blue-600"/> }
            ]}
          />
      );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen bg-[#F5F5F7]">
      <Section className="py-8">
        <div className="mb-8">
             <Link to="/ai" className="inline-flex items-center text-gray-500 hover:text-black transition-colors mb-6">
                 <ArrowLeft size={20} className="mr-2" /> Все инструменты AI
             </Link>
             <div className="text-center mb-10">
                <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-4">Инвестиции</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Инвест-прогноз</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Рассчитайте реальную доходность (MIRR) с учетом ипотеки, ремонта, налогов и простоя.
                </p>
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-4 space-y-6">
                <GlassCard>
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900"><Building2 size={18} /> Объект и ремонт</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Цена объекта</label>
                            <input type="number" value={params.price} onChange={e => handleParamChange('price', Number(e.target.value))} className="w-full p-3 bg-gray-50 rounded-lg font-bold text-sm border border-gray-200 outline-none focus:border-blue-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Ремонт (₽)</label>
                                <input type="number" value={params.repairBudget} onChange={e => handleParamChange('repairBudget', Number(e.target.value))} className="w-full p-3 bg-gray-50 rounded-lg font-bold text-sm border border-gray-200 outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Срок (мес)</label>
                                <input type="number" value={params.repairDuration} onChange={e => handleParamChange('repairDuration', Number(e.target.value))} className="w-full p-3 bg-gray-50 rounded-lg font-bold text-sm border border-gray-200 outline-none focus:border-blue-500" />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard>
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900"><Wallet size={18} /> Финансирование</h3>
                    <div className="space-y-4">
                        <div>
                             <label className="text-xs font-bold text-gray-500 uppercase">Первый взнос (%)</label>
                             <input type="range" min="10" max="100" step="5" value={params.downPaymentPct} onChange={e => handleParamChange('downPaymentPct', Number(e.target.value))} className="w-full accent-blue-600" />
                             <div className="flex justify-between text-sm font-bold">
                                 <span>{params.downPaymentPct}%</span>
                                 <span className="text-gray-500">{fmt(params.price * (params.downPaymentPct/100))}</span>
                             </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Ставка (%)</label>
                                <input type="number" value={params.mortgageRate} onChange={e => handleParamChange('mortgageRate', Number(e.target.value))} className="w-full p-3 bg-gray-50 rounded-lg font-bold text-sm border border-gray-200 outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Срок (лет)</label>
                                <input type="number" value={params.loanTermYears} onChange={e => handleParamChange('loanTermYears', Number(e.target.value))} className="w-full p-3 bg-gray-50 rounded-lg font-bold text-sm border border-gray-200 outline-none focus:border-blue-500" />
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard>
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900"><PiggyBank size={18} /> Аренда</h3>
                     <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Ставка аренды (мес)</label>
                            <input type="number" value={params.monthlyRent} onChange={e => handleParamChange('monthlyRent', Number(e.target.value))} className="w-full p-3 bg-gray-50 rounded-lg font-bold text-sm border border-gray-200 outline-none focus:border-blue-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Коммуналка</label>
                                <input type="number" value={params.utilities} onChange={e => handleParamChange('utilities', Number(e.target.value))} className="w-full p-3 bg-gray-50 rounded-lg font-bold text-sm border border-gray-200 outline-none focus:border-blue-500" />
                            </div>
                             <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Налог (%)</label>
                                <input type="number" value={params.taxRate} onChange={e => handleParamChange('taxRate', Number(e.target.value))} className="w-full p-3 bg-gray-50 rounded-lg font-bold text-sm border border-gray-200 outline-none focus:border-blue-500" />
                            </div>
                        </div>
                     </div>
                </GlassCard>
            </div>

            <div className="lg:col-span-8 space-y-6">
                <GlassCard className={`relative overflow-hidden border-2 ${result.isProfitable ? 'border-green-100' : 'border-red-100'}`}>
                    <div className={`absolute inset-0 opacity-10 ${result.verdict.color} z-0`}></div>
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${result.verdict.color.replace('bg-', 'bg-opacity-20 text-')}`}>
                                    {result.verdict.title}
                                </span>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    MIRR: <span className={result.isProfitable ? 'text-green-600' : 'text-red-500'}>{result.metrics.mirr.toFixed(1)}%</span> годовых
                                </h2>
                                <p className="text-gray-500">{result.verdict.description}</p>
                            </div>
                            <div className={`p-4 rounded-full ${result.isProfitable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {result.isProfitable ? <TrendingUp size={32} /> : <AlertOctagon size={32} />}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4 mt-8">
                             <div className="bg-white/60 p-4 rounded-xl border border-white/50">
                                 <div className="text-xs text-gray-500 uppercase font-bold mb-1">Чистая прибыль</div>
                                 <div className={`text-xl font-bold ${result.metrics.realNetProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                     {fmt(result.metrics.realNetProfit)}
                                 </div>
                             </div>
                             <div className="bg-white/60 p-4 rounded-xl border border-white/50">
                                 <div className="text-xs text-gray-500 uppercase font-bold mb-1">Вложения</div>
                                 <div className="text-xl font-bold text-gray-900">
                                     {fmt(result.metrics.totalInvestment)}
                                 </div>
                             </div>
                             <div className="bg-white/60 p-4 rounded-xl border border-white/50">
                                 <div className="text-xs text-gray-500 uppercase font-bold mb-1">Денежный поток</div>
                                 <div className={`text-xl font-bold ${result.metrics.monthlyCashFlow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                     {fmt(result.metrics.monthlyCashFlow)} / мес
                                 </div>
                             </div>
                        </div>
                    </div>
                </GlassCard>

                <div className="grid md:grid-cols-2 gap-6">
                     <GlassCard className="bg-red-50/50 border-red-100">
                         <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><AlertTriangle size={20}/> Риски</h3>
                         {result.risks.length > 0 ? (
                             <ul className="space-y-3">
                                 {result.risks.map((r, i) => (
                                     <li key={i} className="text-sm text-red-800 bg-white/50 p-3 rounded-lg border border-red-100" dangerouslySetInnerHTML={{__html: r}} />
                                 ))}
                             </ul>
                         ) : (
                             <div className="text-green-600 text-sm font-medium flex items-center gap-2">
                                 <CheckCircle2 size={16} /> Критических рисков не обнаружено
                             </div>
                         )}
                     </GlassCard>

                     <GlassCard className="bg-blue-50/50 border-blue-100">
                         <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><Lightbulb size={20}/> AI Советы</h3>
                         {result.recommendations.length > 0 ? (
                             <ul className="space-y-3">
                                 {result.recommendations.map((r, i) => (
                                     <li key={i} className="text-sm text-blue-800 bg-white/50 p-3 rounded-lg border border-blue-100" dangerouslySetInnerHTML={{__html: r}} />
                                 ))}
                             </ul>
                         ) : (
                             <div className="text-gray-500 text-sm">Текущая стратегия выглядит оптимальной.</div>
                         )}
                     </GlassCard>
                </div>

                <GlassCard>
                    <h3 className="font-bold mb-4">График денежного потока</h3>
                    <div className="h-32 flex items-end gap-1">
                         {Array.from({length: 20}).map((_, i) => {
                             const height = i === 0 ? '10%' : i < (params.repairDuration/3) ? '5%' : `${40 + Math.random() * 20}%`;
                             const color = i === 0 ? 'bg-red-400' : i < (params.repairDuration/3) ? 'bg-orange-300' : 'bg-green-400';
                             return (
                                 <div key={i} className={`flex-1 rounded-t-sm ${color}`} style={{height}}></div>
                             )
                         })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>Старт</span>
                        <span>Ремонт</span>
                        <span>Аренда</span>
                        <span>Продажа</span>
                    </div>
                </GlassCard>
            </div>
        </div>
      </Section>
    </div>
  );
};

export default AIInvestForecast;
