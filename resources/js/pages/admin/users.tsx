import { Head } from '@inertiajs/react';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { PageHeader } from '@/components/page-header';
import { dashboard, users } from '@/routes/admin';

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
    status: 'active' | 'suspended' | 'banned';
};

const userRows: UserRow[] = [];

const columns: DataTableColumn<UserRow>[] = [
    {
        header: 'User',
        cell: (user) => (
            <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-muted-foreground text-sm">
                    {user.email}
                </span>
            </div>
        ),
    },
    {
        header: 'Role',
        cell: (user) => <span className="capitalize">{user.role}</span>,
    },
    {
        header: 'Status',
        cell: (user) => <span className="capitalize">{user.status}</span>,
    },
];

export default function AdminUsers() {
    return (
        <>
            <Head title="Users" />
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Users"
                    description="Manage user accounts and access."
                />
                <DataTable
                    columns={columns}
                    rows={userRows}
                    keyExtractor={(user) => user.id}
                    emptyTitle="No users yet"
                    emptyDescription="Registered users will appear here."
                />
            </div>
        </>
    );
}

AdminUsers.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: dashboard(),
        },
        {
            title: 'Users',
            href: users(),
        },
    ],
};
