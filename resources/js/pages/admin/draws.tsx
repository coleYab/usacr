import { Head, Link, router } from '@inertiajs/react';
import {
    Clock,
    Copy,
    Hash,
    Play,
    RefreshCw,
    Ticket as TicketIcon,
    Trophy,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { navigate } from '@/lib/navigate';
import { toDataTablePagination } from '@/lib/pagination';
import { draws } from '@/routes/admin';
import { run as runDraws } from '@/routes/admin/draws';
import { show as showAdminLottery } from '@/routes/admin/lotteries';
import type { DrawLogRow, Paginated } from '@/types';

type Props = {
    draws: Paginated<DrawLogRow>;
    stats: {
        total_draws: number;
        total_tickets_drawn: number;
        total_participants: number;
        pending_count: number;
    };
};

export default function AdminDraws({ draws: paginated, stats }: Props) {
    const [running, setRunning] = useState(false);
    const [copiedHash, setCopiedHash] = useState<string | null>(null);

    const handleRunDraws = () => {
        setRunning(true);
        router.post(
            runDraws.url(),
            {},
            {
                preserveScroll: true,
                onFinish: () => setRunning(false),
            },
        );
    };

    const handleCopy = (text: string) => {
        void navigator.clipboard.writeText(text);
        setCopiedHash(text);
        setTimeout(() => setCopiedHash(null), 2000);
    };

    const columns: DataTableColumn<DrawLogRow>[] = [
        {
            header: 'Raffle Item',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    {row.lottery_thumbnail ? (
                        <img
                            src={row.lottery_thumbnail}
                            alt={row.lottery_title}
                            className="size-10 shrink-0 rounded-md border object-cover"
                        />
                    ) : (
                        <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md">
                            <TicketIcon className="text-muted-foreground size-5" />
                        </div>
                    )}
                    <div className="max-w-[200px] min-w-0 space-y-0.5">
                        <Link
                            href={showAdminLottery.url({
                                lottery: row.lottery_id,
                            })}
                            className="text-foreground hover:text-primary block truncate font-medium transition-colors"
                        >
                            {row.lottery_title}
                        </Link>
                        <span className="text-muted-foreground text-[11px]">
                            ID #{row.lottery_id}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            header: 'Winning Ticket',
            cell: (row) => (
                <div className="space-y-1">
                    <Badge
                        variant="outline"
                        className="border-amber-500/40 bg-amber-500/10 font-mono text-xs font-bold text-amber-600 dark:text-amber-400"
                    >
                        {row.winning_ticket_code}
                    </Badge>
                </div>
            ),
        },
        {
            header: 'Winner Account',
            cell: (row) => (
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Trophy className="size-3 shrink-0 text-amber-500" />
                        <span>{row.winner_name}</span>
                    </div>
                    <p className="text-muted-foreground max-w-[180px] truncate text-[11px]">
                        {row.winner_email}
                    </p>
                </div>
            ),
        },
        {
            header: 'Scale',
            cell: (row) => (
                <div className="space-y-0.5 text-xs">
                    <div className="font-medium">
                        {row.total_tickets} tickets
                    </div>
                    <div className="text-muted-foreground text-[11px]">
                        {row.total_participants} players
                    </div>
                </div>
            ),
        },
        {
            header: 'Provable Fairness',
            cell: (row) => (
                <div className="max-w-[220px] space-y-1">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => handleCopy(row.verification_hash)}
                            className="text-muted-foreground hover:text-foreground bg-muted/60 flex items-center gap-1 truncate rounded border px-2 py-0.5 font-mono text-[10px]"
                            title={`Seed: ${row.verification_seed}\nHash: ${row.verification_hash}`}
                        >
                            <Hash className="size-2.5 shrink-0" />
                            <span className="truncate">
                                {row.verification_hash.slice(0, 14)}…
                            </span>
                            <Copy className="size-2.5 shrink-0 opacity-70" />
                        </button>
                    </div>
                    {copiedHash === row.verification_hash && (
                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            Hash copied!
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: 'Draw Timestamp',
            cell: (row) => (
                <div className="space-y-0.5 text-xs">
                    <div className="text-foreground font-medium">
                        {row.processed_at_formatted}
                    </div>
                    <div className="text-muted-foreground text-[11px]">
                        {row.processed_at_diff}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Automated Draw Oversight" />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageHeader
                        title="Automated Draw Oversight"
                        description="Audit provable randomness logs, winning ticket records, and trigger manual scheduled draw evaluations."
                    />
                    <Button
                        onClick={handleRunDraws}
                        disabled={running}
                        className="bg-primary shrink-0 gap-2"
                    >
                        {running ? (
                            <RefreshCw className="size-4 animate-spin" />
                        ) : (
                            <Play className="size-4" />
                        )}
                        Run Draws Now
                    </Button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Completed Draws"
                        value={stats.total_draws}
                        icon={Trophy}
                    />
                    <StatCard
                        label="Tickets Processed"
                        value={stats.total_tickets_drawn}
                        icon={TicketIcon}
                    />
                    <StatCard
                        label="Total Participants"
                        value={stats.total_participants}
                        icon={Users}
                    />
                    <StatCard
                        label="Pending Draws"
                        value={stats.pending_count}
                        icon={Clock}
                    />
                </div>

                {/* Draw Logs Table */}
                <div className="bg-card space-y-4 rounded-xl border p-6 shadow-xs">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-base font-semibold">
                                Draw Execution History
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                Verifiable audit records with SHA256 hashes
                                generated during every automated draw run.
                            </p>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        rows={paginated.data}
                        keyExtractor={(row) => row.id}
                        emptyIcon={Trophy}
                        emptyTitle="No automated draws executed"
                        emptyDescription="Automated draws and audit verifications will appear here once executed."
                        pagination={toDataTablePagination(
                            paginated.pagination,
                            (page) => navigate(draws.url(), { page }),
                        )}
                    />
                </div>
            </div>
        </>
    );
}

AdminDraws.layout = {
    breadcrumbs: [
        {
            title: 'Draws',
            href: draws(),
        },
    ],
};
