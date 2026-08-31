import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    Hash,
    Search,
    ShieldCheck,
    Sparkles,
    Ticket,
    Trophy,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { navigate } from '@/lib/navigate';
import { lotteries, results } from '@/routes/app';
import { show as showLottery } from '@/routes/app/lotteries';
import type { CompletedLotteryRow, Paginated } from '@/types';

type Props = {
    lotteries: Paginated<CompletedLotteryRow>;
    filters: {
        search: string;
    };
    totalCompleted: number;
};

export default function AppResults({
    lotteries: paginated,
    filters,
    totalCompleted,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(results.url(), {
            search: search || undefined,
        });
    };

    const handleSearchClear = () => {
        setSearch('');
        navigate(results.url(), {});
    };

    return (
        <>
            <Head title="Raffle Results" />
            <div className="flex flex-col gap-6 pb-12">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageHeader
                        title="Past Raffle Results"
                        description={`Browse winning tickets, verified draws, and winners across ${totalCompleted} concluded lotteries.`}
                    />
                    <Button asChild className="shrink-0 gap-2">
                        <Link href={lotteries()}>
                            <Sparkles className="size-4" />
                            Browse Live Raffles
                        </Link>
                    </Button>
                </div>

                {/* Search Bar & Trust Banner */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-muted-foreground bg-muted/50 flex w-fit items-center gap-2 rounded-lg border px-3 py-1.5 text-xs">
                        <ShieldCheck className="size-4 shrink-0 text-emerald-500" />
                        <span>
                            All draws use cryptographically secure seeds and
                            immutable ledger verifications.
                        </span>
                    </div>

                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative flex w-full max-w-sm items-center gap-2"
                    >
                        <div className="relative w-full">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                type="search"
                                placeholder="Search concluded raffles…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 pr-8 pl-9"
                            />
                        </div>
                        <Button type="submit" size="sm" variant="secondary">
                            Search
                        </Button>
                        {search && (
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={handleSearchClear}
                            >
                                Clear
                            </Button>
                        )}
                    </form>
                </div>

                {/* Results Grid */}
                {paginated.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {paginated.data.map((lottery) => {
                            const image =
                                lottery.media && lottery.media.length > 0
                                    ? lottery.media[0]
                                    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60';

                            return (
                                <Card
                                    key={lottery.id}
                                    className="group border-border overflow-hidden transition-all duration-200 hover:shadow-md"
                                >
                                    {/* Thumbnail Header */}
                                    <div className="bg-muted relative aspect-16/9 w-full overflow-hidden">
                                        <img
                                            src={image}
                                            alt={lottery.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                        {/* Status & Date */}
                                        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                                            <Badge
                                                variant="secondary"
                                                className="bg-background/90 font-semibold shadow-xs backdrop-blur-xs"
                                            >
                                                <CheckCircle2 className="mr-1 size-3 text-emerald-500" />
                                                Concluded
                                            </Badge>
                                            <span className="rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-xs">
                                                {lottery.draw_at_formatted}
                                            </span>
                                        </div>

                                        {/* Winner Tag Floating */}
                                        <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between text-xs text-white">
                                            <div className="flex items-center gap-1.5 truncate">
                                                <Trophy className="size-4 shrink-0 text-amber-400" />
                                                <span className="truncate font-semibold">
                                                    Winner:{' '}
                                                    {lottery.winner_name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <CardContent className="flex flex-col gap-4 p-5">
                                        <div className="space-y-1">
                                            <Link
                                                href={showLottery.url({
                                                    lottery: lottery.id,
                                                })}
                                                className="hover:text-primary line-clamp-1 block text-base font-bold transition-colors"
                                            >
                                                {lottery.title}
                                            </Link>
                                            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                                                {lottery.description}
                                            </p>
                                        </div>

                                        {/* Winning Ticket Box */}
                                        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-800 dark:text-amber-300">
                                                <Ticket className="size-3.5" />
                                                Winning Ticket
                                            </span>
                                            <span className="font-mono text-sm font-bold tracking-wider text-amber-600 dark:text-amber-400">
                                                {lottery.winning_ticket_code}
                                            </span>
                                        </div>

                                        {/* Stats Row */}
                                        <div className="text-muted-foreground grid grid-cols-2 gap-2 border-t pt-3 text-[11px]">
                                            <div className="flex items-center gap-1">
                                                <Ticket className="size-3" />
                                                <span>
                                                    {lottery.tickets_sold}{' '}
                                                    tickets sold
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-end gap-1">
                                                <Users className="size-3" />
                                                <span>
                                                    {lottery.participant_count}{' '}
                                                    players
                                                </span>
                                            </div>
                                        </div>

                                        {/* Cryptographic Verification Hash Preview */}
                                        {lottery.verification_hash && (
                                            <div className="bg-muted/40 text-muted-foreground flex items-center justify-between gap-1 overflow-hidden rounded-lg p-2 text-[10px]">
                                                <span className="flex shrink-0 items-center gap-1 font-medium">
                                                    <Hash className="size-2.5" />
                                                    Audit Hash:
                                                </span>
                                                <span className="truncate font-mono select-all">
                                                    {lottery.verification_hash.slice(
                                                        0,
                                                        16,
                                                    )}
                                                    …
                                                    {lottery.verification_hash.slice(
                                                        -8,
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="w-full"
                                        >
                                            <Link
                                                href={showLottery.url({
                                                    lottery: lottery.id,
                                                })}
                                            >
                                                View Raffle Details &amp;
                                                Outcome
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-card rounded-xl border p-12">
                        <EmptyState
                            icon={Trophy}
                            title="No concluded raffle results yet"
                            description={
                                search
                                    ? `No completed raffles matched "${search}". Try clearing your search filter.`
                                    : 'Completed raffles with their winning tickets and draw logs will appear here once drawn.'
                            }
                            action={
                                <Button asChild size="sm">
                                    <Link href={lotteries()}>
                                        Browse Live Raffles
                                    </Link>
                                </Button>
                            }
                        />
                    </div>
                )}

                {/* Pagination */}
                {paginated.pagination.last_page > 1 && (
                    <div className="text-muted-foreground flex items-center justify-between border-t pt-4 text-sm">
                        <p>
                            Showing page{' '}
                            <span className="text-foreground font-medium">
                                {paginated.pagination.current_page}
                            </span>{' '}
                            of{' '}
                            <span className="text-foreground font-medium">
                                {paginated.pagination.last_page}
                            </span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    paginated.pagination.current_page <= 1
                                }
                                onClick={() =>
                                    navigate(results.url(), {
                                        search: search || undefined,
                                        page:
                                            paginated.pagination.current_page -
                                            1,
                                    })
                                }
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    paginated.pagination.current_page >=
                                    paginated.pagination.last_page
                                }
                                onClick={() =>
                                    navigate(results.url(), {
                                        search: search || undefined,
                                        page:
                                            paginated.pagination.current_page +
                                            1,
                                    })
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

AppResults.layout = {
    breadcrumbs: [
        {
            title: 'Results',
            href: results(),
        },
    ],
};
