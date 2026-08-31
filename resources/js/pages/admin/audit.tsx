import { Head, Link } from '@inertiajs/react';
import { Activity, Search, Shield, Users } from 'lucide-react';
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
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { navigate } from '@/lib/navigate';
import { toDataTablePagination } from '@/lib/pagination';
import { audit } from '@/routes/admin';
import { show as showLottery } from '@/routes/admin/lotteries';
import { show as showUser } from '@/routes/admin/users';
import type { AdminActionRow, Paginated } from '@/types';

type AdminOption = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    actions: Paginated<AdminActionRow>;
    stats: {
        total_actions: number;
        actions_today: number;
        active_admins_count: number;
    };
    admins: AdminOption[];
    action_types: string[];
    filters: {
        search: string;
        action_type: string;
        admin_id: string;
        date_from: string;
        date_to: string;
    };
};

export default function AdminAuditIndex({
    actions: paginated,
    stats,
    admins,
    action_types,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [actionType, setActionType] = useState(filters.action_type || 'all');
    const [adminId, setAdminId] = useState(filters.admin_id || 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(audit.url(), {
            search: search || undefined,
            action_type: actionType !== 'all' ? actionType : undefined,
            admin_id: adminId !== 'all' ? adminId : undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        });
    };

    const handleActionTypeChange = (val: string) => {
        setActionType(val);
        navigate(audit.url(), {
            search: search || undefined,
            action_type: val !== 'all' ? val : undefined,
            admin_id: adminId !== 'all' ? adminId : undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        });
    };

    const handleAdminChange = (val: string) => {
        setAdminId(val);
        navigate(audit.url(), {
            search: search || undefined,
            action_type: actionType !== 'all' ? actionType : undefined,
            admin_id: val !== 'all' ? val : undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        });
    };

    const handleReset = () => {
        setSearch('');
        setActionType('all');
        setAdminId('all');
        setDateFrom('');
        setDateTo('');
        navigate(audit.url(), {});
    };

    const renderActionBadge = (type: string) => {
        if (
            type.startsWith('deposit.approved') ||
            type.startsWith('user.reactivated')
        ) {
            return (
                <Badge
                    variant="outline"
                    className="border-emerald-500/40 bg-emerald-500/10 font-mono text-[11px] text-emerald-600 dark:text-emerald-400"
                >
                    {type}
                </Badge>
            );
        }
        if (
            type.startsWith('deposit.rejected') ||
            type.startsWith('user.banned') ||
            type.startsWith('lottery.cancelled')
        ) {
            return (
                <Badge
                    variant="outline"
                    className="border-rose-500/40 bg-rose-500/10 font-mono text-[11px] text-rose-600 dark:text-rose-400"
                >
                    {type}
                </Badge>
            );
        }
        if (type.startsWith('user.suspended')) {
            return (
                <Badge
                    variant="outline"
                    className="border-amber-500/40 bg-amber-500/10 font-mono text-[11px] text-amber-600 dark:text-amber-400"
                >
                    {type}
                </Badge>
            );
        }
        return (
            <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary font-mono text-[11px]"
            >
                {type}
            </Badge>
        );
    };

    const renderSubjectLink = (row: AdminActionRow) => {
        if (row.subject_type === 'User') {
            return (
                <Link
                    href={showUser.url({ user: row.subject_id })}
                    className="text-foreground hover:text-primary inline-flex items-center gap-1 text-xs font-medium transition-colors"
                >
                    User #{row.subject_id}
                </Link>
            );
        }
        if (row.subject_type === 'Lottery') {
            return (
                <Link
                    href={showLottery.url({ lottery: row.subject_id })}
                    className="text-foreground hover:text-primary inline-flex items-center gap-1 text-xs font-medium transition-colors"
                >
                    Lottery #{row.subject_id}
                </Link>
            );
        }
        return (
            <span className="text-muted-foreground font-mono text-xs">
                {row.subject_type} #{row.subject_id}
            </span>
        );
    };

    const columns: DataTableColumn<AdminActionRow>[] = [
        {
            header: 'Timestamp',
            cell: (row) => (
                <div className="space-y-0.5 text-xs">
                    <div className="text-foreground font-medium">
                        {row.created_at_formatted}
                    </div>
                    <div className="text-muted-foreground text-[11px]">
                        {row.created_at_diff}
                    </div>
                </div>
            ),
        },
        {
            header: 'Admin Actor',
            cell: (row) => (
                <div className="space-y-0.5 text-xs">
                    <div className="text-foreground font-medium">
                        {row.admin_name}
                    </div>
                    <div className="text-muted-foreground text-[11px]">
                        {row.admin_email}
                    </div>
                </div>
            ),
        },
        {
            header: 'Action Type',
            cell: (row) => renderActionBadge(row.action_type),
        },
        {
            header: 'Target Subject',
            cell: (row) => renderSubjectLink(row),
        },
        {
            header: 'Audit Description',
            cell: (row) => (
                <p className="text-muted-foreground max-w-[340px] text-xs leading-relaxed">
                    {row.description}
                </p>
            ),
        },
    ];

    return (
        <>
            <Head title="Audit Trail" />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageHeader
                        title="Administrative Audit Trail"
                        description="Immutable compliance ledger tracking every administrative action, deposit review, moderation change, and manual adjustment."
                    />
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Total Audit Events"
                        value={stats.total_actions}
                        icon={Shield}
                    />
                    <StatCard
                        label="Actions Today"
                        value={stats.actions_today}
                        icon={Activity}
                    />
                    <StatCard
                        label="Active Administrators"
                        value={stats.active_admins_count}
                        icon={Users}
                    />
                </div>

                {/* Filters & Search */}
                <div className="bg-card space-y-4 rounded-xl border p-4 shadow-xs">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-col gap-3"
                    >
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Search text */}
                            <div className="relative lg:col-span-2">
                                <Search className="text-muted-foreground pointer-events-none absolute top-2.5 left-3 size-4" />
                                <Input
                                    placeholder="Search description, admin name or action..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {/* Action Type Select */}
                            <Select
                                value={actionType}
                                onValueChange={handleActionTypeChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Action Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Action Types
                                    </SelectItem>
                                    {action_types.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Admin Select */}
                            <Select
                                value={adminId}
                                onValueChange={handleAdminChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Admin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Administrators
                                    </SelectItem>
                                    {admins.map((adm) => (
                                        <SelectItem
                                            key={adm.id}
                                            value={adm.id.toString()}
                                        >
                                            {adm.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Filters & Submit */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                <span>From:</span>
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) =>
                                        setDateFrom(e.target.value)
                                    }
                                    className="h-8 w-36 text-xs"
                                />
                            </div>
                            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                <span>To:</span>
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="h-8 w-36 text-xs"
                                />
                            </div>

                            <Button type="submit" variant="secondary" size="sm">
                                Apply Filter
                            </Button>
                            {(search ||
                                actionType !== 'all' ||
                                adminId !== 'all' ||
                                dateFrom ||
                                dateTo) && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleReset}
                                >
                                    Reset Filters
                                </Button>
                            )}
                        </div>
                    </form>

                    <DataTable
                        columns={columns}
                        rows={paginated.data}
                        keyExtractor={(row) => row.id}
                        emptyIcon={Shield}
                        emptyTitle="No audit records found"
                        emptyDescription="No administrative actions match your current filter parameters."
                        pagination={toDataTablePagination(
                            paginated.pagination,
                            (page) =>
                                navigate(audit.url(), {
                                    search: search || undefined,
                                    action_type:
                                        actionType !== 'all'
                                            ? actionType
                                            : undefined,
                                    admin_id:
                                        adminId !== 'all' ? adminId : undefined,
                                    date_from: dateFrom || undefined,
                                    date_to: dateTo || undefined,
                                    page,
                                }),
                        )}
                    />
                </div>
            </div>
        </>
    );
}

AdminAuditIndex.layout = {
    breadcrumbs: [
        {
            title: 'Audit Trail',
            href: audit(),
        },
    ],
};
