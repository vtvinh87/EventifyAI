import React from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { Card } from '../../ui/Card';
import { vi } from '../../../lang/vi';

interface SalesChartProps {
    data: { name: string; revenue: number }[];
}

export const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
    return (
        <Card>
            <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">{vi.organizerDashboard.revenueLast7Days}</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)' }} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};