import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    DollarSign,
    History,
    Receipt,
    SlidersHorizontal,
    Ticket as TicketIcon,
    Trophy,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdjustWalletDialog } from '@/components/adjust-wallet-dialog';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { ModerateUserDialog } from '@/components/moderate-user-dialog';
import { StatCard } from '@/components/stat-card';
import { TicketStatusBadge } from '@/components/ticket-status-badge';
import { UserStatusBadge } from '@/components/user-status-badge';
import { navigate } from '@/lib/navigate';
import { toDataTablePagination } from '@/lib/pagination';
import { users } from '@/routes/admin';
import { show as showLottery } from '@/routes/admin/lotteries';
import { show as showUser } from '@/routes/admin/users';
import type {
    AdminUserDetail,
    Paginated,
    TicketRow,
    TransactionRow,
} from '@/types';

type Props = {
    user: AdminUserDetail;
    tickets: Paginated<TicketRow>;
    ledger: Paginated<TransactionRow> | null;
};

export default function AdminUserShow({ user, tickets, ledger }: Props) {
    const [activeTab, setActiveTab] = useState('tickets');

    // Dialog states
    const [moderating, setModerating] = useState(false);
    const [adjusting, setAdjusting] = useState(false);

    const ticketColumns: DataTableColumn<TicketRow>[] = [
        {
            header: 'Ticket Code',
            cell: (row) => (
                <span className="text-foreground font-mono text-xs font-semibold">
                    {row.ticket_code}
                </span>
            ),
        },
        {
            header: 'Raffle Item',
            cell: (row) => (
                <div className="max-w-[240px] space-y-0.5">
                    {row.lottery ? (
                        <Link
                            href={showLottery.url({ lottery: row.lottery.id })}
                            className="text-foreground hover:text-primary line-clamp-1 text-xs font-medium transition-colors"
                        >
                            {row.lottery.title}
                        </Link>
                    ) : (
                        <span className="text-muted-foreground text-xs">
                            Unknown Lottery
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: 'Price Paid',
            cell: (row) => (
                <span className="text-muted-foreground font-mono text-xs">
                    {row.price_paid_formatted}
                </span>
            ),
        },
        {
            header: 'Outcome',
            cell: (row) => (
                <TicketStatusBadge
                    status={row.status}
                    label={row.status_label}
                />
            ),
        },
        {
            header: 'Purchased At',
            cell: (row) => (
                <div className="space-y-0.5 text-xs">
                    <div className="text-foreground">
                        {row.created_at_formatted}
                    </div>
                    <div className="text-muted-foreground text-[11px]">
                        {row.created_at_diff}
                    </div>
                </div>
            ),
        },
    ];

    const ledgerColumns: DataTableColumn<TransactionRow>[] = [
        {
            header: 'Transaction Type',
            cell: (row) => (
                <div className="space-y-0.5">
                    <Badge variant="outline" className="text-xs capitalize">
                        {row.type_label}
                    </Badge>
                    {row.description && (
                        <p className="text-muted-foreground max-w-[260px] truncate text-[11px]">
                            {row.description}
                        </p>
                    )}
                </div>
            ),
        },
        {
            header: 'Amount',
            cell: (row) => (
                <span
                    className={`font-mono text-xs font-semibold ${
                        row.is_credit
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                    }`}
                >
                    {row.is_credit ? '+' : '-'}
                    {row.amount_formatted}
                </span>
            ),
        },
        {
            header: 'Balance After',
            cell: (row) => (
                <span className="text-foreground font-mono text-xs">
                    {row.balance_after_formatted}
                </span>
            ),
        },
        {
            header: 'Timestamp',
            cell: (row) => (
                <div className="space-y-0.5 text-xs">
                    <div className="text-foreground">
                        {row.created_at_formatted}
                    </div>
                    <div className="text-muted-foreground text-[11px]">
                        {row.created_at_diff}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title={`User #${user.id} — ${user.name}`} />
            <div className="flex flex-col gap-6">
                {/* Back button & PageHeader */}
                <div className="flex flex-col gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-muted-foreground -ml-2 w-fit"
                    >
                        <Link href={users()}>
                            <ArrowLeft className="mr-1.5 size-4" />
                            Back to User Directory
                        </Link>
                    </Button>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-foreground text-2xl font-bold tracking-tight">
                                    {user.name}
                                </h1>
                                <UserStatusBadge status={user.status} />
                                {user.role === 'admin' && (
                                    <Badge variant="secondary">Admin</Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-sm">
                                {user.email} &bull; Account created on{' '}
                                {user.created_at_formatted} (
                                {user.created_at_diff})
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setAdjusting(true)}
                                className="gap-1.5"
                            >
                                <Wallet className="text-primary size-4" />
                                Adjust Wallet
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setModerating(true)}
                                className="gap-1.5"
                            >
                                <SlidersHorizontal className="size-4" />
                                Moderate Account
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 360-Degree Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <StatCard
                        label="Wallet Balance"
                        value={user.balance_formatted}
                        icon={Wallet}
                    />
                    <StatCard
                        label="Lifetime Deposits"
                        value={user.lifetime_deposits_formatted}
                        icon={DollarSign}
                    />
                    <StatCard
                        label="Total Spent"
                        value={user.total_spent_formatted}
                        icon={Receipt}
                    />
                    <StatCard
                        label="Tickets Purchased"
                        value={user.tickets_count}
                        icon={TicketIcon}
                    />
                    <StatCard
                        label="Lotteries Won"
                        value={user.lotteries_won_count}
                        icon={Trophy}
                    />
                </div>

                {/* Activity Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-4"
                >
                    <TabsList>
                        <TabsTrigger value="tickets" className="gap-2">
                            <TicketIcon className="size-4" />
                            Ticket History ({user.tickets_count})
                        </TabsTrigger>
                        <TabsTrigger value="ledger" className="gap-2">
                            <History className="size-4" />
                            Wallet Ledger
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="tickets" className="space-y-4">
                        <div className="bg-card rounded-xl border p-4 shadow-xs">
                            <DataTable
                                columns={ticketColumns}
                                rows={tickets.data}
                                keyExtractor={(row) => row.id}
                                emptyIcon={TicketIcon}
                                emptyTitle="No tickets purchased"
                                emptyDescription="This user has not purchased any lottery tickets yet."
                                pagination={toDataTablePagination(
                                    tickets.pagination,
                                    (page) =>
                                        navigate(
                                            showUser.url({ user: user.id }),
                                            { tickets_page: page },
                                        ),
                                )}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="ledger" className="space-y-4">
                        <div className="bg-card rounded-xl border p-4 shadow-xs">
                            {ledger ? (
                                <DataTable
                                    columns={ledgerColumns}
                                    rows={ledger.data}
                                    keyExtractor={(row) => row.id}
                                    emptyIcon={History}
                                    emptyTitle="No wallet transactions"
                                    emptyDescription="No transaction history found for this user wallet."
                                    pagination={toDataTablePagination(
                                        ledger.pagination,
                                        (page) =>
                                            navigate(
                                                showUser.url({ user: user.id }),
                                                { ledger_page: page },
                                            ),
                                    )}
                                />
                            ) : (
                                <div className="text-muted-foreground p-8 text-center text-sm">
                                    No wallet account assigned to this user.
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Moderation Dialog */}
            <ModerateUserDialog
                user={user}
                open={moderating}
                onOpenChange={setModerating}
            />

            {/* Wallet Adjustment Dialog */}
            <AdjustWalletDialog
                user={user}
                open={adjusting}
                onOpenChange={setAdjusting}
            />
        </>
    );
}

AdminUserShow.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: users(),
        },
        {
            title: 'User Profile',
            href: '#',
        },
    ],
};
