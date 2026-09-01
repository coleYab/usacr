import { Link, usePage } from '@inertiajs/react';
import {
    Flame,
    Home,
    LayoutGrid,
    Ticket,
    Trophy,
    User,
    Wallet,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { AppContent } from '@/components/app-content';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { NotificationBell } from '@/components/notification-bell';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard, lotteries, results, tickets, wallet } from '@/routes/app';
import { edit as profileEdit } from '@/routes/profile';
import type { AppLayoutProps, NavItem } from '@/types';

type Props = AppLayoutProps & {
    walletBalance?: string;
};

const mainNavItems: NavItem[] = [
    { title: 'ዳሽቦርድ', href: dashboard(), icon: LayoutGrid },
    { title: 'ዕጣዎች', href: lotteries(), icon: Flame },
    { title: 'የእኔ ቲኬቶች', href: tickets(), icon: Ticket },
    { title: 'ውጤቶች', href: results(), icon: Trophy },
    { title: 'ቦርሳ', href: wallet(), icon: Wallet },
];

const mobileBottomNavItems = [
    {
        title: 'መነሻ',
        href: dashboard(),
        icon: Home,
        isActive: (url: string) =>
            url === '/app' ||
            url === '/app/dashboard' ||
            url.startsWith('/app/dashboard'),
    },
    {
        title: 'ዕጣዎች',
        href: lotteries(),
        icon: Flame,
        isActive: (url: string) => url.startsWith('/app/lotteries'),
    },
    {
        title: 'አሸናፊዎች',
        href: results(),
        icon: Trophy,
        isActive: (url: string) => url.startsWith('/app/results'),
    },
    {
        title: 'ቦርሳ',
        href: wallet(),
        icon: Wallet,
        isActive: (url: string) => url.startsWith('/app/wallet'),
    },
    {
        title: 'መለያ',
        href: profileEdit(),
        icon: User,
        isActive: (url: string) => url.startsWith('/settings'),
    },
];

export default function AppTopnavLayout({
    children,
    breadcrumbs = [],
    walletBalance,
}: Props) {
    const page = usePage();
    const { auth } = page.props;
    const sharedWalletBalance = page.props.walletBalance as string | undefined;
    const effectiveBalance = walletBalance ?? sharedWalletBalance ?? '$0.00';
    const getInitials = useInitials();
    const { whenCurrentUrl } = useCurrentUrl();

    const navLinkClasses = (
        href: NonNullable<React.ComponentProps<typeof Link>['href']>,
    ) =>
        cn(
            'text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors',
            whenCurrentUrl(href, 'bg-accent text-accent-foreground'),
        );

    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="border-sidebar-border/80 bg-background/90 sticky top-0 z-30 border-b backdrop-blur-md">
                <div className="mx-auto flex h-16 items-center gap-4 px-4 md:max-w-7xl">
                    <Link
                        href={dashboard()}
                        prefetch
                        className="flex items-center gap-2"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop navigation */}
                    <nav className="ml-2 hidden items-center gap-1 lg:flex">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={navLinkClasses(item.href)}
                            >
                                {item.icon && <item.icon className="size-4" />}
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-2">
                        <div className="border-input bg-muted/50 flex items-center gap-2 rounded-full border py-1.5 pr-3 pl-1.5">
                            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full">
                                <Wallet className="size-3.5" />
                            </div>
                            <span className="font-mono text-sm font-semibold tabular-nums">
                                {effectiveBalance}
                            </span>
                        </div>
                        <NotificationBell />
                        <ThemeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-1"
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage
                                            src={auth.user?.avatar}
                                            alt={auth.user?.name}
                                        />
                                        <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground rounded-lg">
                                            {getInitials(auth.user?.name ?? '')}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                {auth.user && (
                                    <UserMenuContent user={auth.user} />
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {breadcrumbs.length > 1 && (
                <div className="border-sidebar-border/70 flex w-full border-b">
                    <div className="text-muted-foreground mx-auto flex h-12 w-full items-center justify-start px-4 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}

            <AppContent variant="header" className="px-4 pt-6 pb-24 lg:pb-6">
                {children}
            </AppContent>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="bg-background/95 border-border fixed inset-x-0 bottom-0 z-40 border-t px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg backdrop-blur-md lg:hidden">
                <div className="grid grid-cols-5 items-center text-center text-[10px] font-medium">
                    {mobileBottomNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = item.isActive(page.url);

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center gap-1 py-1 transition-colors',
                                    active
                                        ? 'text-primary font-semibold'
                                        : 'text-muted-foreground hover:text-foreground font-medium',
                                )}
                            >
                                <Icon className="size-5" />
                                <span className="text-[11px] leading-tight">
                                    {item.title}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
