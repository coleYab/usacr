import AppTopnavLayout from '@/layouts/app/app-topnav-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
    walletBalance,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
    walletBalance?: string;
}) {
    return (
        <AppTopnavLayout
            breadcrumbs={breadcrumbs}
            walletBalance={walletBalance}
        >
            {children}
        </AppTopnavLayout>
    );
}
