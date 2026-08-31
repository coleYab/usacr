export type LotteryStatus = 'draft' | 'active' | 'completed' | 'cancelled';
export type TicketStatus = 'active' | 'won' | 'lost' | 'refunded';

export type LotteryRow = {
    id: number;
    title: string;
    description: string;
    media: string[];
    ticket_price: string;
    ticket_price_formatted: string;
    total_tickets: number;
    tickets_sold: number;
    remaining_tickets: number;
    progress_percentage: number;
    is_sold_out: boolean;
    is_open: boolean;
    draw_at: string;
    draw_at_formatted: string;
    draw_at_diff: string;
    status: LotteryStatus;
    status_label: string;
    participant_count: number;
    winning_ticket_id?: number | null;
    winning_ticket_code?: string | null;
    winner_name?: string | null;
    verification_hash?: string | null;
    verification_seed?: string | null;
    created_at: string | null;
    created_at_formatted: string | null;
};

export type TicketRow = {
    id: number;
    lottery_id: number;
    ticket_code: string;
    price_paid: string;
    price_paid_formatted: string;
    status: TicketStatus;
    status_label: string;
    is_won: boolean;
    created_at: string | null;
    created_at_formatted: string | null;
    created_at_diff: string | null;
    lottery?: LotteryRow;
    user?: {
        id: number;
        name: string;
        email: string;
    };
};

export type LotteryParticipant = {
    id: number | null;
    name: string;
    email: string;
    ticket_count: number;
    total_spent: string;
    total_spent_formatted: string;
};

export type InAppNotification = {
    id: string;
    data: {
        type?: string;
        lottery_id?: number;
        lottery_title?: string;
        is_winner?: boolean;
        winning_ticket_code?: string;
        deposit_id?: number;
        status?: string;
        amount?: string;
        message: string;
        url?: string;
        icon?: string;
    };
    read_at: string | null;
    created_at: string;
    created_at_diff: string;
};

export type DrawLogRow = {
    id: number;
    lottery_id: number;
    lottery_title: string;
    lottery_thumbnail?: string | null;
    winning_ticket_code: string;
    winner_name: string;
    winner_email: string;
    total_participants: number;
    total_tickets: number;
    verification_seed: string;
    verification_hash: string;
    processed_at: string;
    processed_at_formatted: string;
    processed_at_diff: string;
};

export type CompletedLotteryRow = LotteryRow & {
    winning_ticket_code?: string;
    winner_name?: string;
    verification_hash?: string;
    verification_seed?: string;
};
