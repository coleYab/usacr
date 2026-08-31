import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';
import { EmptyState } from '@/components/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export type DataTableColumn<T> = {
    header: ReactNode;
    cell: (row: T) => ReactNode;
    className?: string;
    headerClassName?: string;
};

type PaginationInfo = {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    onPageChange: (page: number) => void;
};

type DataTableProps<T> = {
    columns: DataTableColumn<T>[];
    rows: T[];
    keyExtractor: (row: T) => string | number;
    isLoading?: boolean;
    loadingRows?: number;
    emptyIcon?: LucideIcon;
    emptyTitle?: string;
    emptyDescription?: string;
    pagination?: PaginationInfo;
};

export function DataTable<T>({
    columns,
    rows,
    keyExtractor,
    isLoading = false,
    loadingRows = 5,
    emptyIcon = Inbox,
    emptyTitle = 'Nothing here yet',
    emptyDescription,
    pagination,
}: DataTableProps<T>) {
    const renderSkeletonRows = () =>
        Array.from({ length: loadingRows }).map((_, rowIndex) => (
            <TableRow key={`skeleton-${rowIndex}`}>
                {columns.map((_, colIndex) => (
                    <TableCell key={`skeleton-${rowIndex}-${colIndex}`}>
                        <Skeleton className="h-4 w-full" />
                    </TableCell>
                ))}
            </TableRow>
        ));

    const renderPageNumbers = () => {
        if (!pagination) {
            return null;
        }

        const { currentPage, lastPage, onPageChange, total, perPage } =
            pagination;

        const start = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
        const end = Math.min(currentPage * perPage, total);

        return (
            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground">
                    Showing{' '}
                    <span className="text-foreground font-medium">{start}</span>
                    {' - '}
                    <span className="text-foreground font-medium">
                        {end}
                    </span>{' '}
                    of{' '}
                    <span className="text-foreground font-medium">{total}</span>{' '}
                    results
                </p>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="border-input hover:bg-accent hover:text-accent-foreground rounded-md border px-3 py-1.5 text-sm disabled:pointer-events-none disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {Array.from({ length: lastPage }).map((_, index) => {
                        const page = index + 1;

                        return (
                            <button
                                key={page}
                                type="button"
                                onClick={() => onPageChange(page)}
                                className={
                                    page === currentPage
                                        ? 'bg-primary text-primary-foreground size-9 rounded-md text-sm'
                                        : 'hover:bg-accent hover:text-accent-foreground border-input size-9 rounded-md border text-sm'
                                }
                            >
                                {page}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        disabled={currentPage === lastPage}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="border-input hover:bg-accent hover:text-accent-foreground rounded-md border px-3 py-1.5 text-sm disabled:pointer-events-none disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="overflow-hidden rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        {columns.map((column, index) => (
                            <TableHead
                                key={`header-${index}`}
                                className={column.headerClassName}
                            >
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading
                        ? renderSkeletonRows()
                        : rows.length === 0
                          ? null
                          : rows.map((row) => (
                                <TableRow key={keyExtractor(row)}>
                                    {columns.map((column, index) => (
                                        <TableCell
                                            key={`${keyExtractor(row)}-${index}`}
                                            className={column.className}
                                        >
                                            {column.cell(row)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                </TableBody>
            </Table>
            {!isLoading && rows.length === 0 && (
                <div className="border-t p-6">
                    <EmptyState
                        icon={emptyIcon}
                        title={emptyTitle}
                        description={emptyDescription}
                    />
                </div>
            )}
            {pagination && (isLoading ? null : rows.length > 0) && (
                <div className="border-t px-4 py-3">{renderPageNumbers()}</div>
            )}
        </div>
    );
}
