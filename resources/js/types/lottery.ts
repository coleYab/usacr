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
