import React, { useCallback } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { IconX } from '../../components/Icons';

// Dữ liệu giả cho các bộ lọc
const MOCK_CATEGORIES = [
  { value: 'all', label: 'Tất cả danh mục' },
  { value: 'Âm nhạc', label: 'Âm nhạc' },
  { value: 'Công nghệ', label: 'Công nghệ' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Thể thao', label: 'Thể thao' },
];

const MOCK_DATE_RANGES = [
  { value: 'any', label: 'Mọi lúc' },
  { value: 'today', label: 'Hôm nay' },
  { value: 'this_week', label: 'Tuần này' },
  { value: 'this_month', label: 'Tháng này' },
];

const MOCK_PRICE_RANGES = [
  { value: 'any', label: 'Mọi mức giá' },
  { value: 'free', label: 'Miễn phí' },
  { value: 'under_50', label: 'Dưới $50' },
  { value: 'over_100', label: 'Trên $100' },
];

export interface FilterState {
  keyword: string;
  category: string;
  date: string;
  location: string;
  price: string;
}

interface EventFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClear: () => void;
}

export const EventFilter: React.FC<EventFilterProps> = ({ filters, onFilterChange, onClear }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Tạo một object mới để đảm bảo tính bất biến
    onFilterChange({ ...filters, [name]: value });
  }, [filters, onFilterChange]);

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-4">
        <Input
          label="Từ khóa"
          id="keyword"
          name="keyword"
          value={filters.keyword}
          onChange={handleChange}
          placeholder="Tìm theo tên sự kiện..."
        />
        <Select
          label="Danh mục"
          id="category"
          name="category"
          value={filters.category}
          onChange={handleChange}
          options={MOCK_CATEGORIES}
        />
        <Select
          label="Ngày"
          id="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          options={MOCK_DATE_RANGES}
        />
        <Input
          label="Địa điểm"
          id="location"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Ví dụ: Hà Nội"
        />
        <Select
          label="Giá vé"
          id="price"
          name="price"
          value={filters.price}
          onChange={handleChange}
          options={MOCK_PRICE_RANGES}
        />
      </div>
      <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-white/10">
        <Button variant="secondary" onClick={onClear} className="w-full">
          <IconX size={18} className="mr-2" /> Xóa bộ lọc
        </Button>
      </div>
    </Card>
  );
};
