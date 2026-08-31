import { Head } from '@inertiajs/react';
import { History, Sparkles, Users, Wallet } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { dashboard } from '@/routes/admin';

const stats = [
    { label: 'Total Revenue', value: '$0.00', icon: Wallet },
    { label: 'Active Lotteries', value: '0', icon: Sparkles },
    { label: 'Registered Users', value: '0', icon: Users },
    { label: 'Audit Events', value: '0', icon: History },
];

type LatestUser = {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'suspended' | 'banned';
};

const latestUsers: LatestUser[] = [];

const columns: DataTableColumn<LatestUser>[] = [
    {
        header: 'User',
        cell: (user) => (
            <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-muted-foreground text-sm">
                    {user.email}
                </span>
            </div>
        ),
    },
    {
        header: 'Status',
        cell: (user) => <span className="capitalize">{user.status}</span>,
    },
];

export default function AdminDashboard() {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Admin Dashboard"
                    description="Overview of platform health and activity."
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>
                <div className="flex flex-col gap-4">
                    <PageHeader
                        title="Latest Users"
                        description="The most recently registered accounts."
                    />
                    <DataTable
                        columns={columns}
                        rows={latestUsers}
                        keyExtractor={(user) => user.id}
                        emptyTitle="No users yet"
                        emptyDescription="New registrations will show up here."
                    />
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: dashboard(),
        },
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
