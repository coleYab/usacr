<?php

use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Format money consistently across the app (currency symbol, 2 decimals,
 * thousands separators).
 */
function money(string|int|float $amount): string
{
    return '$'.number_format((float) $amount, 2, '.', ',');
}

/**
 * Wrap a paginator into a { data, pagination } shape for the frontend.
 *
 * @template T
 *
 * @param  LengthAwarePaginator<array-key, T>  $paginator
 * @param  callable(array<array-key, T>): array<int, mixed>  $map
 * @return array{data: array<int, mixed>, pagination: array{current_page: int, last_page: int, per_page: int, total: int}}
 */
function present_paginator(LengthAwarePaginator $paginator, callable $map): array
{
    return [
        'data' => $map($paginator->items()),
        'pagination' => [
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
        ],
    ];
}
