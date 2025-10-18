import React from 'react';
import { Card } from '../../components/ui/Card';
import { IconMapPin } from '../../components/Icons';
import { vi } from '../../lang/vi';

export const InteractiveMap: React.FC = () => {
  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold text-white mb-4">{vi.home.interactiveMapTitle}</h2>
      <Card className="relative aspect-video w-full flex items-center justify-center overflow-hidden">
        {/* Placeholder image for the map */}
        <img 
          src="https://picsum.photos/seed/map/1200/600" 
          alt="Map placeholder" 
          className="absolute inset-0 w-full h-full object-cover opacity-20" 
        />
        <div className="relative z-10 text-center text-white p-4">
          <IconMapPin size={48} className="mx-auto mb-4 text-brand-400" />
          <p className="text-xl font-semibold">{vi.home.interactiveMapPlaceholder}</p>
          <p className="text-gray-400 mt-1">{vi.home.interactiveMapSubtitle}</p>
        </div>
      </Card>
    </div>
  );
};
