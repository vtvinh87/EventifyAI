
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { Feedback, AISentimentAnalysis, AITopicAnalysis } from '../../types';
// FIX: Added imports for MOCK_EVENTS and MOCK_FEEDBACKS, which were missing and causing errors.
import { MOCK_EVENTS, MOCK_FEEDBACKS } from '../../constants';
import { analyzeFeedbackSentiment, analyzeFeedbackTopics } from '../../services/geminiService';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/UI';
import { IconChevronLeft, IconDollarSign, IconUsers } from '../../components/Icons';
import { StatCard } from '../../features/dashboard/StatCard';
import { vi } from '../../lang/vi';

// --- i1n Translation Utility ---
const t = (key: string, options?: Record<string, string>): string => {
  let value: any = vi;
  try {
    for (const k of key.split('.')) {
      value = value[k];
    }
    if (typeof value !== 'string') throw new Error();
    
    if (options) {
      Object.entries(options).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, v);
      });
    }

    return value;
  } catch (e) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
};

const EventAnalyticsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const event = MOCK_EVENTS.find(e => e.id === id);
    const [analyzedFeedbacks, setAnalyzedFeedbacks] = useState<(Feedback & { sentiment?: AISentimentAnalysis; topics?: AITopicAnalysis; loading?: boolean })[]>(MOCK_FEEDBACKS.map(f => ({ ...f, loading: false })));

    if (!event) return <div className="text-center py-20 text-white">{t('eventDetails.notFound')}</div>;

    const analyzeFeedback = async (feedbackId: string) => {
        setAnalyzedFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, loading: true } : f));
        
        const feedback = analyzedFeedbacks.find(f => f.id === feedbackId);
        if (!feedback) return;

        const [sentiment, topics] = await Promise.all([
            analyzeFeedbackSentiment(feedback.comment),
            analyzeFeedbackTopics(feedback.comment)
        ]);

        setAnalyzedFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, sentiment, topics, loading: false } : f));
    };

    const sentimentData = analyzedFeedbacks.reduce((acc, f) => {
      if(f.sentiment) {
        const sentimentKey = f.sentiment.sentiment;
        acc[sentimentKey] = (acc[sentimentKey] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    const pieData = Object.entries(sentimentData).map(([name, value]) => ({ name, value }));
    const COLORS = { 'positive': '#22c55e', 'neutral': '#f59e0b', 'negative': '#ef4444', 'mixed': '#6366f1' };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-brand-400 hover:text-brand-300 mb-4"><IconChevronLeft size={20} /> {t('eventAnalytics.backToDashboard')}</Link>
            <h1 className="text-4xl font-extrabold text-white mb-2">{event.name}</h1>
            <p className="text-lg text-gray-400 mb-8">{t('eventAnalytics.realtimeAnalytics')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
              <StatCard title={t('eventAnalytics.revenue')} value="$12,450" icon={<IconDollarSign size={24}/>} />
              <StatCard title={t('eventAnalytics.checkins')} value="3,812 / 4,200 (90%)" icon={<IconUsers size={24}/>} />
            </div>

            <Card className="mb-8">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">{t('eventAnalytics.aiAnalysisTitle')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <h3 className="font-semibold text-white mb-2">{t('eventAnalytics.sentimentDistribution')}</h3>
                     <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)' }} />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-white mb-2">{t('eventAnalytics.feedbackDetails')}</h3>
                     <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {analyzedFeedbacks.map(fb => (
                        <div key={fb.id} className="p-3 bg-white/5 rounded-lg">
                          <p className="text-gray-300">"{fb.comment}"</p>
                          <div className="flex justify-between items-center mt-2">
                            {fb.loading ? <Spinner size="sm" /> : (
                              <div className="flex items-center gap-4">
                                {fb.sentiment && <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize`} style={{backgroundColor: `${COLORS[fb.sentiment.sentiment as keyof typeof COLORS]}20`, color: COLORS[fb.sentiment.sentiment as keyof typeof COLORS]}}>{fb.sentiment.sentiment}</span>}
                                <div className="flex gap-1.5">
                                  {fb.topics?.topics.map(topic => <span key={topic} className="px-2 py-0.5 text-xs bg-gray-600 rounded-full">{topic}</span>)}
                                </div>
                              </div>
                            )}
                            {!fb.sentiment && !fb.loading && <Button size="sm" variant="secondary" onClick={() => analyzeFeedback(fb.id)}>{t('eventAnalytics.analyze')}</Button>}
                          </div>
                        </div>
                      ))}
                     </div>
                  </div>
                </div>
              </div>
            </Card>
        </div>
    );
};

export default EventAnalyticsPage;
