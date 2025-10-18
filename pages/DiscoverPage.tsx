import React, { useState, useEffect, useCallback } from 'react';
import { useEventStore } from '../stores/eventStore';
import { useUIStore } from '../stores/uiStore';
import { EventFilter, FilterState } from '../features/events/EventFilter';
import { EventList } from '../features/events/EventList';
import { Button } from '../components/ui/Button';
import { IconLayoutGrid, IconMap, IconMapPin, IconFilter } from '../components/Icons';
import { Card } from '../components/ui/Card';

const DiscoverPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    filteredEvents,
    fetchEvents,
    filters,
    setFilters,
    clearFilters,
  } = useEventStore();
  const { isLoading } = useUIStore();

  useEffect(() => {
    const { events } = useEventStore.getState();
    if (events.length === 0) {
      fetchEvents();
    }
  }, [fetchEvents]); 

  // Memoize handlers to prevent re-renders in child components
  const memoizedSetFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, [setFilters]);

  const memoizedClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const renderContent = () => {
    // GlobalFeedback sẽ hiển thị spinner. Ta chỉ cần ẩn nội dung cũ.
    if (isLoading && filteredEvents.length === 0) {
      return null;
    }

    if (viewMode === 'map') {
      return (
         <Card className="relative aspect-video w-full flex items-center justify-center overflow-hidden">
            <img 
                src="https://picsum.photos/seed/discovermap/1200/600" 
                alt="Map placeholder" 
                className="absolute inset-0 w-full h-full object-cover opacity-20" 
            />
            <div className="relative z-10 text-center text-white p-4">
                <IconMapPin size={48} className="mx-auto mb-4 text-brand-400" />
                <p className="text-xl font-semibold">Chế độ xem bản đồ sắp ra mắt!</p>
                <p className="text-gray-400 mt-1">Khám phá các sự kiện một cách trực quan.</p>
            </div>
         </Card>
      );
    }
    
    if (filteredEvents.length === 0 && !isLoading) {
        return <p className="text-gray-400 text-center col-span-full py-20">Không tìm thấy sự kiện nào phù hợp.</p>;
    }

    return <EventList events={filteredEvents} />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter">Khám phá Sự kiện</h1>
        <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">Tìm kiếm và lọc qua hàng trăm sự kiện để tìm thấy trải nghiệm hoàn hảo cho bạn.</p>
      </div>
      
       <div className="lg:hidden mb-4">
          <Button variant="secondary" className="w-full" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <IconFilter className="mr-2" size={18} /> {isFilterOpen ? 'Đóng bộ lọc' : 'Mở bộ lọc'}
          </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className={`lg:sticky lg:top-24 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
             <EventFilter 
                filters={filters} 
                onFilterChange={memoizedSetFilters} 
                onClear={memoizedClearFilters}
              />
          </div>
        </aside>
        
        <main className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
               <h2 className="text-2xl font-bold text-white">
                  {`Kết quả (${filteredEvents.length})`}
               </h2>
                <div className="flex items-center gap-2">
                    <Button variant={viewMode === 'grid' ? 'primary' : 'secondary'} size="sm" onClick={() => setViewMode('grid')} aria-label="Grid view">
                      <IconLayoutGrid className="mr-2" size={18} /> Lưới
                    </Button>
                    <Button variant={viewMode === 'map' ? 'primary' : 'secondary'} size="sm" onClick={() => setViewMode('map')} aria-label="Map view">
                      <IconMap className="mr-2" size={18} /> Bản đồ
                    </Button>
                </div>
            </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DiscoverPage;
