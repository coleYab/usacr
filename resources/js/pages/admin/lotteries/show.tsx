import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CircleDollarSign,
    Ticket as TicketIcon,
    Users,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CancelLotteryDialog } from '@/components/cancel-lottery-dialog';
import { CountdownBadge } from '@/components/countdown-badge';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { LotteryStatusBadge } from '@/components/lottery-status-badge';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { TicketStatusBadge } from '@/components/ticket-status-badge';
import { dashboard, lotteries } from '@/routes/admin';
import type { LotteryParticipant, LotteryRow, TicketRow } from '@/types';

type Props = {
    lottery: LotteryRow;
    participants: LotteryParticipant[];
    recentTickets: TicketRow[];
};

export default function AdminLotteriesShow({
    lottery,
    participants,
    recentTickets,
}: Props) {
    const [cancelOpen, setCancelOpen] = useState(false);

    const images =
        lottery.media && lottery.media.length > 0
            ? lottery.media
            : [
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
              ];

    const totalCollectedNumeric = (
        lottery.tickets_sold * parseFloat(lottery.ticket_price)
    ).toFixed(2);

    const participantColumns: DataTableColumn<LotteryParticipant>[] = [
        {
            header: 'User',
            cell: (p) => (
                <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-muted-foreground text-xs">{p.email}</p>
                </div>
            ),
        },
        {
            header: 'Tickets Owned',
            cell: (p) => (
                <span className="font-mono text-sm font-medium">
                    {p.ticket_count} ticket{p.ticket_count > 1 ? 's' : ''}
                </span>
            ),
        },
        {
            header: 'Total Spent',
            className: 'text-right',
            cell: (p) => (
                <span className="text-foreground font-mono text-sm font-semibold">
                    {p.total_spent_formatted}
                </span>
            ),
        },
    ];

    const ticketColumns: DataTableColumn<TicketRow>[] = [
        {
            header: 'Ticket Code',
            cell: (t) => (
                <span className="font-mono text-xs font-bold">
                    {t.ticket_code}
                </span>
            ),
        },
        {
            header: 'User',
            cell: (t) => (
                <span className="text-muted-foreground text-xs">
                    {t.user?.name ?? '—'}
                </span>
            ),
        },
        {
            header: 'Price Paid',
            cell: (t) => (
                <span className="font-mono text-xs">
                    {t.price_paid_formatted}
                </span>
            ),
        },
        {
            header: 'Status',
            cell: (t) => (
                <TicketStatusBadge status={t.status} label={t.status_label} />
            ),
        },
        {
            header: 'Purchased At',
            cell: (t) => (
                <span className="text-muted-foreground text-xs">
                    {t.created_at_formatted}
                </span>
            ),
        },
    ];

    return (
        <>
            <Head title={`Manage: ${lottery.title}`} />
            <div className="flex flex-col gap-6 pb-12">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="-ml-3 gap-1"
                    >
                        <Link href={lotteries()}>
                            <ArrowLeft className="size-4" />
                            Back to Lotteries
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        <LotteryStatusBadge
                            status={lottery.status}
                            label={lottery.status_label}
                        />
                        <CountdownBadge
                            targetDate={lottery.draw_at}
                            isClosed={lottery.status !== 'active'}
                        />
                        {lottery.status === 'active' && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setCancelOpen(true)}
                                className="ml-2 gap-1"
                            >
                                <XCircle className="size-4" />
                                Cancel &amp; Refund
                            </Button>
                        )}
                    </div>
                </div>

                <PageHeader
                    title={lottery.title}
                    description={`Live sales analytics, participant roster, and ticket log for Raffle #${lottery.id}.`}
                />

                {/* Hero Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Tickets Sold"
                        value={`${lottery.tickets_sold} / ${lottery.total_tickets}`}
                        icon={TicketIcon}
                    />
                    <StatCard
                        label="Gross Revenue"
                        value={`$${totalCollectedNumeric}`}
                        icon={CircleDollarSign}
                    />
                    <StatCard
                        label="Unique Players"
                        value={lottery.participant_count}
                        icon={Users}
                    />
                    <StatCard
                        label="Draw Time"
                        value={lottery.draw_at_formatted}
                        icon={Calendar}
                    />
                </div>

                {/* Sales Progress & Media Showcase */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Sales &amp; Capacity Progress</CardTitle>
                            <CardDescription>
                                {lottery.remaining_tickets} tickets remaining
                                until sellout.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-semibold">
                                    <span>
                                        Sales Velocity (
                                        {lottery.progress_percentage}%)
                                    </span>
                                    <span className="text-primary font-mono">
                                        {lottery.tickets_sold} of{' '}
                                        {lottery.total_tickets} sold
                                    </span>
                                </div>
                                <Progress
                                    value={lottery.progress_percentage}
                                    className="h-3 rounded-full"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm sm:grid-cols-3">
                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        Ticket Price
                                    </p>
                                    <p className="text-foreground font-mono text-base font-semibold">
                                        {lottery.ticket_price_formatted}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        Max Potential Gross
                                    </p>
                                    <p className="text-foreground font-mono text-base font-semibold">
                                        $
                                        {(
                                            lottery.total_tickets *
                                            parseFloat(lottery.ticket_price)
                                        ).toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        Raffle ID
                                    </p>
                                    <p className="text-foreground font-mono text-base font-semibold">
                                        #{lottery.id}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Item Gallery</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="bg-muted aspect-16/10 overflow-hidden rounded-lg border">
                                <img
                                    src={images[0]}
                                    alt={lottery.title}
                                    className="size-full object-cover"
                                />
                            </div>
                            {images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {images.slice(1).map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`Preview ${i + 2}`}
                                            className="size-14 rounded-md border object-cover"
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Participants Roster */}
                <div className="space-y-3">
                    <h2 className="text-lg font-bold">
                        Participants Roster ({participants.length})
                    </h2>
                    <DataTable
                        columns={participantColumns}
                        rows={participants}
                        keyExtractor={(p) => p.id ?? Math.random()}
                        emptyIcon={Users}
                        emptyTitle="No participants yet"
                        emptyDescription="Users who buy tickets will appear in this roster."
                    />
                </div>

                {/* Recent Tickets Purchase Log */}
                <div className="space-y-3">
                    <h2 className="text-lg font-bold">
                        Recent Ticket Purchases (Latest 20)
                    </h2>
                    <DataTable
                        columns={ticketColumns}
                        rows={recentTickets}
                        keyExtractor={(t) => t.id}
                        emptyIcon={TicketIcon}
                        emptyTitle="No tickets sold yet"
                        emptyDescription="Sold tickets will be logged here."
                    />
                </div>
            </div>

            <CancelLotteryDialog
                lottery={lottery}
                open={cancelOpen}
                onOpenChange={setCancelOpen}
            />
        </>
    );
}

AdminLotteriesShow.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: dashboard(),
        },
        {
            title: 'Lotteries',
            href: lotteries(),
        },
        {
            title: 'Monitoring',
            href: '#',
        },
    ],
};
