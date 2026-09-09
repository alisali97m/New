import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Dumbbell, 
  Calendar, 
  Flame, 
  Award,
  BarChart2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { DayWorkout } from '../types';
import { getExerciseHistory } from '../utils/progression';

interface ExerciseProgressModalProps {
  exerciseId: string;
  exerciseName: string;
  allDays: DayWorkout[];
  onClose: () => void;
}

export const ExerciseProgressModal: React.FC<ExerciseProgressModalProps> = ({
  exerciseId,
  exerciseName,
  allDays,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'weight' | 'volume'>('weight');

  // Compute points
  const historyPoints = getExerciseHistory(allDays, exerciseId);

  // Stats
  const firstSession = historyPoints[0];
  const latestSession = historyPoints[historyPoints.length - 1];

  const initialMaxWeight = firstSession ? firstSession.maxWeight : 0;
  const currentMaxWeight = latestSession ? latestSession.maxWeight : 0;
  const weightGain = currentMaxWeight - initialMaxWeight;
  const percentageGain = initialMaxWeight > 0 ? ((weightGain / initialMaxWeight) * 100).toFixed(1) : '0';

  const chartData = historyPoints.map((point) => ({
    name: `يوم ${point.dayNumber}`,
    day: point.dayNumber,
    الوزن: point.maxWeight,
    الحجم: point.totalVolume,
    التكرارات: point.totalReps,
    الجولات: point.setsCount
  }));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">
                  سجل تطور: {exerciseName}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                متابعة الأوزان والتكرارات والحجم التدريبي عبر جلسات الكورس الـ 45 يوم
              </p>
            </div>
          </div>
          <button
            id="btn-close-progress-modal"
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {historyPoints.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <BarChart2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-300">لا توجد بيانات مسجلة بعد</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                قم بتسجيل أوزانك وعداتك وتحديد الجولات كـ (مكتملة) في صفحة اليوم الحالي، وستظهر منحنيات التطور هنا تلقائياً!
              </p>
            </div>
          ) : (
            <>
              {/* Summary Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">عدد مرات التمرين</span>
                  <span className="text-xl font-bold font-mono text-slate-100">
                    {historyPoints.length} جلسات
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">أول وزن مسجل</span>
                  <span className="text-xl font-bold font-mono text-slate-300">
                    {initialMaxWeight} كغم
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">أعلى وزن حالي</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    {currentMaxWeight} كغم
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">صافي التطور</span>
                  <div className="flex items-center gap-1">
                    {weightGain >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-xl font-bold font-mono ${weightGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {weightGain >= 0 ? `+${weightGain}` : weightGain} كغم
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({percentageGain}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Tabs */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
                  <span className="text-sm font-bold text-slate-200">
                    {activeTab === 'weight' ? 'مخطط تطور الوزن الأقصى (كغم)' : 'مخطط إجمالي الحجم التدريبي (كغم)'}
                  </span>
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setActiveTab('weight')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        activeTab === 'weight'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      أقصى وزن
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('volume')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        activeTab === 'volume'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      الحجم الكلي
                    </button>
                  </div>
                </div>

                {/* Recharts chart */}
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    {activeTab === 'weight' ? (
                      <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderRadius: '12px',
                            color: '#f8fafc',
                            fontSize: '12px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="الوزن"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: '#10b981', r: 5 }}
                          activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 2 }}
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderRadius: '12px',
                            color: '#f8fafc',
                            fontSize: '12px'
                          }}
                        />
                        <Bar dataKey="الحجم" fill="#6366f1" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* History Table */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 mb-3">تفاصيل جميع الجلسات السابقة</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800 pb-2">
                        <th className="py-2 px-2">اليوم</th>
                        <th className="py-2 px-2 text-center">أقصى وزن</th>
                        <th className="py-2 px-2 text-center">مجموع التكرارات</th>
                        <th className="py-2 px-2 text-center">الحجم (كغم)</th>
                        <th className="py-2 px-2 text-center">الجولات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {historyPoints.map((point) => (
                        <tr key={point.dayNumber} className="hover:bg-slate-900/50">
                          <td className="py-2 px-2 text-slate-200 font-bold">
                            اليوم {point.dayNumber}
                          </td>
                          <td className="py-2 px-2 text-center text-emerald-400 font-bold">
                            {point.maxWeight} كغم
                          </td>
                          <td className="py-2 px-2 text-center text-slate-300">
                            {point.totalReps} عدة
                          </td>
                          <td className="py-2 px-2 text-center text-indigo-300">
                            {point.totalVolume} كغم
                          </td>
                          <td className="py-2 px-2 text-center text-slate-400">
                            {point.setsCount} سيت
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
