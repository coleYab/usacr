import { Head } from '@inertiajs/react';
import { Wallet } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { dashboard, deposits } from '@/routes/admin';

export default function AdminDeposits() {
    return (
        <>
            <Head title="Deposits" />
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Deposits"
                    description="Review and approve user wallet deposits."
                />
                <EmptyState
                    icon={Wallet}
                    title="No deposits yet"
                    description="Pending and completed deposits will appear here."
                />
            </div>
        </>
    );
}

AdminDeposits.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: dashboard(),
        },
        {
            title: 'Deposits',
            href: deposits(),
        },
    ],
};
