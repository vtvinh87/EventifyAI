import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { vi } from '../lang/vi';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/UI';
import { TopicCard } from '../features/onboarding/TopicCard';
import { onboardingTopics } from '../features/onboarding/data';
import { updateUserInterests } from '../services/apiAuth';

const OnboardingPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleTopic = (topicName: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicName)
        ? prev.filter(t => t !== topicName)
        : [...prev, topicName]
    );
  };

  const handleComplete = async () => {
    if (!user) return;
    setIsLoading(true);
    await updateUserInterests(user.id, selectedTopics);
    setIsLoading(false);
    navigate('/');
  };

  // Redirect if user is not logged in
  if (!user) {
      navigate('/login');
      return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter mb-4">
        {vi.onboarding.welcome.replace('{name}', user?.name || '')}
      </h1>
      <p className="text-lg text-gray-300 mb-10 max-w-2xl">{vi.onboarding.subtitle}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mb-10">
        {onboardingTopics.map(topic => (
          <TopicCard
            key={topic.name}
            topic={topic}
            isSelected={selectedTopics.includes(topic.name)}
            onSelect={toggleTopic}
          />
        ))}
      </div>

      <Button
        size="lg"
        onClick={handleComplete}
        disabled={isLoading || selectedTopics.length === 0}
      >
        {isLoading ? <Spinner size="sm" /> : vi.onboarding.completeButton}
      </Button>
    </div>
  );
};

export default OnboardingPage;
