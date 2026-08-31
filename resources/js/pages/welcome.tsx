import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Coins, Package, Trophy } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { dashboard as appDashboard } from '@/routes/app';
import { login, register } from '@/routes';

const steps = [
    {
        icon: Coins,
        step: '01',
        title: 'Deposit funds',
        description:
            'Top up your wallet securely and get your balance ready to play.',
    },
    {
        icon: Package,
        step: '02',
        title: 'Buy tickets',
        description:
            'Spend your balance buying tickets in item-based lotteries you love.',
    },
    {
        icon: Trophy,
        step: '03',
        title: 'Win your prize',
        description:
            'The draw picks a winner and the item ships straight to your door.',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-background text-foreground flex min-h-screen flex-col">
                <header className="border-sidebar-border/80 border-b">
                    <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
                        <AppLogo />
                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={appDashboard()}>
                                        Go to dashboard
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={register()}>
                                            Get started
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="flex-1">
                    <section className="mx-auto w-full max-w-6xl px-4 py-24">
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-primary mb-4 font-mono text-sm font-medium tracking-widest uppercase">
                                Item Lotteries
                            </p>
                            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                                Enter raffles for real items worth real money
                            </h1>
                            <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-lg">
                                Deposit into your wallet, buy tickets in item
                                lotteries, and walk away with the prize. Simple,
                                transparent, and fair draws every time.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                {auth.user ? (
                                    <Button size="lg" asChild>
                                        <Link href={appDashboard()}>
                                            Open your dashboard
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button size="lg" asChild>
                                            <Link href={register()}>
                                                Create an account
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link href={login()}>
                                                I already have an account
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="border-sidebar-border/80 bg-muted/40 border-t">
                        <div className="mx-auto w-full max-w-6xl px-4 py-20">
                            <div className="mb-12 text-center">
                                <h2 className="text-3xl font-semibold tracking-tight">
                                    How it works
                                </h2>
                                <p className="text-muted-foreground mx-auto mt-3 max-w-xl">
                                    Three simple steps between you and your next
                                    prize.
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
                                            className="bg-card flex flex-col gap-4 rounded-xl border p-6"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                                                    <Icon className="size-5" />
                                                </div>
                                                <span className="text-muted-foreground font-mono text-sm font-medium">
                                                    {step}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold tracking-tight">
                                                    {title}
                                                </h3>
                                                <p className="text-muted-foreground mt-2 text-sm">
                                                    {description}
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto w-full max-w-6xl px-4 py-20">
                        <div className="bg-card flex flex-col items-start justify-between gap-6 rounded-xl border p-8 md:flex-row md:items-center">
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    Ready to win big?
                                </h2>
                                <p className="text-muted-foreground mt-2">
                                    Join today and get started with your first
                                    lottery entry.
                                </p>
                            </div>
                            {auth.user ? (
                                <Button size="lg" asChild>
                                    <Link href={appDashboard()}>
                                        Open your dashboard
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button size="lg" asChild>
                                    <Link href={register()}>
                                        Create a free account
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </section>
                </main>

                <footer className="border-sidebar-border/80 border-t">
                    <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
                        <p className="text-muted-foreground text-sm">
                            © {new Date().getFullYear()} Item Lottery
                        </p>
                        <p className="text-muted-foreground font-mono text-sm">
                            Fair draws. Real prizes.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
