import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    Flame,
    Hash,
    HelpCircle,
    Home,
    Lock,
    Menu,
    Package,
    ShieldCheck,
    Ticket,
    Trophy,
    User,
    Wallet,
    X,
    Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AppLogo from '@/components/app-logo';
import { LotteryCard } from '@/components/lottery-card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TelegramLoginButton } from '@/components/telegram/telegram-login-button';
import {
    dashboard as appDashboard,
    lotteries as lotteriesRoute,
    results as resultsRoute,
    wallet as walletRoute,
} from '@/routes/app';
import { show as showLottery } from '@/routes/app/lotteries';
import { dashboard as adminDashboard } from '@/routes/admin';
import type { Auth, LotteryRow } from '@/types';

type RecentWinner = {
    id: number;
    title: string;
    thumbnail: string | null;
    winner_name: string;
    winning_ticket_code: string;
    drawn_at_diff: string;
    verification_hash: string | null;
};

type Props = {
    featured_lotteries: LotteryRow[];
    recent_winners: RecentWinner[];
    stats: {
        active_count: number;
        completed_count: number;
        verified_draws: number;
    };
};

const steps = [
    {
        icon: Wallet,
        step: '01',
        title: 'ሂሳብዎን ይሙሉ',
        description:
            'በክፍያ ማረጋገጫ ወይም በካርድ አማካኝነት ደህንነቱ በተጠበቀ መንገድ ወደ ኦዲት ወደተደረገው የሂሳብ ቦርሳዎ ገንዘብ ያስገቡ።',
    },
    {
        icon: Ticket,
        step: '02',
        title: 'ዕቃዎችን ይምረጡ እና ቲኬት ይግዙ',
        description:
            'የቅንጦት ሰዓቶችን፣ ዘመናዊ ቴክኖሎጂዎችን ወይም ምርጥ ተሽከርካሪዎችን ግልጽ እና ቋሚ በሆነ ዕድል ይምረጡ።',
    },
    {
        icon: Trophy,
        step: '03',
        title: 'የተረጋገጠ ዕጣ እና ርክክብ',
        description:
            'የእኛ አውቶማቲክ የSHA-256 ሲስተም አሸናፊውን ይመርጣል። እውነተኛው እቃ ዋስትና ተሰጥቶት በዓለም ዙሪያ ይላካል።',
    },
];

