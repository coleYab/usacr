import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Menu, Ticket, Wallet, Sparkles } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { AppContent } from '@/components/app-content';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard, lotteries, tickets, wallet } from '@/routes/app';
import type { AppLayoutProps, NavItem } from '@/types';

type Props = AppLayoutProps & {
    walletBalance?: string;
};

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Lotteries', href: lotteries(), icon: Sparkles },
    { title: 'My Tickets', href: tickets(), icon: Ticket },
    { title: 'Wallet', href: wallet(), icon: Wallet },
];

export default function AppTopnavLayout({
    children,
    breadcrumbs = [],
    walletBalance = '$0.00',
}: Props) {
    const { auth } = usePage().props;
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
            <header className="border-sidebar-border/80 border-b">
                <div className="mx-auto flex h-16 items-center gap-4 px-4 md:max-w-7xl">
                    {/* Mobile menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mr-1 size-9"
                                >
                                    <Menu className="size-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-64 flex-col gap-4"
                            >
                                <SheetHeader className="flex justify-start text-left">
                                    <SheetTitle className="sr-only">
                                        Navigation menu
                                    </SheetTitle>
                                    <Link href={dashboard()}>
                                        <AppLogo />
                                    </Link>
                                </SheetHeader>
                                <nav className="flex flex-col gap-1 text-sm">
                                    {mainNavItems.map((item) => (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-2 rounded-md px-3 py-2 font-medium',
                                                whenCurrentUrl(
                                                    item.href,
                                                    'bg-accent text-accent-foreground',
                                                    'text-muted-foreground',
                                                ),
                                            )}
                                        >
                                            {item.icon && (
                                                <item.icon className="size-5" />
                                            )}
                                            {item.title}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

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
                                {walletBalance}
                            </span>
                        </div>
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
            <AppContent variant="header" className="px-4 py-6">
                {children}
            </AppContent>
        </div>
    );
}
