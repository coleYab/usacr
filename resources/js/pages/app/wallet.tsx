import { Head } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    ListChecks,
    ReceiptText,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { DepositStatusBadge } from '@/components/deposit-status-badge';
import { navigate } from '@/lib/navigate';
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
import { toDataTablePagination } from '@/lib/pagination';
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
        from: string;
        to: string;
    };
};

const navToPage = (params: Record<string, string | number | undefined>) =>
    navigate(wallet.url(), params);

function depositColumns(
    viewReceipt: (d: DepositRow) => void,
): DataTableColumn<DepositRow>[] {
    return [
        {
            header: 'Date',
            cell: (d) => (
                <div>
                    <p className="font-medium">{d.created_at_formatted}</p>
                    <p className="text-muted-foreground text-xs">
                        {d.created_at_diff}
                    </p>
                </div>
            ),
        },
        {
            header: 'Amount',
            cell: (d) => (
                <span className="font-mono font-medium">
                    {d.amount_formatted}
                </span>
            ),
        },
        {
            header: 'Status',
            cell: (d) => (
                <DepositStatusBadge status={d.status} label={d.status_label} />
            ),
        },
        {
            header: 'Receipt',
            cell: (d) =>
                d.receipt_url ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewReceipt(d)}
                    >
                        View
                    </Button>
                ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                ),
        },
        {
            header: 'Rejection Reason',
            className: 'max-w-xs',
            cell: (d) =>
                d.status === 'rejected' && d.rejection_reason ? (
                    <span className="text-destructive line-clamp-2 text-xs">
                        {d.rejection_reason}
                    </span>
                ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                ),
        },
    ];
}

function transactionsColumns(): DataTableColumn<TransactionRow>[] {
    return [
        {
            header: 'Date',
            cell: (t) => (
                <div>
                    <p className="font-medium">{t.created_at_formatted}</p>
                    <p className="text-muted-foreground text-xs">
                        {t.created_at_diff}
                    </p>
                </div>
            ),
        },
        {
            header: 'Type',
            cell: (t) => (
                <TransactionTypeBadge
                    isCredit={t.is_credit}
                    label={t.type_label}
                />
            ),
        },
        {
            header: 'Description',
            cell: (t) => (
                <span className="text-muted-foreground">
                    {t.description ?? '—'}
                </span>
            ),
        },
        {
            header: 'Amount',
            className: 'text-right',
            cell: (t) => (
                <span
                    className={cn(
                        'inline-flex items-center gap-1 font-mono font-medium',
                        t.is_credit ? 'text-primary' : 'text-destructive',
                        !t.is_credit && !t.amount.startsWith('-') && '-',
                    )}
                >
                    {t.is_credit ? (
                        <ArrowUpRight className="size-3.5" />
                    ) : (
                        <ArrowDownRight className="size-3.5" />
                    )}
                    {t.amount_formatted}
                </span>
            ),
        },
        {
            header: 'Balance',
            className: 'text-right',
            cell: (t) => (
                <span className="text-muted-foreground font-mono">
                    {t.balance_after_formatted}
                </span>
            ),
        },
    ];
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

    const [localType, setLocalType] = useState(filters.type);
    const [localFrom, setLocalFrom] = useState(filters.from);
    const [localTo, setLocalTo] = useState(filters.to);

    const applyFilters = () => {
        navToPage({
            tab: 'transactions',
            type: localType,
            from: localFrom,
            to: localTo,
        });
    };

    return (
        <>
            <Head title="Wallet" />
            <div className="flex flex-col gap-6">
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
                        <Button onClick={() => setRequestOpen(true)}>
                            <ReceiptText className="size-4" />
                            Request Deposit
                        </Button>
                    </div>
                </div>

                <Tabs value={tab} onValueChange={(v) => setTab(v)}>
                    <TabsList>
                        <TabsTrigger value="pending">
                            Pending Deposits
                        </TabsTrigger>
                        <TabsTrigger value="transactions">
                            Transaction History
                        </TabsTrigger>
                        <TabsTrigger value="history">
                            Deposit History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-4 pt-4">
                        <DataTable
                            columns={depositColumns(setReceipt)}
                            rows={pending.data}
                            keyExtractor={(d) => d.id}
                            emptyIcon={ListChecks}
                            emptyTitle="No pending deposits"
                            emptyDescription="Requests you submit awaiting review will appear here."
                            pagination={toDataTablePagination(
                                pending.pagination,
                                (page) => navToPage({ tab: 'pending', page }),
                            )}
                        />
                    </TabsContent>

                    <TabsContent
                        value="transactions"
                        className="space-y-4 pt-4"
                    >
                        <div className="flex flex-wrap items-end gap-3 rounded-lg border p-3">
                            <div className="space-y-1">
                                <Label htmlFor="tx-type">Type</Label>
                                <Select
                                    value={localType}
                                    onValueChange={(v) => setLocalType(v)}
                                >
                                    <SelectTrigger
                                        id="tx-type"
                                        className="h-9 w-40"
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
                            <div className="space-y-1">
                                <Label htmlFor="tx-from">From</Label>
                                <Input
                                    id="tx-from"
                                    type="date"
                                    value={localFrom}
                                    onChange={(e) =>
                                        setLocalFrom(e.target.value)
                                    }
                                    className="h-9 w-40"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="tx-to">To</Label>
                                <Input
                                    id="tx-to"
                                    type="date"
                                    value={localTo}
                                    onChange={(e) => setLocalTo(e.target.value)}
                                    className="h-9 w-40"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={applyFilters}>
                                    Apply
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setLocalType('all');
                                        setLocalFrom('');
                                        setLocalTo('');
                                        navToPage({ tab: 'transactions' });
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                        <DataTable
                            columns={transactionsColumns()}
                            rows={transactions.data}
                            keyExtractor={(t) => t.id}
                            emptyIcon={ReceiptText}
                            emptyTitle="No transactions yet"
                            emptyDescription="Credits and debits will appear here."
                            pagination={toDataTablePagination(
                                transactions.pagination,
                                (page) =>
                                    navToPage({
                                        tab: 'transactions',
                                        page,
                                        ...filters,
                                    }),
                            )}
                        />
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4 pt-4">
                        <DataTable
                            columns={depositColumns(setReceipt)}
                            rows={history.data}
                            keyExtractor={(d) => d.id}
                            emptyIcon={ListChecks}
                            emptyTitle="No deposit history yet"
                            emptyDescription="Your approved and rejected deposits will appear here."
                            pagination={toDataTablePagination(
                                history.pagination,
                                (page) => navToPage({ tab: 'history', page }),
                            )}
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
