import React from 'react';
import { Card } from '../../ui/Card';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, changeType }) => (
    <Card>
        <div className="p-5">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className="bg-brand-800 p-3 rounded-lg text-white">
                        {icon}
                    </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">{title}</dt>
                        <dd>
                            <div className="text-2xl font-bold text-white">{value}</div>
                            {change && (
                                <div className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-400' : 'text-red-400'}`}>{change}</div>
                            )}
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </Card>
);