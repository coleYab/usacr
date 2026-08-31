import { Head } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { lotteries } from '@/routes/app';

export default function AppLotteries() {
    return (
        <>
            <Head title="Lotteries" />
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Lotteries"
                    description="Browse and enter item-based raffles."
                />
                <EmptyState
                    icon={Sparkles}
                    title="No lotteries available yet"
                    description="Live lotteries you can enter will appear here."
                />
            </div>
        </>
    );
}

AppLotteries.layout = {
    breadcrumbs: [
        {
            title: 'Lotteries',
            href: lotteries(),
        },
    ],
};
