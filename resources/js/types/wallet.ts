export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type Paginated<T> = {
    data: T[];
    pagination: PaginationMeta;
};

export type DepositRow = {
    id: number;
    amount: string;
    amount_formatted: string;
    status: string;
    status_label: string;
    receipt_url: string | null;
    rejection_reason: string | null;
    created_at: string | null;
    created_at_formatted: string | null;
    created_at_diff: string | null;
    user?: {
        id: number;
        name: string;
        email: string;
    };
};

export type TransactionRow = {
    id: number;
    type: string;
    type_label: string;
    is_credit: boolean;
    amount: string;
    amount_formatted: string;
    balance_after: string;
    balance_after_formatted: string;
    description: string | null;
    created_at: string | null;
    created_at_formatted: string | null;
    created_at_diff: string | null;
};
