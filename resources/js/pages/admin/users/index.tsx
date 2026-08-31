import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    Eye,
    Search,
    ShieldAlert,
    SlidersHorizontal,
    UserCheck,
    Users,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AdjustWalletDialog } from '@/components/adjust-wallet-dialog';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { ModerateUserDialog } from '@/components/moderate-user-dialog';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { UserStatusBadge } from '@/components/user-status-badge';
import { navigate } from '@/lib/navigate';
import { toDataTablePagination } from '@/lib/pagination';
import { users } from '@/routes/admin';
import { show as showUser } from '@/routes/admin/users';
import type { AdminUserRow, Paginated } from '@/types';

type Props = {
    users: Paginated<AdminUserRow>;
    stats: {
        total_users: number;
        active_users: number;
        suspended_users: number;
        banned_users: number;
    };
    filters: {
        search: string;
        role: string;
        status: string;
    };
};

export default function AdminUsersIndex({
    users: paginated,
    stats,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || 'all');
    const [status, setStatus] = useState(filters.status || 'all');

    // Dialog states
    const [moderatingUser, setModeratingUser] = useState<AdminUserRow | null>(
        null,
    );
    const [adjustingUser, setAdjustingUser] = useState<AdminUserRow | null>(
        null,
    );

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(users.url(), {
            search: search || undefined,
            role: role !== 'all' ? role : undefined,
            status: status !== 'all' ? status : undefined,
        });
    };

    const handleRoleChange = (newRole: string) => {
        setRole(newRole);
        navigate(users.url(), {
            search: search || undefined,
            role: newRole !== 'all' ? newRole : undefined,
            status: status !== 'all' ? status : undefined,
        });
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        navigate(users.url(), {
            search: search || undefined,
            role: role !== 'all' ? role : undefined,
            status: newStatus !== 'all' ? newStatus : undefined,
        });
    };

    const handleReset = () => {
        setSearch('');
        setRole('all');
        setStatus('all');
        navigate(users.url(), {});
    };

    const columns: DataTableColumn<AdminUserRow>[] = [
        {
            header: 'User Account',
            cell: (row) => (
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <Link
                            href={showUser.url({ user: row.id })}
                            className="text-foreground hover:text-primary font-medium transition-colors"
                        >
                            {row.name}
                        </Link>
                        {row.role === 'admin' && (
                            <Badge
                                variant="secondary"
                                className="px-1.5 py-0 text-[10px]"
                            >
                                Admin
                            </Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground text-xs">{row.email}</p>
                </div>
            ),
        },
        {
            header: 'Status',
            cell: (row) => <UserStatusBadge status={row.status} />,
        },
        {
            header: 'Wallet Balance',
            cell: (row) => (
                <div className="text-foreground font-mono text-xs font-semibold">
                    {row.balance_formatted}
                </div>
            ),
        },
        {
            header: 'Lifetime Deposits',
            cell: (row) => (
                <div className="space-y-0.5 text-xs">
                    <span className="text-muted-foreground font-mono">
                        {row.lifetime_deposits_formatted}
                    </span>
                </div>
            ),
        },
        {
            header: 'Activity',
            cell: (row) => (
                <div className="text-muted-foreground space-y-0.5 text-xs">
                    <div>{row.tickets_count} tickets bought</div>
                    {row.lotteries_won_count > 0 && (
                        <div className="font-medium text-amber-600 dark:text-amber-400">
                            {row.lotteries_won_count} lotteries won
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: 'Joined',
            cell: (row) => (
                <div className="space-y-0.5 text-xs">
                    <div className="text-foreground">
                        {row.created_at_formatted}
                    </div>
                    <div className="text-muted-foreground text-[11px]">
                        {row.created_at_diff}
                    </div>
                </div>
            ),
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1.5">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={showUser.url({ user: row.id })}>
                            <Eye className="mr-1 size-3.5" />
                            Details
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAdjustingUser(row)}
                        title="Manual Wallet Adjustment"
                    >
                        <Wallet className="text-primary mr-1 size-3.5" />
                        Adjust
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setModeratingUser(row)}
                        title="Moderate Status"
                    >
                        <SlidersHorizontal className="size-3.5" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="User Directory" />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageHeader
                        title="User Directory"
                        description="Manage registered user accounts, moderate account statuses, and adjust wallet balances."
                    />
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Total Registered Users"
                        value={stats.total_users}
                        icon={Users}
                    />
                    <StatCard
                        label="Active Accounts"
                        value={stats.active_users}
                        icon={UserCheck}
                    />
                    <StatCard
                        label="Suspended Accounts"
                        value={stats.suspended_users}
                        icon={CheckCircle2}
                    />
                    <StatCard
                        label="Banned Accounts"
                        value={stats.banned_users}
                        icon={ShieldAlert}
                    />
                </div>

                {/* Search & Filters */}
                <div className="bg-card space-y-4 rounded-xl border p-4 shadow-xs">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                        <div className="relative flex-1">
                            <Search className="text-muted-foreground pointer-events-none absolute top-2.5 left-3 size-4" />
                            <Input
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Select
                                value={role}
                                onValueChange={handleRoleChange}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Roles
                                    </SelectItem>
                                    <SelectItem value="user">Users</SelectItem>
                                    <SelectItem value="admin">
                                        Admins
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={status}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="suspended">
                                        Suspended
                                    </SelectItem>
                                    <SelectItem value="banned">
                                        Banned
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button type="submit" variant="secondary" size="sm">
                                Search
                            </Button>
                            {(search || role !== 'all' || status !== 'all') && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </form>

                    <DataTable
                        columns={columns}
                        rows={paginated.data}
                        keyExtractor={(row) => row.id}
                        emptyIcon={Users}
                        emptyTitle="No users found"
                        emptyDescription="No registered users matched the applied filters."
                        pagination={toDataTablePagination(
                            paginated.pagination,
                            (page) =>
                                navigate(users.url(), {
                                    search: search || undefined,
                                    role: role !== 'all' ? role : undefined,
                                    status:
                                        status !== 'all' ? status : undefined,
                                    page,
                                }),
                        )}
                    />
                </div>
            </div>

            {/* Moderation Dialog */}
            <ModerateUserDialog
                user={moderatingUser}
                open={Boolean(moderatingUser)}
                onOpenChange={(open) => !open && setModeratingUser(null)}
            />

            {/* Wallet Adjustment Dialog */}
            <AdjustWalletDialog
                user={adjustingUser}
                open={Boolean(adjustingUser)}
                onOpenChange={(open) => !open && setAdjustingUser(null)}
            />
        </>
    );
}

AdminUsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: users(),
        },
    ],
};
