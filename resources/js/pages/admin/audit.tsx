import { Head } from '@inertiajs/react';
import { History } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { audit, dashboard } from '@/routes/admin';

export default function AdminAudit() {
    return (
        <>
            <Head title="Audit Log" />
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Audit Log"
                    description="Immutable record of admin and system actions."
                />
                <EmptyState
                    icon={History}
                    title="No audit events yet"
                    description="Admin actions will be logged here."
                />
            </div>
        </>
    );
}

AdminAudit.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: dashboard(),
        },
        {
            title: 'Audit Log',
            href: audit(),
        },
    ],
};
