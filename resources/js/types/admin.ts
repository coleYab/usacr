export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'banned';

export type AdminUserRow = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    balance: string;
    balance_formatted: string;
    lifetime_deposits: string;
    lifetime_deposits_formatted: string;
    tickets_count: number;
    lotteries_won_count: number;
    created_at: string | null;
    created_at_formatted: string | null;
    created_at_diff: string | null;
};

export type AdminUserDetail = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    balance: string;
    balance_formatted: string;
    lifetime_deposits: string;
    lifetime_deposits_formatted: string;
    total_spent: string;
    total_spent_formatted: string;
    tickets_count: number;
    active_tickets_count: number;
    lotteries_won_count: number;
    created_at: string | null;
    created_at_formatted: string | null;
    created_at_diff: string | null;
};

export type AdminActionRow = {
    id: number;
    admin_id: number;
    admin_name: string;
    admin_email: string;
    action_type: string;
    subject_type: string;
    subject_id: number;
    description: string | null;
    created_at: string | null;
    created_at_formatted: string | null;
    created_at_diff: string | null;
};
