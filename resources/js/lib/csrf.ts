function readCookie(name: string): string | undefined {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));

    return match ? decodeURIComponent(match[1]) : undefined;
}

export function csrfToken(): string {
    const metaToken =
        typeof document !== 'undefined'
            ? document
                  .querySelector('meta[name="csrf-token"]')
                  ?.getAttribute('content')
            : null;

    return metaToken || readCookie('XSRF-TOKEN') || '';
}

export function csrfHeaders(
    extra?: Record<string, string | undefined>,
): Record<string, string> {
    const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken(),
        'X-Requested-With': 'XMLHttpRequest',
    };

    if (extra) {
        for (const [key, val] of Object.entries(extra)) {
            if (val !== undefined) {
                headers[key] = val;
            }
        }
    }

    return headers;
}
