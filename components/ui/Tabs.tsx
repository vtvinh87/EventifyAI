import React, { useState, useRef, useEffect } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeTabRef = tabRefs.current[activeTab];
    if (activeTabRef) {
      setIndicatorStyle({
        left: activeTabRef.offsetLeft,
        width: activeTabRef.offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div>
      <div className="relative border-b border-white/20 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              // FIX: The ref callback should not return a value. Changed from a concise body to a block body.
              ref={(el) => { tabRefs.current[index] = el; }}
              onClick={() => setActiveTab(index)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors
                ${
                  activeTab === index
                    ? 'border-transparent text-brand-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }
              `}
              aria-current={activeTab === index ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <span
          className="absolute bottom-0 h-0.5 bg-brand-500 transition-all duration-300 ease-in-out"
          style={indicatorStyle}
        />
      </div>
      <div>
        {tabs.map((tab, index) => (
          <div
            key={tab.label}
            className={`${activeTab === index ? 'block' : 'hidden'}`}
            role="tabpanel"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
