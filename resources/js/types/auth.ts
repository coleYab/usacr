export type User = {
    id: number;
    name: string;
    email: string | null;
    avatar?: string;
    email_verified_at: string | null;
    role: 'user' | 'admin';
    status: 'active' | 'suspended' | 'banned';
    telegram_id: number | null;
    telegram_username: string | null;
    telegram_avatar: string | null;
    phone: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};
