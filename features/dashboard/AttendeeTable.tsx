import React, { useState, useMemo, memo, useCallback } from 'react';
import type { Attendee } from '../../types/attendee';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { IconSearch, IconDownload, IconChevronLeft, IconChevronRight } from '../../components/Icons';

const ITEMS_PER_PAGE = 10;

const AttendeeTableComponent: React.FC<{ attendees: Attendee[] }> = ({ attendees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'checkedIn', 'notCheckedIn'
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAttendees = useMemo(() => {
    return attendees
      .filter(attendee => {
        if (statusFilter === 'all') return true;
        return statusFilter === 'checkedIn' ? attendee.checkedIn : !attendee.checkedIn;
      })
      .filter(attendee => {
        const term = searchTerm.toLowerCase();
        return (
          attendee.name.toLowerCase().includes(term) ||
          attendee.email.toLowerCase().includes(term)
        );
      });
  }, [attendees, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredAttendees.length / ITEMS_PER_PAGE);
  const paginatedAttendees = filteredAttendees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handleExportCSV = useCallback(() => {
    console.log("Exporting CSV..."); // Mock functionality
    alert('Chức năng xuất CSV đang được phát triển!');
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset page on search
  }, []);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset page on filter
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(p => Math.max(1, p - 1));
  }, []);
  
  const handleNextPage = useCallback(() => {
    setCurrentPage(p => Math.min(totalPages, p + 1));
  }, [totalPages]);

  return (
    <Card>
      <div className="p-4 border-b border-white/10">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-grow md:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch className="text-gray-400" size={18} />
            </div>
            <Input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'checkedIn', label: 'Đã check-in' },
                { value: 'notCheckedIn', label: 'Chưa check-in' },
              ]}
              className="w-full md:w-48"
            />
            <Button variant="secondary" onClick={handleExportCSV}>
              <IconDownload size={18} className="mr-2"/>
              Xuất CSV
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-gray-400 uppercase bg-white/5">
            <tr>
              <th className="px-6 py-3">Tên</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Loại vé</th>
              <th className="px-6 py-3">Trạng thái Check-in</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAttendees.length > 0 ? (
                paginatedAttendees.map(attendee => (
                <tr key={attendee.id} className="border-b border-white/10 hover:bg-white/10">
                    <td className="px-6 py-4 font-medium text-white">{attendee.name}</td>
                    <td className="px-6 py-4 text-gray-300">{attendee.email}</td>
                    <td className="px-6 py-4 text-gray-300">{attendee.ticketType}</td>
                    <td className="px-6 py-4">
                    {attendee.checkedIn ? (
                        <span className="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-300 rounded-full">Đã check-in</span>
                    ) : (
                        <span className="px-2 py-1 text-xs font-semibold bg-gray-500/20 text-gray-300 rounded-full">Chưa check-in</span>
                    )}
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-400">
                        Không tìm thấy người tham dự nào.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
       {totalPages > 1 && (
        <div className="p-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-sm text-gray-400">
            Hiển thị {paginatedAttendees.length} trên {filteredAttendees.length} kết quả
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <IconChevronLeft size={16} className="mr-1" />
              Trước
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Sau
              <IconChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export const AttendeeTable = memo(AttendeeTableComponent);
