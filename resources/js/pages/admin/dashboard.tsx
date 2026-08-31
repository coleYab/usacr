import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CircleDollarSign,
    Plus,
    Shield,
    Sparkles,
    Ticket as TicketIcon,
    Trophy,
    Users,
    Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { audit, dashboard, deposits, draws } from '@/routes/admin';
import {
    create as createLottery,
    show as showLottery,
} from '@/routes/admin/lotteries';

type AdminActionFeed = {
    id: number;
    admin_name: string;
    action_type: string;
    description: string;
    created_at_formatted: string;
    created_at_diff: string;
};

type DrawFeed = {
    id: number;
    lottery_id: number;
    lottery_title: string;
    winning_ticket_code: string;
    winner_name: string;
    total_participants: number;
    total_tickets: number;
    processed_at_formatted: string;
    processed_at_diff: string;
};

type Props = {
    stats: {
        total_users: number;
        total_platform_balance: string;
        pending_deposits_count: number;
        active_lotteries_count: number;
        tickets_sold_today: number;
        tickets_sold_total: number;
    };
    recent_actions: AdminActionFeed[];
    recent_draws: DrawFeed[];
};

export default function AdminDashboard({
    stats,
    recent_actions,
    recent_draws,
}: Props) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-col gap-6">
                {/* Header & Quick Action Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageHeader
                        title="Platform Operations Dashboard"
                        description="High-level operational metrics, liquidity balances, active lotteries, and live compliance audit feeds."
                    />
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href={deposits()}>
                                Pending Deposits ({stats.pending_deposits_count}
                                )
                            </Link>
                        </Button>
                        <Button asChild size="sm" className="gap-1.5">
                            <Link href={createLottery()}>
                                <Plus className="size-4" />
                                Create Lottery
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Primary Metric Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <StatCard
                        label="Registered Users"
                        value={stats.total_users}
                        icon={Users}
                    />
                    <StatCard
                        label="Total User Funds"
                        value={stats.total_platform_balance}
                        icon={CircleDollarSign}
                    />
                    <StatCard
                        label="Pending Deposits"
                        value={stats.pending_deposits_count}
                        icon={Wallet}
                    />
                    <StatCard
                        label="Active Lotteries"
                        value={stats.active_lotteries_count}
                        icon={Sparkles}
                    />
                    <StatCard
                        label="Tickets Sold Today"
                        value={stats.tickets_sold_today}
                        icon={TicketIcon}
                    />
                    <StatCard
                        label="Total Tickets Sold"
                        value={stats.tickets_sold_total}
                        icon={Trophy}
                    />
                </div>

                {/* Two-Column Activity Feeds */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Admin Actions Audit */}
                    <Card className="rounded-xl shadow-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <Shield className="text-primary size-4" />
                                    Recent Admin Actions
                                </CardTitle>
                                <p className="text-muted-foreground text-xs">
                                    Latest administrative events logged to
                                    immutable audit trail.
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="gap-1 text-xs"
                            >
                                <Link href={audit()}>
                                    View Audit
                                    <ArrowRight className="size-3" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-0">
                            {recent_actions.length === 0 ? (
                                <p className="text-muted-foreground py-6 text-center text-xs">
                                    No administrative actions logged yet.
                                </p>
                            ) : (
                                recent_actions.map((action) => (
                                    <div
                                        key={action.id}
                                        className="flex items-start justify-between gap-3 rounded-lg border p-3 text-xs"
                                    >
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="px-1.5 py-0 font-mono text-[10px]"
                                                >
                                                    {action.action_type}
                                                </Badge>
                                                <span className="text-foreground truncate font-medium">
                                                    by {action.admin_name}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground line-clamp-2">
                                                {action.description}
                                            </p>
                                        </div>
                                        <span className="text-muted-foreground shrink-0 text-[11px]">
                                            {action.created_at_diff}
                                        </span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Automated Draws */}
                    <Card className="rounded-xl shadow-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <Trophy className="size-4 text-amber-500" />
                                    Recent Draw Executions
                                </CardTitle>
                                <p className="text-muted-foreground text-xs">
                                    Verified automated and manual draw outcomes.
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="gap-1 text-xs"
                            >
                                <Link href={draws()}>
                                    View All Draws
                                    <ArrowRight className="size-3" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-0">
                            {recent_draws.length === 0 ? (
                                <p className="text-muted-foreground py-6 text-center text-xs">
                                    No lottery draws have executed yet.
                                </p>
                            ) : (
                                recent_draws.map((draw) => (
                                    <div
                                        key={draw.id}
                                        className="flex items-center justify-between gap-3 rounded-lg border p-3 text-xs"
                                    >
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={showLottery.url({
                                                        lottery:
                                                            draw.lottery_id,
                                                    })}
                                                    className="text-foreground hover:text-primary truncate font-medium transition-colors"
                                                >
                                                    {draw.lottery_title}
                                                </Link>
                                                <Badge
                                                    variant="outline"
                                                    className="border-amber-500/30 bg-amber-500/10 px-1.5 py-0 font-mono text-[10px] text-amber-600 dark:text-amber-400"
                                                >
                                                    {draw.winning_ticket_code}
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground">
                                                Winner:{' '}
                                                <span className="text-foreground font-medium">
                                                    {draw.winner_name}
                                                </span>{' '}
                                                &bull; {draw.total_tickets}{' '}
                                                tickets (
                                                {draw.total_participants}{' '}
                                                players)
                                            </p>
                                        </div>
                                        <span className="text-muted-foreground shrink-0 text-[11px]">
                                            {draw.processed_at_diff}
                                        </span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: dashboard(),
        },
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
