import React from 'react';
import { Card } from '../../components/ui/Card';
import { IconCheck } from '../../components/Icons';

interface TopicCardProps {
  topic: {
    name: string;
    icon: React.FC<any>;
  };
  isSelected: boolean;
  onSelect: (topicName: string) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, isSelected, onSelect }) => {
  const Icon = topic.icon;
  return (
    <Card
      onClick={() => onSelect(topic.name)}
      className={`
        relative cursor-pointer aspect-square flex flex-col items-center justify-center text-center p-4
        group hover:border-brand-500/50 hover:bg-white/5
        ${isSelected ? 'border-brand-500 bg-brand-900/30' : 'border-white/20'}
      `}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-brand-500 rounded-full p-1 text-white">
          <IconCheck size={16} />
        </div>
      )}
      <Icon size={40} className={`mb-3 transition-colors ${isSelected ? 'text-brand-400' : 'text-gray-300 group-hover:text-white'}`} />
      <h3 className={`font-semibold transition-colors ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{topic.name}</h3>
    </Card>
  );
};
