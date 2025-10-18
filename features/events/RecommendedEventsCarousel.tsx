import React, { useRef, useState, useEffect } from 'react';
import type { Event } from '../../types';
import { EventCard } from './EventCard';
import { IconChevronLeft, IconChevronRight } from '../../components/Icons';
import { vi } from '../../lang/vi';
import { Button } from '../../components/ui/Button';

interface RecommendedEventsCarouselProps {
  events: Event[];
}

export const RecommendedEventsCarousel: React.FC<RecommendedEventsCarouselProps> = ({ events }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const isScrollable = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(isScrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScrollability();
      el.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);

      return () => {
        el.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [events]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-white">{vi.home.recommendedForYou}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className="!p-2 disabled:opacity-30"
            aria-label="Scroll left"
          >
            <IconChevronLeft size={20} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className="!p-2 disabled:opacity-30"
            aria-label="Scroll right"
          >
            <IconChevronRight size={20} />
          </Button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-8 pb-4 -mb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {events.map(event => (
          <div key={event.id} className="snap-start flex-shrink-0 w-[calc(100%-2rem)] sm:w-80 md:w-96">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
};
