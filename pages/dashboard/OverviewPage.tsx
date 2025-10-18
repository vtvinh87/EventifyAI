
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { IconDollarSign, IconTicket, IconUsers, IconCalendar, IconPlusCircle } from '../../components/Icons';
import { vi } from '../../lang/vi';
// FIX: Corrected import path for StatCard component.
import { StatCard } from '../../features/dashboard/StatCard';
import { SalesChart } from '../../features/dashboard/SalesChart';
import { useEventStore } from '../../stores/eventStore';
import { useUIStore } from '../../stores/uiStore';

const OverviewPage: React.FC = () => {
    const { 
        organizerEvents, 
        dashboardStats, 
        fetchOrganizerEvents, 
        fetchDashboardStats,
    } = useEventStore();
    const { isLoading } = useUIStore();

    useEffect(() => {
        if (organizerEvents.length === 0) fetchOrganizerEvents();
        if (!dashboardStats) fetchDashboardStats();
    }, [fetchOrganizerEvents, fetchDashboardStats, organizerEvents.length, dashboardStats]);

    // Dữ liệu giả cho biểu đồ doanh thu
    const salesData = [
      { name: 'Ngày 1', revenue: 4000 },
      { name: 'Ngày 2', revenue: 3000 },
      { name: 'Ngày 3', revenue: 2000 },
      { name: 'Ngày 4', revenue: 2780 },
      { name: 'Ngày 5', revenue: 1890 },
      { name: 'Ngày 6', revenue: 2390 },
      { name: 'Ngày 7', revenue: 3490 },
    ];
    
    // Spinner toàn cục sẽ hiển thị, chỉ cần không render nội dung khi đang tải
    if (isLoading && (!dashboardStats || organizerEvents.length === 0)) {
        return <div className="p-8 h-full"></div>;
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-white mb-8">{vi.organizerDashboard.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title={vi.organizerDashboard.totalRevenue} value={`$${dashboardStats?.totalRevenue.toLocaleString() || '0'}`} icon={<IconDollarSign size={24}/>} change="+12.5%" changeType="increase" />
                <StatCard title={vi.organizerDashboard.ticketsSold24h} value={dashboardStats?.ticketsSold24h.toLocaleString() || '0'} icon={<IconTicket size={24}/>} change="-3.2%" changeType="decrease" />
                <StatCard title={vi.organizerDashboard.totalCheckins} value={dashboardStats?.totalCheckins.toLocaleString() || '0'} icon={<IconUsers size={24}/>} />
                <StatCard title={vi.organizerDashboard.activeEvents} value={dashboardStats?.activeEvents.toString() || '0'} icon={<IconCalendar size={24}/>} />
            </div>

            <div className="mb-8">
                <SalesChart data={salesData} />
            </div>

            <Card>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">{vi.organizerDashboard.activeEventsList}</h2>
                        <Link to="/create-event"><Button><IconPlusCircle size={20} className="mr-2"/>{vi.organizerDashboard.createEvent}</Button></Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-300">
                            <thead className="border-b border-white/20">
                                <tr>
                                    <th className="p-3">{vi.organizerDashboard.tableName}</th>
                                    <th className="p-3">{vi.organizerDashboard.tableTicketsSold}</th>
                                    <th className="p-3">{vi.organizerDashboard.tableRevenue}</th>
                                    <th className="p-3">{vi.organizerDashboard.tableStatus}</th>
                                    <th className="p-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {organizerEvents.slice(0, 3).map(event => (
                                    <tr key={event.id} className="border-b border-white/10 hover:bg-white/5">
                                        <td className="p-3 font-semibold text-white">{event.name}</td>
                                        <td className="p-3">4,200 / 5,000</td>
                                        <td className="p-3">$12,450</td>
                                        <td className="p-3"><span className="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-300 rounded-full">{vi.organizerDashboard.statusLive}</span></td>
                                        <td className="p-3 text-right">
                                            <Link to={`/events/${event.id}/analytics`}><Button size="sm" variant="secondary">{vi.organizerDashboard.analytics}</Button></Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default OverviewPage;
