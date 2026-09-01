import { Head } from '@inertiajs/react';
import { Search, Ticket } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/empty-state';
import { LotteryCard } from '@/components/lottery-card';
import { PageHeader } from '@/components/page-header';
import { navigate } from '@/lib/navigate';
import { lotteries as lotteriesRoute } from '@/routes/app';
import type { LotteryRow, Paginated } from '@/types';

type Props = {
    lotteries: Paginated<LotteryRow>;
    counts: {
        active: number;
        ending_soon: number;
        all: number;
    };
    filters: {
        tab: string;
        search: string;
    };
};

export default function AppLotteries({ lotteries, counts, filters }: Props) {
    const [tab, setTab] = useState(filters.tab || 'active');
    const [search, setSearch] = useState(filters.search || '');

    const applyFilter = (newTab: string, newSearch: string) => {
        navigate(lotteriesRoute.url(), {
            tab: newTab,
            search: newSearch || undefined,
        });
    };

    const handleTabChange = (val: string) => {
        setTab(val);
        applyFilter(val, search);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter(tab, search);
    };

    const handleSearchClear = () => {
        setSearch('');
        applyFilter(tab, '');
    };

    return (
        <>
            <Head title="ዕጣዎች" />
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="የቀጥታ ዕጣዎች"
                    description="የእቃ ሎተሪዎችን ያስሱ፣ በቦርሳ ሂሳብዎ ቲኬቶችን ይግዙ እና ልዩ ሽልማቶችን ያሸንፉ።"
                />

                {/* Filter and Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Tabs value={tab} onValueChange={handleTabChange}>
                        <TabsList>
                            <TabsTrigger value="active">
                                የቀጥታ ({counts.active})
                            </TabsTrigger>
                            <TabsTrigger value="ending_soon">
                                በቅርቡ የሚያበቁ ({counts.ending_soon})
                            </TabsTrigger>
                            <TabsTrigger value="all">
                                ሁሉም ({counts.all})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative flex w-full max-w-sm items-center gap-2"
                    >
                        <div className="relative w-full">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                type="search"
                                placeholder="በዕጣ ርዕስ ይፈልጉ…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 pr-8 pl-9"
                            />
                        </div>
                        <Button type="submit" size="sm" variant="secondary">
                            ፈልግ
                        </Button>
                        {search && (
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={handleSearchClear}
                            >
                                አጽዳ
                            </Button>
                        )}
                    </form>
                </div>

                {/* Lottery Card Grid */}
                {lotteries.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {lotteries.data.map((lottery) => (
                            <LotteryCard key={lottery.id} lottery={lottery} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-card rounded-xl border p-12">
                        <EmptyState
                            icon={Ticket}
                            title="ምንም ዕጣ አልተገኘም"
                            description={
                                search
                                    ? `ከ"${search}" ጋር የሚዛመድ ዕጣ አልተገኘም። እባክዎ የፍለጋ ማጣሪያውን ያጽዱ።`
                                    : 'በዚህ ምድብ ውስጥ በአሁኑ ጊዜ ምንም ንቁ ዕጣ የለም። በቅርቡ ተመልሰው ይመልከቱ!'
                            }
                        />
                    </div>
                )}

                {/* Simple Pagination Controls if multi-page */}
                {lotteries.pagination.last_page > 1 && (
                    <div className="text-muted-foreground flex items-center justify-between border-t pt-4 text-sm">
                        <p>
                            ገጽ{' '}
                            <span className="text-foreground font-medium">
                                {lotteries.pagination.current_page}
                            </span>{' '}
                            ከ{' '}
                            <span className="text-foreground font-medium">
                                {lotteries.pagination.last_page}
                            </span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    lotteries.pagination.current_page <= 1
                                }
                                onClick={() =>
                                    navigate(lotteriesRoute.url(), {
                                        tab,
                                        search: search || undefined,
                                        page:
                                            lotteries.pagination.current_page -
                                            1,
                                    })
                                }
                            >
                                ቀዳሚ
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    lotteries.pagination.current_page >=
                                    lotteries.pagination.last_page
                                }
                                onClick={() =>
                                    navigate(lotteriesRoute.url(), {
                                        tab,
                                        search: search || undefined,
                                        page:
                                            lotteries.pagination.current_page +
                                            1,
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

AppLotteries.layout = {
    breadcrumbs: [
        {
            title: 'ዕጣዎች',
            href: lotteriesRoute(),
        },
    ],
};
