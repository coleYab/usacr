import { Head } from '@inertiajs/react';
import { LayoutGrid, Sparkles, Ticket, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { dashboard } from '@/routes/app';

const stats = [
    { label: 'Wallet Balance', value: '$0.00', icon: Wallet },
    { label: 'Active Lotteries', value: '0', icon: Sparkles },
    { label: 'Tickets Owned', value: '0', icon: Ticket },
    { label: 'Wins Total', value: '$0.00', icon: LayoutGrid },
];

export default function AppDashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Dashboard"
                    description="Welcome back — here's what's happening with your account."
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>
            </div>
        </>
    );
}

AppDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