export default function Welcome({
    featured_lotteries,
    recent_winners,
    stats,
}: Props) {
    const page = usePage();
    const auth = page.props.auth as Auth;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<
        'all' | 'ending_soon' | 'under_25' | 'luxury'
    >('all');

    useEffect(() => {
        if (!auth.user) {
            return;
        }

        const target =
            auth.user.role === 'admin' ? adminDashboard() : appDashboard();

        router.visit(target, {
            preserveState: false,
        });
    }, [auth.user]);

    const filteredLotteries = useMemo(() => {
        if (!featured_lotteries) {
            return [];
        }
        if (categoryFilter === 'ending_soon') {
            return [...featured_lotteries].sort(
                (a, b) =>
                    new Date(a.draw_at).getTime() -
                    new Date(b.draw_at).getTime(),
            );
        }
        if (categoryFilter === 'under_25') {
            return featured_lotteries.filter(
                (l) => parseFloat(l.ticket_price) <= 25.0,
            );
        }
        if (categoryFilter === 'luxury') {
            return featured_lotteries.filter(
                (l) => parseFloat(l.ticket_price) > 25.0,
            );
        }
        return featured_lotteries;
    }, [featured_lotteries, categoryFilter]);

    return (
        <>
            <Head title="የእቃ ሎተሪ — ፍትሃዊነቱ የተረጋገጠ የቅንጦት ዕቃዎች እና ሽልማቶች ዕጣ" />
            <div className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex min-h-screen flex-col">
                <header className="border-border/60 bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md">
                    <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <AppLogo />
                        </div>

                        <nav className="text-muted-foreground hidden items-center gap-6 text-sm font-medium md:flex">
                            <a
                                href="#raffles"
                                className="hover:text-foreground transition-colors"
                            >
                                የቀጥታ ዕጣዎች
                            </a>
                            <a
                                href="#how-it-works"
                                className="hover:text-foreground transition-colors"
                            >
                                እንዴት እንደሚሰራ
                            </a>
                            <a
                                href="#fairness"
                                className="hover:text-foreground transition-colors"
                            >
                                አስተማማኝ ፍትሃዊነት
                            </a>
                            <Link
                                href={resultsRoute()}
                                className="hover:text-foreground transition-colors"
                            >
                                ያለፉት አሸናፊዎች
                            </Link>
                        </nav>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />

                            {auth.user ? (
                                <Button
                                    asChild
                                    size="sm"
                                    className="hidden gap-1.5 shadow-xs sm:inline-flex"
                                >
                                    <Link href={appDashboard()}>
                                        <User className="size-4" />
                                        ዳሽቦርድ
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                </Button>
                            ) : (
                                <div className="hidden items-center gap-2 sm:flex">
                                    <TelegramLoginButton size="sm" />
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <X className="size-5" />
                                ) : (
                                    <Menu className="size-5" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="border-border/60 bg-background/95 animate-in slide-in-from-top-2 border-b p-4 backdrop-blur-md duration-200 md:hidden">
                            <div className="flex flex-col gap-3 text-sm font-medium">
                                <a
                                    href="#raffles"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="hover:bg-muted flex items-center justify-between rounded-lg p-2.5"
                                >
                                    <span className="flex items-center gap-2">
                                        <Flame className="text-primary size-4" />
                                        የቀጥታ ዕጣዎች
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="font-mono text-xs"
                                    >
                                        {stats.active_count} ንቁ
                                    </Badge>
                                </a>
                                <Link
                                    href={resultsRoute()}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="hover:bg-muted flex items-center justify-between rounded-lg p-2.5"
                                >
                                    <span className="flex items-center gap-2">
                                        <Trophy className="size-4 text-amber-500" />
                                        ያለፉት አሸናፊዎች እና ዕጣዎች
                                    </span>
                                    <ArrowRight className="text-muted-foreground size-4" />
                                </Link>
                                <a
                                    href="#how-it-works"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="hover:bg-muted flex items-center justify-between rounded-lg p-2.5"
                                >
                                    <span className="flex items-center gap-2">
                                        <HelpCircle className="text-primary size-4" />
                                        እንዴት እንደሚሰራ
                                    </span>
                                </a>
                                <a
                                    href="#fairness"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="hover:bg-muted flex items-center justify-between rounded-lg p-2.5"
                                >
                                    <span className="flex items-center gap-2">
                                        <ShieldCheck className="size-4 text-emerald-500" />
                                        አስተማማኝ ፍትሃዊነት
                                    </span>
                                </a>

                                <div className="mt-1 flex flex-col gap-2 border-t pt-3">
                                    {auth.user ? (
                                        <Button
                                            asChild
                                            className="w-full justify-center"
                                        >
                                            <Link
                                                href={appDashboard()}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                ዳሽቦርድ ክፈት
                                                <ArrowRight className="ml-1.5 size-4" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <TelegramLoginButton className="w-full justify-center" />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <main className="flex-1 pb-16 sm:pb-0">
                    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
                        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
                            <div className="from-primary/15 via-primary/5 h-[450px] w-[750px] rounded-full bg-gradient-to-b to-transparent blur-3xl" />
                        </div>

                        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                                በእውነተኛ የቅንጦት ዕቃዎች፣{' '}
                                <span className="from-primary bg-gradient-to-r to-amber-500 bg-clip-text text-transparent">
                                    ሰዓቶች እና ዘመናዊ መኪኖች
                                </span>{' '}
                                ዕጣ ላይ ይሳተፉ
                            </h1>

                            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-pretty sm:text-lg">
                                ወደ ኦዲት የተደረገው የሂሳብ ቦርሳዎ ገንዘብ ያስገቡ፣ ቋሚ እና አስተማማኝ
                                በሆነ ዕድል ቲኬቶችን ይግዙ፣ እና እያንዳንዱን ዕጣ በSHA-256 ምስጠራ
                                ያረጋግጡ።
                            </p>

                            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                                <Button
                                    size="lg"
                                    asChild
                                    className="h-12 w-full gap-2 px-7 text-base font-semibold shadow-md sm:w-auto"
                                >
                                    <a href="#raffles">
                                        <Flame className="size-5 text-amber-300" />
                                        የቀጥታ ዕጣዎችን ይመልከቱ
                                        <ArrowRight className="size-4" />
                                    </a>
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    asChild
                                    className="h-12 w-full px-6 text-base sm:w-auto"
                                >
                                    <Link href={resultsRoute()}>
                                        <Trophy className="mr-1.5 size-4 text-amber-500" />
                                        ያለፉትን አሸናፊዎች ይመልከቱ
                                    </Link>
                                </Button>
                            </div>

                            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
                                <div className="bg-card/60 flex items-center gap-3.5 rounded-xl border p-4 shadow-xs backdrop-blur-xs">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                                        <Zap className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                                            ፈጣን ሂሳብ መሙላት
                                        </h4>
                                        <p className="text-muted-foreground text-xs">
                                            ፈጣን የገቢ ደረሰኞች እና የቦርሳ ሂሳብ መዝገብ
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-card/60 flex items-center gap-3.5 rounded-xl border p-4 shadow-xs backdrop-blur-xs">
                                    <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                                        <ShieldCheck className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                                            የSHA-256 ፍትሃዊ ዕጣ
                                        </h4>
                                        <p className="text-muted-foreground text-xs">
                                            በምስጠራ ቁልፍ እና ሃሽ የተረጋገጠ
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-card/60 flex items-center gap-3.5 rounded-xl border p-4 shadow-xs backdrop-blur-xs">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                                        <Package className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                                            ዋስትና ያለው አቅርቦት
                                        </h4>
                                        <p className="text-muted-foreground text-xs">
                                            ክትትል የሚደረግበት ዓለም አቀፍ የዕቃዎች ማድረሻ
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="raffles"
                        className="border-border/60 bg-muted/20 border-t py-12 sm:py-20"
                    >
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                                <div>
                                    <div className="text-primary flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
                                        <Flame className="size-4" />
                                        ተወዳጅ የዕቃዎች ዕጣዎች
                                    </div>
                                    <h2 className="text-foreground mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                                        የቀጥታ እና በቅርቡ የሚጠናቀቁ ዕጣዎች
                                    </h2>
                                    <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                                        የጊዜ ቆጣሪው እንዳበቃ ወዲያውኑ ዕጣ የሚወጣላቸው ውስን ቲኬት
                                        ያላቸው የቅንጦት ዕቃዎች።
                                    </p>
                                </div>

                                <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                                    <Button
                                        size="sm"
                                        variant={
                                            categoryFilter === 'all'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() => setCategoryFilter('all')}
                                        className="shrink-0 rounded-full text-xs"
                                    >
                                        ሁሉም ({featured_lotteries.length})
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={
                                            categoryFilter === 'ending_soon'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() =>
                                            setCategoryFilter('ending_soon')
                                        }
                                        className="shrink-0 gap-1 rounded-full text-xs"
                                    >
                                        <Clock className="text-primary size-3" />
                                        በቅርቡ የሚያበቁ
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={
                                            categoryFilter === 'under_25'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() =>
                                            setCategoryFilter('under_25')
                                        }
                                        className="shrink-0 rounded-full text-xs"
                                    >
                                        &le; $25 / ቲኬት
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={
                                            categoryFilter === 'luxury'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() =>
                                            setCategoryFilter('luxury')
                                        }
                                        className="shrink-0 rounded-full text-xs"
                                    >
                                        የቅንጦት ቪአይፒ
                                    </Button>
                                </div>
                            </div>

                            {filteredLotteries.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {filteredLotteries.map((lottery) => (
                                        <LotteryCard
                                            key={lottery.id}
                                            lottery={lottery}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-card rounded-xl border p-12 text-center">
                                    <Ticket className="text-muted-foreground mx-auto size-8" />
                                    <h3 className="mt-3 text-base font-semibold">
                                        ምንም ዕጣ አልተገኘም
                                    </h3>
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        እባክዎ የተመረጡትን ማጣሪያዎች ይቀይሩ ወይም ትንሽ ቆይተው
                                        እንደገና ይመልከቱ።
                                    </p>
                                </div>
                            )}

                            <div className="mt-10 text-center">
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="gap-2 font-medium"
                                >
                                    <Link href={lotteriesRoute()}>
                                        ሁሉንም ንቁ ዕጣዎች እና ዝርዝር ይመልከቱ
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </section>

                    <section
                        id="how-it-works"
                        className="border-border/60 border-t py-12 sm:py-20"
                    >
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto mb-12 max-w-2xl text-center">
                                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                                    የእቃ ሎተሪ እንዴት ይሰራል?
                                </h2>
                                <p className="text-muted-foreground mt-2 text-xs sm:text-sm">
                                    እርስዎ እና ውድ ዋጋ ያላቸውን እውነተኛ ሽልማቶች የሚያገናኙ ሦስት
                                    ቀላል ደረጃዎች።
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                {steps.map(
                                    ({
                                        icon: Icon,
                                        step,
                                        title,
                                        description,
                                    }) => (
                                        <div
                                            key={step}
                                            className="bg-card hover:border-primary/40 relative flex flex-col gap-4 rounded-2xl border p-6 transition-all hover:shadow-md sm:p-8"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl font-bold">
                                                    <Icon className="size-6" />
                                                </div>
                                                <span className="text-muted-foreground/60 font-mono text-2xl font-black">
                                                    {step}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-foreground text-base font-bold tracking-tight sm:text-lg">
                                                    {title}
                                                </h3>
                                                <p className="text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm">
                                                    {description}
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </section>

                    <section
                        id="fairness"
                        className="border-border/60 bg-muted/30 border-t py-12 sm:py-20"
                    >
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                                <div className="space-y-4 lg:col-span-6">
                                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                                        በሂሳባዊ ስሌት የተረጋገጠ አስተማማኝ ፍትሃዊነት
                                    </h2>
                                    <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                                        እያንዳንዱ ዕጣ በ16-ባይት አስተማማኝ የምስጠራ ቁልፍ
                                        (Server Seed) እና በተሸጡት ቲኬቶች ድምር አማካኝነት
                                        በትክክል ይሰላል።
                                    </p>
                                    <div className="text-muted-foreground space-y-2.5 text-xs">
                                        <div className="flex items-start gap-2.5">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                                            <span>
                                                <strong>
                                                    የSHA-256 ኦዲት ታሪክ፦
                                                </strong>{' '}
                                                እያንዳንዱ የተጠናቀቀ ዕጣ በውጤቶች ማህደር ውስጥ
                                                የሚገኝ የማይለወጥ የSHA-256 ማረጋገጫ ሃሽ
                                                ያስቀምጣል።
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                                            <span>
                                                <strong>
                                                    ምንም ዓይነት ጣልቃ ገብነት የለም፦
                                                </strong>{' '}
                                                አንዴ ዕጣው ከወጣ በኋላ፣ ቁልፎች እና የቲኬት
                                                ኮዶች ከሂሳብ መዝገብ ሊለወጡ ወይም ሊሰረዙ
                                                አይችሉም።
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                                            <span>
                                                <strong>አውቶማቲክ አሰራር፦</strong>{' '}
                                                የጊዜ ቆጣሪው እንዳለቀ ዕጣዎች በሰከንዶች ውስጥ
                                                ወዲያውኑ ይወጣሉ፣ ለተሳታፊዎችም ፈጣን ማሳወቂያ
                                                ይላካል።
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="gap-1.5 text-xs"
                                        >
                                            <Link href={resultsRoute()}>
                                                <Hash className="text-primary size-3.5" />
                                                የተጠናቀቁ ዕጣዎችን እና ሃሾችን ይመርምሩ
                                                <ArrowRight className="size-3" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                <div className="lg:col-span-6">
                                    <div className="bg-card space-y-4 rounded-2xl border p-6 font-mono text-xs shadow-xs">
                                        <div className="text-muted-foreground flex items-center justify-between border-b pb-3">
                                            <span className="text-foreground flex items-center gap-1.5 font-sans font-semibold">
                                                <Lock className="size-3.5 text-emerald-500" />
                                                የዕጣ ማረጋገጫ ቀመር
                                            </span>
                                            <span className="text-[10px]">
                                                PHP 8.5 / SHA-256
                                            </span>
                                        </div>

                                        <div className="bg-muted space-y-2 overflow-x-auto rounded-xl p-4 text-[11px] leading-relaxed">
                                            <div className="text-muted-foreground">
                                                // 1. አስተማማኝ የምስጠራ ቁልፍ ማመንጨት
                                                (Seed)
                                            </div>
                                            <div className="text-primary font-bold">
                                                $seed =
                                                bin2hex(random_bytes(16));
                                            </div>
                                            <div className="text-muted-foreground pt-1">
                                                // 2. አሸናፊውን ቲኬት በትክክል መምረጥ
                                            </div>
                                            <div className="text-foreground">
                                                $winningIndex = random_int(0,
                                                count($tickets) - 1);
                                            </div>
                                            <div className="text-muted-foreground pt-1">
                                                // 3. የማይለወጥ የኦዲት ማረጋገጫ ሃሽ ማስላት
                                            </div>
                                            <div className="text-amber-600 dark:text-amber-400">
                                                $hash = hash('sha256',
                                                "$seed:$winnerId:$totalSold");
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground font-sans text-[11px]">
                                            ማንኛውም ሰው ይፋ በተደረገው የምስጠራ ቁልፍ እና
                                            በተሳታፊዎች ብዛት መሰረት ትክክለኛውን አሸናፊ ቲኬት
                                            እንደገና ማረጋገጥ ይችላል።
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {recent_winners && recent_winners.length > 0 && (
                        <section className="border-border/60 border-t py-12 sm:py-20">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-500 uppercase">
                                            <Trophy className="size-4" />
                                            የአሸናፊዎች ዝርዝር
                                        </div>
                                        <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                                            የቅርብ ጊዜ የተረጋገጡ አሸናፊዎች
                                        </h2>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        asChild
                                        className="gap-1 text-xs"
                                    >
                                        <Link href={resultsRoute()}>
                                            ሁሉንም የተጠናቀቁ ዕጣዎች ይመልከቱ (
                                            {stats.completed_count})
                                            <ArrowRight className="size-3" />
                                        </Link>
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {recent_winners.map((winner) => (
                                        <Card
                                            key={winner.id}
                                            className="overflow-hidden rounded-xl border transition-all hover:shadow-md"
                                        >
                                            <div className="bg-muted relative aspect-video w-full overflow-hidden">
                                                {winner.thumbnail ? (
                                                    <img
                                                        src={winner.thumbnail}
                                                        alt={winner.title}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex size-full items-center justify-center">
                                                        <Trophy className="text-muted-foreground/40 size-8" />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2">
                                                    <Badge className="bg-emerald-600 font-mono text-[10px] text-white shadow-xs">
                                                        {winner.drawn_at_diff}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <CardContent className="space-y-2.5 p-4">
                                                <h3 className="line-clamp-1 text-sm font-semibold">
                                                    {winner.title}
                                                </h3>

                                                <div className="flex items-center justify-between border-t pt-1 text-xs">
                                                    <span className="text-muted-foreground">
                                                        አሸናፊ፦
                                                    </span>
                                                    <span className="text-foreground font-semibold">
                                                        {winner.winner_name}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground">
                                                        ቲኬት፦
                                                    </span>
                                                    <span className="text-primary font-mono font-bold">
                                                        {
                                                            winner.winning_ticket_code
                                                        }
                                                    </span>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    className="mt-1 h-7 w-full text-xs"
                                                >
                                                    <Link
                                                        href={showLottery.url({
                                                            lottery: winner.id,
                                                        })}
                                                    >
                                                        የውጤት ማረጋገጫውን ይመልከቱ
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                        <div className="bg-card relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border p-8 shadow-lg sm:p-12 md:flex-row md:items-center">
                            <div className="max-w-xl space-y-2">
                                <h2 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                                    የህልምዎን ዕቃ ለማሸነፍ ዝግጁ ነዎት?
                                </h2>
                                <p className="text-muted-foreground text-xs sm:text-sm">
                                    በ30 ሰከንድ ውስጥ አካውንት ይክፈቱ፣ የቦርሳ ሂሳብዎን ይሙሉ እና
                                    ዛሬ በሚወጡ የቀጥታ ዕጣዎች ላይ ይሳተፉ።
                                </p>
                            </div>

                            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                                {auth.user ? (
                                    <Button
                                        size="lg"
                                        asChild
                                        className="w-full gap-2 font-semibold sm:w-auto"
                                    >
                                        <Link href={appDashboard()}>
                                            የተጫዋች ዳሽቦርድ ክፈት
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <TelegramLoginButton className="w-full sm:w-auto" />
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                <nav className="bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg backdrop-blur-md sm:hidden">
                    <div className="grid grid-cols-5 items-center text-center text-[10px] font-medium">
                        <a
                            href="#"
                            className="text-primary flex flex-col items-center gap-1 py-1"
                        >
                            <Home className="size-4" />
                            <span>መነሻ</span>
                        </a>
                        <a
                            href="#raffles"
                            className="text-muted-foreground hover:text-foreground flex flex-col items-center gap-1 py-1"
                        >
                            <Flame className="size-4" />
                            <span>ዕጣዎች</span>
                        </a>
                        <Link
                            href={resultsRoute()}
                            className="text-muted-foreground hover:text-foreground flex flex-col items-center gap-1 py-1"
                        >
                            <Trophy className="size-4" />
                            <span>አሸናፊዎች</span>
                        </Link>
                        {auth.user ? (
                            <>
                                <Link
                                    href={walletRoute()}
                                    className="text-muted-foreground hover:text-foreground flex flex-col items-center gap-1 py-1"
                                >
                                    <Wallet className="size-4" />
                                    <span>ቦርሳ</span>
                                </Link>
                                <Link
                                    href={appDashboard()}
                                    className="text-muted-foreground hover:text-foreground flex flex-col items-center gap-1 py-1"
                                >
                                    <User className="size-4" />
                                    <span>መለያ</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={appDashboard()}
                                    className="text-muted-foreground hover:text-foreground flex flex-col items-center gap-1 py-1"
                                >
                                    <User className="size-4" />
                                    <span>ግባ</span>
                                </Link>
                                <Link
                                    href={appDashboard()}
                                    className="text-primary flex flex-col items-center gap-1 py-1 font-bold"
                                >
                                    <Zap className="size-4" />
                                    <span>ተቀላቀል</span>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                <footer className="border-border/60 bg-muted/20 border-t py-8 sm:py-12">
                    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                            <AppLogo />
                            <span className="text-muted-foreground text-xs">
                                &copy; {new Date().getFullYear()} የእቃ ሎተሪ። ሁሉም
                                ዕጣዎች ፍትሃዊነታቸው የተረጋገጠ እና በምስጠራ የታገዙ ናቸው።
                            </span>
                        </div>

                        <div className="text-muted-foreground flex items-center gap-5 text-xs font-medium">
                            <a
                                href="#raffles"
                                className="hover:text-foreground transition-colors"
                            >
                                ዕጣዎች
                            </a>
                            <Link
                                href={resultsRoute()}
                                className="hover:text-foreground transition-colors"
                            >
                                ውጤቶች
                            </Link>
                            <a
                                href="#fairness"
                                className="hover:text-foreground transition-colors"
                            >
                                ፍትሃዊነት
                            </a>
                            {auth.user ? (
                                <Link
                                    href={appDashboard()}
                                    className="hover:text-foreground transition-colors"
                                >
                                    ዳሽቦርድ
                                </Link>
                            ) : (
                                <Link
                                    href={appDashboard()}
                                    className="hover:text-foreground transition-colors"
                                >
                                    ግባ
                                </Link>
                            )}
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
