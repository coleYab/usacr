import type { PaginationMeta } from '@/types/wallet';

export type DataTablePagination = {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    onPageChange: (page: number) => void;
};

export function toDataTablePagination(
    { current_page, last_page, per_page, total }: PaginationMeta,
    onPageChange: (page: number) => void,
): DataTablePagination {
    return {
        currentPage: current_page,
        lastPage: last_page,
        perPage: per_page,
        total,
        onPageChange,
    };
}
