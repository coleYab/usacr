import { Head } from '@inertiajs/react';
import { Ticket } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { tickets } from '@/routes/app';

export default function AppTickets() {
    return (
        <>
            <Head title="My Tickets" />
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="My Tickets"
                    description="All tickets you've purchased across lotteries."
                />
                <EmptyState
                    icon={Ticket}
                    title="No tickets yet"
                    description="Tickets you buy will be listed here."
                />
            </div>
        </>
    );
}

AppTickets.layout = {
    breadcrumbs: [
        {
            title: 'My Tickets',
            href: tickets(),
        },
    ],
};
