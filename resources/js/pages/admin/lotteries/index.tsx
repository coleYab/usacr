import { Head, Link } from '@inertiajs/react';
import {
    CircleDollarSign,
    Eye,
    Gift,
    Plus,
    Ticket as TicketIcon,
    Users,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CancelLotteryDialog } from '@/components/cancel-lottery-dialog';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { LotteryStatusBadge } from '@/components/lottery-status-badge';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { navigate } from '@/lib/navigate';
import { toDataTablePagination } from '@/lib/pagination';
import { dashboard, lotteries } from '@/routes/admin';
import { create, show } from '@/routes/admin/lotteries';
import type { LotteryRow, Paginated } from '@/types';

type Props = {
    lotteries: Paginated<LotteryRow>;
    stats: {
        active_count: number;
        tickets_sold: number;
        revenue_formatted: string;
        participants_count: number;
    };
    counts: {
        all: number;
        active: number;
        draft: number;
        completed: number;
        cancelled: number;
    };
    filters: {
        tab: string;
        search: string;
    };
};

export default function AdminLotteriesIndex({
    lotteries: paginated,
    stats,
    counts,
    filters,
}: Props) {
    const [tab, setTab] = useState(filters.tab || 'all');
    const [cancellingLottery, setCancellingLottery] =
        useState<LotteryRow | null>(null);

    const handleTabChange = (val: string) => {
        setTab(val);
        navigate(lotteries.url(), { tab: val });
    };

    const columns: DataTableColumn<LotteryRow>[] = [
        {
            header: 'Raffle Item',
            cell: (row) => {
                const img =
                    row.media && row.media.length > 0 ? row.media[0] : null;
                return (
                    <div className="flex items-center gap-3">
                        {img && (
                            <img
                                src={img}
                                alt={row.title}
                                className="size-10 shrink-0 rounded-md border object-cover"
                            />
                        )}
                        <div>
                            <Link
                                href={show.url({ lottery: row.id })}
                                className="hover:text-primary line-clamp-1 font-semibold transition-colors"
                            >
                                {row.title}
                            </Link>
                            <span className="text-muted-foreground font-mono text-xs">
                                {row.ticket_price_formatted} / ticket
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            header: 'Status',
            cell: (row) => (
                <LotteryStatusBadge
                    status={row.status}
                    label={row.status_label}
                />
            ),
        },
        {
            header: 'Sales & Progress',
            cell: (row) => (
                <div className="w-48 space-y-1.5">
                    <div className="flex justify-between font-mono text-xs">
                        <span className="text-foreground font-semibold">
                            {row.tickets_sold} / {row.total_tickets}
                        </span>
                        <span className="text-muted-foreground">
                            {row.progress_percentage}%
                        </span>
                    </div>
                    <Progress
                        value={row.progress_percentage}
                        className="h-1.5"
                    />
                    <span className="text-muted-foreground block text-[11px]">
                        {row.remaining_tickets} remaining
                    </span>
                </div>
            ),
        },
        {
            header: 'Players',
            cell: (row) => (
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Users className="size-3.5" />
                    <span className="text-foreground font-medium">
                        {row.participant_count}
                    </span>
                </div>
            ),
        },
        {
            header: 'Draw Time',
            cell: (row) => (
                <div>
                    <p className="text-xs font-medium">
                        {row.draw_at_formatted}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                        {row.draw_at_diff}
                    </p>
                </div>
            ),
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1.5">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={show.url({ lottery: row.id })}>
                            <Eye className="mr-1 size-3.5" />
                            Details
                        </Link>
                    </Button>
                    {row.status === 'active' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setCancellingLottery(row)}
                        >
                            <XCircle className="mr-1 size-3.5" />
                            Cancel
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Lotteries Management" />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageHeader
                        title="Lotteries &amp; Raffles"
                        description="Create, monitor live progress, and manage raffle lifecycles."
                    />
                    <Button asChild className="shrink-0 gap-2">
                        <Link href={create.url()}>
                            <Plus className="size-4" />
                            Create Lottery
                        </Link>
                    </Button>
                </div>

                {/* Summary Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Active Lotteries"
                        value={stats.active_count}
                        icon={Gift}
                    />
                    <StatCard
                        label="Total Tickets Sold"
                        value={stats.tickets_sold}
                        icon={TicketIcon}
                    />
                    <StatCard
                        label="Gross Revenue"
                        value={stats.revenue_formatted}
                        icon={CircleDollarSign}
                    />
                    <StatCard
                        label="Total Participants"
                        value={stats.participants_count}
                        icon={Users}
                    />
                </div>

                {/* Tabs & Table */}
                <Tabs value={tab} onValueChange={handleTabChange}>
                    <TabsList>
                        <TabsTrigger value="all">
                            All ({counts.all})
                        </TabsTrigger>
                        <TabsTrigger value="active">
                            Active ({counts.active})
                        </TabsTrigger>
                        <TabsTrigger value="draft">
                            Drafts ({counts.draft})
                        </TabsTrigger>
                        <TabsTrigger value="completed">
                            Completed ({counts.completed})
                        </TabsTrigger>
                        <TabsTrigger value="cancelled">
                            Cancelled ({counts.cancelled})
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <DataTable
                    columns={columns}
                    rows={paginated.data}
                    keyExtractor={(row) => row.id}
                    emptyIcon={Gift}
                    emptyTitle="No lotteries in this section"
                    emptyDescription="Created lotteries matching this status filter will appear here."
                    pagination={toDataTablePagination(
                        paginated.pagination,
                        (page) => navigate(lotteries.url(), { tab, page }),
                    )}
                />
            </div>

            <CancelLotteryDialog
                lottery={cancellingLottery}
                open={Boolean(cancellingLottery)}
                onOpenChange={(open) => !open && setCancellingLottery(null)}
            />
        </>
    );
}

AdminLotteriesIndex.layout = {
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
