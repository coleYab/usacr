import { router } from '@inertiajs/react';

/**
 * Perform an Inertia GET visit with query params, dropping empty values and
 * preserving page state and scroll position (used for tabs + pagination).
 */
export function navigate(
    url: string,
    params: Record<string, string | number | undefined>,
) {
    const filtered = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
    );

    router.get(url, filtered, { preserveState: true, preserveScroll: true });
}
