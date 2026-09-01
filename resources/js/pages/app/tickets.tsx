import { Head, Link } from '@inertiajs/react';
import { Calendar, Sparkles, Ticket as TicketIcon, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { TicketStatusBadge } from '@/components/ticket-status-badge';
import { navigate } from '@/lib/navigate';
import { lotteries, tickets as ticketsRoute } from '@/routes/app';
import { show as showLottery } from '@/routes/app/lotteries';
import { cn } from '@/lib/utils';
import type { Paginated, TicketRow } from '@/types';

type Props = {
    tickets: Paginated<TicketRow>;
    counts: {
        active: number;
        won: number;
        lost: number;
        refunded: number;
        all: number;
    };
    filters: {
        tab: string;
    };
};

export default function AppTickets({ tickets, counts, filters }: Props) {
    const [tab, setTab] = useState(filters.tab || 'active');

    const handleTabChange = (val: string) => {
        setTab(val);
        navigate(ticketsRoute.url(), { tab: val });
    };

    return (
        <>
            <Head title="የእኔ ቲኬቶች" />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageHeader
                        title="የእኔ ቲኬቶች"
                        description="በቀጥታ፣ ባሸነፏቸው እና ባለፉት ዕጣዎች ውስጥ ያሉዎትን ቲኬቶች ይከታተሉ።"
                    />
                    <Button asChild className="shrink-0 gap-2">
                        <Link href={lotteries()}>
                            <Sparkles className="size-4" />
                            ተጨማሪ ዕጣዎችን ያስሱ
                        </Link>
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs value={tab} onValueChange={handleTabChange}>
                    <TabsList>
                        <TabsTrigger value="active">
                            ንቁ ({counts.active})
                        </TabsTrigger>
                        <TabsTrigger value="won" className="gap-1.5">
                            {counts.won > 0 && (
                                <Trophy className="size-3 text-amber-500" />
                            )}
                            ያሸነፉ ({counts.won})
                        </TabsTrigger>
                        <TabsTrigger value="lost">
                            ያላሸነፉ ({counts.lost})
                        </TabsTrigger>
                        <TabsTrigger value="refunded">
                            ተመላሽ ({counts.refunded})
                        </TabsTrigger>
                        <TabsTrigger value="all">
                            ሁሉም ({counts.all})
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Tickets List */}
                {tickets.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {tickets.data.map((ticket) => {
                            const lottery = ticket.lottery;
                            const isWon = ticket.status === 'won';
                            const image =
                                lottery?.media && lottery.media.length > 0
                                    ? lottery.media[0]
                                    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60';

                            return (
                                <Card
                                    key={ticket.id}
                                    className={cn(
                                        'border-border overflow-hidden transition-all duration-200 hover:shadow-sm',
                                        isWon &&
                                            'border-amber-500/40 bg-amber-500/5 shadow-xs ring-1 ring-amber-500/20',
                                    )}
                                >
                                    <div className="flex flex-col gap-4 p-5">
                                        {/* Header Row with Thumbnail, Title & Badge */}
                                        <div className="flex items-start gap-3">
                                            <div className="bg-muted size-16 shrink-0 overflow-hidden rounded-lg border">
                                                <img
                                                    src={image}
                                                    alt={
                                                        lottery?.title ??
                                                        'የዕጣ ዕቃ'
                                                    }
                                                    className="size-full object-cover"
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1 space-y-1">
                                                <div className="flex items-center justify-between gap-1">
                                                    <TicketStatusBadge
                                                        status={ticket.status}
                                                        label={
                                                            ticket.status_label
                                                        }
                                                    />
                                                    <span className="text-foreground font-mono text-xs font-semibold">
                                                        {
                                                            ticket.price_paid_formatted
                                                        }
                                                    </span>
                                                </div>

                                                <Link
                                                    href={
                                                        lottery
                                                            ? showLottery.url({
                                                                  lottery:
                                                                      lottery.id,
                                                              })
                                                            : '#'
                                                    }
                                                    className="hover:text-primary line-clamp-1 block text-sm font-semibold transition-colors"
                                                >
                                                    {lottery?.title ??
                                                        'የእቃ ሎተሪ'}
                                                </Link>

                                                <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
                                                    <Calendar className="size-3" />
                                                    <span>
                                                        {
                                                            ticket.created_at_formatted
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ticket Code Row */}
                                        <div className="bg-muted/40 flex items-center justify-between rounded-lg border p-2.5 text-xs">
                                            <span className="text-muted-foreground flex items-center gap-1.5">
                                                <TicketIcon className="size-3.5" />
                                                የቲኬት ኮድ
                                            </span>
                                            <span className="text-foreground font-mono text-sm font-bold tracking-wider">
                                                {ticket.ticket_code}
                                            </span>
                                        </div>

                                        {/* Action / Winner Callout */}
                                        {isWon ? (
                                            <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/15 p-2.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                                                <Trophy className="size-4 shrink-0 text-amber-500" />
                                                <span>
                                                    እንኳን ደስ አለዎት! ይህ አሸናፊ ቲኬት
                                                    ነው።
                                                </span>
                                            </div>
                                        ) : lottery ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                                className="h-8 w-full justify-between text-xs"
                                            >
                                                <Link
                                                    href={showLottery.url({
                                                        lottery: lottery.id,
                                                    })}
                                                >
                                                    <span>
                                                        የዕጣውን ዝርዝር ይመልከቱ
                                                    </span>
                                                    <span className="text-primary font-medium">
                                                        &rarr;
                                                    </span>
                                                </Link>
                                            </Button>
                                        ) : null}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-card rounded-xl border p-12">
                        <EmptyState
                            icon={TicketIcon}
                            title="በዚህ ክፍል ውስጥ ምንም ቲኬት የለም"
                            description={
                                tab === 'won'
                                    ? 'እስካሁን ምንም ዕጣ አላሸነፉም። ዕድልዎን መሞከርዎን ይቀጥሉ!'
                                    : tab === 'active'
                                      ? 'ምንም ንቁ የሎተሪ ቲኬት የለዎትም። ለመጀመር የቀጥታ ዕጣ ይሳተፉ!'
                                      : 'ለዚህ ሁኔታ ምንም ቲኬቶች አልተገኙም።'
                            }
                            action={
                                <Button asChild size="sm">
                                    <Link href={lotteries()}>
                                        የቀጥታ ዕጣዎችን ያስሱ
                                    </Link>
                                </Button>
                            }
                        />
                    </div>
                )}

                {/* Pagination */}
                {tickets.pagination.last_page > 1 && (
                    <div className="text-muted-foreground flex items-center justify-between border-t pt-4 text-sm">
                        <p>
                            ገጽ{' '}
                            <span className="text-foreground font-medium">
                                {tickets.pagination.current_page}
                            </span>{' '}
                            ከ{' '}
                            <span className="text-foreground font-medium">
                                {tickets.pagination.last_page}
                            </span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={tickets.pagination.current_page <= 1}
                                onClick={() =>
                                    navigate(ticketsRoute.url(), {
                                        tab,
                                        page:
                                            tickets.pagination.current_page - 1,
                                    })
                                }
                            >
                                ቀዳሚ
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    tickets.pagination.current_page >=
                                    tickets.pagination.last_page
                                }
                                onClick={() =>
                                    navigate(ticketsRoute.url(), {
                                        tab,
                                        page:
                                            tickets.pagination.current_page + 1,
                                    })
                                }
                            >
                                ቀጣይ
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

AppTickets.layout = {
    breadcrumbs: [
        {
            title: 'የእኔ ቲኬቶች',
            href: ticketsRoute(),
        },
    ],
};
