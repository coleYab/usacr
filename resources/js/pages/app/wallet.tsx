import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowDownRight,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    ListChecks,
    Receipt,
    ReceiptText,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DepositStatusBadge } from '@/components/deposit-status-badge';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { ReceiptDialog } from '@/components/receipt-dialog';
import { RequestDepositDialog } from '@/components/request-deposit-dialog';
import { StatCard } from '@/components/stat-card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TransactionTypeBadge } from '@/components/transaction-type-badge';
import { navigate } from '@/lib/navigate';
import { wallet } from '@/routes/app';
import { cn } from '@/lib/utils';
import type { DepositRow, Paginated, TransactionRow } from '@/types';

type Props = {
    balance: string;
    pending: Paginated<DepositRow>;
    history: Paginated<DepositRow>;
    transactions: Paginated<TransactionRow>;
    filters: {
        type: string;
        from?: string;
        to?: string;
    };
};

const navToPage = (params: Record<string, string | number | undefined>) =>
    navigate(wallet.url(), params);

function PaginationControls({
    pagination,
    onPageChange,
}: {
    pagination: Paginated<unknown>['pagination'];
    onPageChange: (page: number) => void;
}) {
    if (pagination.last_page <= 1) {
        return null;
    }

    return (
        <div className="text-muted-foreground flex items-center justify-between border-t pt-4 text-xs sm:text-sm">
            <p>
                Showing page{' '}
                <span className="text-foreground font-medium">
                    {pagination.current_page}
                </span>{' '}
                of{' '}
                <span className="text-foreground font-medium">
                    {pagination.last_page}
                </span>
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page <= 1}
                    onClick={() => onPageChange(pagination.current_page - 1)}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page >= pagination.last_page}
                    onClick={() => onPageChange(pagination.current_page + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

export default function AppWallet({
    balance,
    pending,
    history,
    transactions,
    filters,
}: Props) {
    const [tab, setTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const searchTab = new URLSearchParams(window.location.search).get(
                'tab',
            );
            if (
                searchTab &&
                ['pending', 'transactions', 'history'].includes(searchTab)
            ) {
                return searchTab;
            }
        }
        return 'pending';
    });
    const [requestOpen, setRequestOpen] = useState(false);
    const [receipt, setReceipt] = useState<DepositRow | null>(null);
    const [localType, setLocalType] = useState(filters.type || 'all');

    const handleTabChange = (val: string) => {
        setTab(val);
        navToPage({
            tab: val,
            type:
                val === 'transactions' && localType !== 'all'
                    ? localType
                    : undefined,
        });
    };

    const handleTypeChange = (val: string) => {
        setLocalType(val);
        navToPage({
            tab: 'transactions',
            type: val === 'all' ? undefined : val,
        });
    };

    return (
        <>
            <Head title="Wallet" />
            <div className="flex min-h-[100dvh] flex-col gap-6 pb-12">
                <PageHeader
                    title="Wallet"
                    description="Deposit funds and track your balance and history."
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <StatCard
                        label="Available Balance"
                        value={balance}
                        icon={Wallet}
                        className="w-full sm:max-w-md"
                    />

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setRequestOpen(true)}
                            className="gap-2"
                        >
                            <ReceiptText className="size-4" />
                            Request Deposit
                        </Button>
                    </div>
                </div>

                <Tabs
                    value={tab}
                    onValueChange={handleTabChange}
                    className="space-y-4"
                >
                    <TabsList className="w-full justify-start sm:w-auto">
                        <TabsTrigger
                            value="pending"
                            className="flex-1 sm:flex-initial"
                        >
                            Pending{' '}
                            {pending.pagination.total > 0 &&
                                `(${pending.pagination.total})`}
                        </TabsTrigger>
                        <TabsTrigger
                            value="transactions"
                            className="flex-1 sm:flex-initial"
                        >
                            Transactions{' '}
                            {transactions.pagination.total > 0 &&
                                `(${transactions.pagination.total})`}
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="flex-1 sm:flex-initial"
                        >
                            Deposits{' '}
                            {history.pagination.total > 0 &&
                                `(${history.pagination.total})`}
                        </TabsTrigger>
                    </TabsList>

                    {/* Pending Tab */}
                    <TabsContent value="pending" className="space-y-3 pt-2">
                        {pending.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {pending.data.map((d) => (
                                    <Card
                                        key={d.id}
                                        className="border-border overflow-hidden transition-all hover:shadow-xs"
                                    >
                                        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                            <div className="flex items-start gap-3.5">
                                                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 font-bold text-amber-600 dark:text-amber-400">
                                                    <Clock className="size-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-foreground font-mono text-lg font-bold sm:text-xl">
                                                            {d.amount_formatted}
                                                        </span>
                                                        <DepositStatusBadge
                                                            status={d.status}
                                                            label={
                                                                d.status_label
                                                            }
                                                        />
                                                    </div>
                                                    <p className="text-muted-foreground text-xs">
                                                        Submitted{' '}
                                                        {d.created_at_formatted}{' '}
                                                        ({d.created_at_diff})
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end border-t pt-2.5 sm:border-0 sm:pt-0">
                                                {d.receipt_url ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 gap-1.5 text-xs"
                                                        onClick={() =>
                                                            setReceipt(d)
                                                        }
                                                    >
                                                        <Receipt className="size-3.5" />
                                                        View Receipt
                                                    </Button>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">
                                                        No receipt attached
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-card rounded-xl border p-10">
                                <EmptyState
                                    icon={ListChecks}
                                    title="No pending deposits"
                                    description="Requests you submit awaiting review will appear here."
                                    action={
                                        <Button
                                            size="sm"
                                            onClick={() => setRequestOpen(true)}
                                            className="mt-2"
                                        >
                                            <ReceiptText className="mr-1.5 size-4" />
                                            Request Deposit
                                        </Button>
                                    }
                                />
                            </div>
                        )}

                        <PaginationControls
                            pagination={pending.pagination}
                            onPageChange={(page) =>
                                navToPage({ tab: 'pending', page })
                            }
                        />
                    </TabsContent>

                    {/* Transactions Tab */}
                    <TabsContent
                        value="transactions"
                        className="space-y-4 pt-2"
                    >
                        {/* Type Filter only (Date filters removed per user request) */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <span className="text-muted-foreground text-xs font-medium">
                                    Type:
                                </span>
                                <Select
                                    value={localType}
                                    onValueChange={handleTypeChange}
                                >
                                    <SelectTrigger
                                        id="tx-type"
                                        className="h-8 w-40 text-xs"
                                    >
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All types
                                        </SelectItem>
                                        <SelectItem value="deposit_credit">
                                            Deposit
                                        </SelectItem>
                                        <SelectItem value="ticket_purchase">
                                            Ticket Purchase
                                        </SelectItem>
                                        <SelectItem value="admin_credit">
                                            Admin Credit
                                        </SelectItem>
                                        <SelectItem value="admin_debit">
                                            Admin Debit
                                        </SelectItem>
                                        <SelectItem value="refund">
                                            Refund
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {transactions.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {transactions.data.map((t) => (
                                    <Card
                                        key={t.id}
                                        className="border-border overflow-hidden transition-all hover:shadow-xs"
                                    >
                                        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                            <div className="flex items-start gap-3.5">
                                                <div
                                                    className={cn(
                                                        'mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl font-bold',
                                                        t.is_credit
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                                                    )}
                                                >
                                                    {t.is_credit ? (
                                                        <ArrowUpRight className="size-5" />
                                                    ) : (
                                                        <ArrowDownRight className="size-5" />
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <TransactionTypeBadge
                                                            isCredit={
                                                                t.is_credit
                                                            }
                                                            label={t.type_label}
                                                        />
                                                        <span className="text-muted-foreground text-xs">
                                                            {
                                                                t.created_at_formatted
                                                            }{' '}
                                                            ({t.created_at_diff}
                                                            )
                                                        </span>
                                                    </div>
                                                    <p className="text-foreground text-sm font-medium">
                                                        {t.description ?? '—'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t pt-2.5 sm:flex-col sm:items-end sm:justify-center sm:border-0 sm:pt-0">
                                                <span
                                                    className={cn(
                                                        'font-mono text-base font-bold sm:text-lg',
                                                        t.is_credit
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-rose-600 dark:text-rose-400',
                                                    )}
                                                >
                                                    {t.is_credit ? '+' : '-'}
                                                    {t.amount_formatted.replace(
                                                        '-',
                                                        '',
                                                    )}
                                                </span>
                                                <span className="text-muted-foreground font-mono text-xs">
                                                    Balance:{' '}
                                                    {t.balance_after_formatted}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-card rounded-xl border p-10">
                                <EmptyState
                                    icon={ReceiptText}
                                    title="No transactions yet"
                                    description="Credits and debits will appear here."
                                />
                            </div>
                        )}

                        <PaginationControls
                            pagination={transactions.pagination}
                            onPageChange={(page) =>
                                navToPage({
                                    tab: 'transactions',
                                    page,
                                    type:
                                        localType !== 'all'
                                            ? localType
                                            : undefined,
                                })
                            }
                        />
                    </TabsContent>

                    {/* Deposits (History) Tab */}
                    <TabsContent value="history" className="space-y-3 pt-2">
                        {history.data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {history.data.map((d) => (
                                    <Card
                                        key={d.id}
                                        className="border-border overflow-hidden transition-all hover:shadow-xs"
                                    >
                                        <CardContent className="flex flex-col gap-3 p-4 sm:p-5">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-start gap-3.5">
                                                    <div
                                                        className={cn(
                                                            'mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl font-bold',
                                                            d.status ===
                                                                'approved'
                                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                : 'bg-destructive/10 text-destructive',
                                                        )}
                                                    >
                                                        {d.status ===
                                                        'approved' ? (
                                                            <CheckCircle2 className="size-5" />
                                                        ) : (
                                                            <AlertCircle className="size-5" />
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-foreground font-mono text-lg font-bold sm:text-xl">
                                                                {
                                                                    d.amount_formatted
                                                                }
                                                            </span>
                                                            <DepositStatusBadge
                                                                status={
                                                                    d.status
                                                                }
                                                                label={
                                                                    d.status_label
                                                                }
                                                            />
                                                        </div>
                                                        <p className="text-muted-foreground text-xs">
                                                            {
                                                                d.created_at_formatted
                                                            }{' '}
                                                            ({d.created_at_diff}
                                                            )
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end">
                                                    {d.receipt_url && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 gap-1.5 text-xs"
                                                            onClick={() =>
                                                                setReceipt(d)
                                                            }
                                                        >
                                                            <Receipt className="size-3.5" />
                                                            View Receipt
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            {d.status === 'rejected' &&
                                                d.rejection_reason && (
                                                    <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg border p-3 text-xs">
                                                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                                                        <div>
                                                            <span className="font-semibold">
                                                                Rejection
                                                                reason:{' '}
                                                            </span>
                                                            <span>
                                                                {
                                                                    d.rejection_reason
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-card rounded-xl border p-10">
                                <EmptyState
                                    icon={ListChecks}
                                    title="No deposit history yet"
                                    description="Your approved and rejected deposits will appear here."
                                />
                            </div>
                        )}

                        <PaginationControls
                            pagination={history.pagination}
                            onPageChange={(page) =>
                                navToPage({ tab: 'history', page })
                            }
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <RequestDepositDialog
                open={requestOpen}
                onOpenChange={setRequestOpen}
            />

            {receipt && (
                <ReceiptDialog
                    deposit={receipt}
                    open={Boolean(receipt)}
                    onOpenChange={(open) => !open && setReceipt(null)}
                />
            )}
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
