import { Head } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { dashboard, lotteries } from '@/routes/admin';

export default function AdminLotteries() {
    return (
        <>
            <Head title="Lotteries" />
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Lotteries"
                    description="Create and manage item raffles."
                />
                <EmptyState
                    icon={Sparkles}
                    title="No lotteries yet"
                    description="Lotteries you create will be listed here."
                />
            </div>
        </>
    );
}

AdminLotteries.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: dashboard(),
        },
        {
            title: 'Lotteries',
            href: lotteries(),
        },
    ],
};
