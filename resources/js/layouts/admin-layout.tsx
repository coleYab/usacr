import { Link } from '@inertiajs/react';
import {
    Clock,
    History,
    LayoutDashboard,
    ListChecks,
    Sparkles,
    Users,
    Wallet,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { NavUser } from '@/components/nav-user';
import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { dashboard as appDashboard } from '@/routes/app';
import {
    audit,
    dashboard,
    deposits,
    draws,
    lotteries,
    users,
} from '@/routes/admin';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { AppLayoutProps, NavItem } from '@/types';

type GroupedNav = {
    label: string;
    items: NavItem[];
};

const navGroups: GroupedNav[] = [
    {
        label: 'Overview',
        items: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutDashboard },
        ],
    },
    {
        label: 'Management',
        items: [
            { title: 'Deposits', href: deposits(), icon: Wallet },
            { title: 'Lotteries', href: lotteries(), icon: Sparkles },
            { title: 'Draws', href: draws(), icon: Clock },
            { title: 'Users', href: users(), icon: Users },
        ],
    },
    {
        label: 'Audit & System',
        items: [{ title: 'Audit Log', href: audit(), icon: History }],
    },
];

function AdminNavGroups() {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarContent>
            {navGroups.map((group) => (
                <SidebarGroup key={group.label}>
                    <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isCurrentUrl(item.href)}
                                        tooltip={{
                                            children: item.title,
                                        }}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            ))}
            <SidebarGroup>
                <SidebarGroupLabel>Store</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={false}
                                tooltip={{ children: 'View store' }}
                            >
                                <Link href={appDashboard()}>
                                    <ListChecks />
                                    <span>View store</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    );
}

export default function AdminLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <SidebarProvider>
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={dashboard()} prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarSeparator />
                <AdminNavGroups />
                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6">
                    <div className="flex flex-1 items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                    <ThemeToggle />
                </header>
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
