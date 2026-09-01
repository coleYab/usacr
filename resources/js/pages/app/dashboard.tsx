import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Clock,
    Receipt,
    Ticket as TicketIcon,
    Trophy,
    Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { TicketStatusBadge } from '@/components/ticket-status-badge';
import { dashboard, lotteries, tickets, wallet } from '@/routes/app';
import { show as showLottery } from '@/routes/app/lotteries';
import type { Auth, LotteryRow, TicketRow } from '@/types';

type Props = {
    stats: {
        wallet_balance: string;
        active_tickets_count: number;
        lotteries_won_count: number;
        total_spent: string;
    };
    ending_soon_lotteries: LotteryRow[];
    recent_tickets: TicketRow[];
};

export default function AppDashboard({
    stats,
    ending_soon_lotteries,
    recent_tickets,
}: Props) {
    const page = usePage();
    const auth = page.props.auth as Auth;
    const userName = auth?.user?.name ?? 'ተጫዋች';

    return (
        <>
            <Head title="የተጫዋች ዳሽቦርድ" />
            <div className="flex flex-col gap-8 pb-12">
                {/* Header & Quick Action CTAs */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageHeader
                        title={`እንኳን ደህና መጡ፣ ${userName}!`}
                        description="የቦርሳ ሂሳብዎ፣ ንቁ የዕጣ ተሳትፎዎችዎ እና በቅርቡ የሚጠናቀቁ ዕጣዎች ዝርዝር።"
                    />
                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                        >
                            <Link href={wallet()}>
                                <Wallet className="text-primary size-4" />
                                ገንዘብ አስገባ
                            </Link>
                        </Button>
                        <Button asChild size="sm" className="gap-1.5">
                            <Link href={lotteries()}>
                                <TicketIcon className="size-4" />
                                ዕጣዎችን ያስሱ
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Primary Metric Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="የቦርሳ ሂሳብ"
                        value={stats.wallet_balance}
                        icon={Wallet}
                    />
                    <StatCard
                        label="ንቁ ቲኬቶች"
                        value={stats.active_tickets_count}
                        icon={TicketIcon}
                    />
                    <StatCard
                        label="ያሸነፏቸው ዕጣዎች"
                        value={stats.lotteries_won_count}
                        icon={Trophy}
                    />
                    <StatCard
                        label="ጠቅላላ ወጪ"
                        value={stats.total_spent}
                        icon={Receipt}
                    />
                </div>

                {/* Ending Soon Preview Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-foreground flex items-center gap-2 text-lg font-semibold tracking-tight">
                                <Clock className="text-primary size-4" />
                                በቅርቡ የሚያበቁ እና ተወዳጅ ዕጣዎች
                            </h2>
                            <p className="text-muted-foreground text-xs">
                                በቀጣዮቹ ጥቂት ሰዓታት ውስጥ የሚወጡ ተፈላጊ የቅንጦት ዕቃዎች።
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="gap-1 text-xs"
                        >
                            <Link href={lotteries()}>
                                ሁሉንም ይመልከቱ ({ending_soon_lotteries.length})
                                <ArrowRight className="size-3" />
                            </Link>
                        </Button>
                    </div>

                    {ending_soon_lotteries.length === 0 ? (
                        <EmptyState
                            icon={TicketIcon}
                            title="በቅርቡ የሚወጣ ንቁ ዕጣ የለም"
                            description="ዕለታዊ አዳዲስ የቅንጦት ዕቃዎች ስለሚጨመሩ በቅርቡ ተመልሰው ይመልከቱ።"
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {ending_soon_lotteries.map((lottery) => (
                                <Card
                                    key={lottery.id}
                                    className="hover:border-primary/50 flex flex-col justify-between overflow-hidden rounded-xl transition-all hover:shadow-md"
                                >
                                    <div>
                                        {/* Image thumbnail / preview */}
                                        <div className="bg-muted relative aspect-video w-full overflow-hidden">
                                            {lottery.media &&
                                            lottery.media.length > 0 ? (
                                                <img
                                                    src={lottery.media[0]}
                                                    alt={lottery.title}
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex size-full items-center justify-center">
                                                    <TicketIcon className="text-muted-foreground/50 size-8" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2">
                                                <Badge className="bg-background/90 text-foreground font-mono text-xs shadow-xs backdrop-blur-xs">
                                                    {
                                                        lottery.ticket_price_formatted
                                                    }{' '}
                                                    / ቲኬት
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="space-y-3 p-4">
                                            <div className="space-y-1">
                                                <h3 className="line-clamp-1 text-sm font-semibold">
                                                    {lottery.title}
                                                </h3>
                                                <p className="text-muted-foreground line-clamp-2 text-xs">
                                                    {lottery.description}
                                                </p>
                                            </div>

                                            {/* Progress */}
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between font-mono text-xs">
                                                    <span className="text-muted-foreground">
                                                        {lottery.tickets_sold}{' '}
                                                        ተሽጧል
                                                    </span>
                                                    <span className="text-foreground font-medium">
                                                        {
                                                            lottery.remaining_tickets
                                                        }{' '}
                                                        ቀርቷል
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={
                                                        lottery.progress_percentage
                                                    }
                                                    className="h-1.5"
                                                />
                                            </div>
                                        </CardContent>
                                    </div>

                                    <div className="p-4 pt-0">
                                        <Button
                                            asChild
                                            className="w-full gap-2"
                                            size="sm"
                                        >
                                            <Link
                                                href={showLottery.url({
                                                    lottery: lottery.id,
                                                })}
                                            >
                                                ይመልከቱ እና ቲኬት ይግዙ
                                                <ArrowRight className="size-3.5" />
                                            </Link>
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Tickets Activity */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-foreground flex items-center gap-2 text-lg font-semibold tracking-tight">
                                <TicketIcon className="text-primary size-4" />
                                የቅርብ ጊዜ ቲኬቶችዎ
                            </h2>
                            <p className="text-muted-foreground text-xs">
                                በቀጥታ እና ባለፉት ዕጣዎች ውስጥ የገዟቸው ቲኬቶች።
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="gap-1 text-xs"
                        >
                            <Link href={tickets()}>
                                ሁሉንም ቲኬቶች ይመልከቱ
                                <ArrowRight className="size-3" />
                            </Link>
                        </Button>
                    </div>

                    {recent_tickets.length === 0 ? (
                        <EmptyState
                            icon={TicketIcon}
                            title="እስካሁን ምንም ቲኬት አልገዙም"
                            description="የቀረቡትን ዕቃዎች ይመልከቱ እና የማሸነፍ ዕድልዎን ይሞክሩ።"
                            action={
                                <Button asChild size="sm">
                                    <Link href={lotteries()}>ዕጣዎችን ያስሱ</Link>
                                </Button>
                            }
                        />
                    ) : (
                        <div className="bg-card space-y-3 rounded-xl border p-4 shadow-xs">
                            {recent_tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="flex flex-col justify-between gap-3 rounded-lg border p-3 text-xs sm:flex-row sm:items-center"
                                >
                                    <div className="min-w-0 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-foreground font-mono font-bold">
                                                {ticket.ticket_code}
                                            </span>
                                            <TicketStatusBadge
                                                status={ticket.status}
                                                label={ticket.status_label}
                                            />
                                        </div>
                                        <p className="text-muted-foreground truncate">
                                            {ticket.lottery
                                                ? ticket.lottery.title
                                                : 'ዕጣ'}{' '}
                                            &bull; የተከፈለ{' '}
                                            <span className="text-foreground font-mono font-medium">
                                                {ticket.price_paid_formatted}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="text-muted-foreground flex items-center justify-between gap-3 sm:justify-end">
                                        <span>{ticket.created_at_diff}</span>
                                        {ticket.lottery && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                                className="h-7 text-xs"
                                            >
                                                <Link
                                                    href={showLottery.url({
                                                        lottery:
                                                            ticket.lottery.id,
                                                    })}
                                                >
                                                    ዕጣውን ይመልከቱ
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

AppDashboard.layout = {
    breadcrumbs: [
        {
            title: 'ዳሽቦርድ',
            href: dashboard(),
        },
    ],
};
