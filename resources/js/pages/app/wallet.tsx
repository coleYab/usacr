import { Head } from '@inertiajs/react';
import { Wallet } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { wallet } from '@/routes/app';

export default function AppWallet() {
    return (
        <>
            <Head title="Wallet" />
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Wallet"
                    description="Deposit funds and track your balance."
                />
                <EmptyState
                    icon={Wallet}
                    title="Your wallet is empty"
                    description="Deposits will be available in a future update."
                />
            </div>
        </>
    );
}

AppWallet.layout = {
    breadcrumbs: [
        {
            title: 'Wallet',
            href: wallet(),
        },
    ],
};
