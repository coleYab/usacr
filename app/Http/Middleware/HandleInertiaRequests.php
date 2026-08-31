<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'walletBalance' => $user?->wallet ? money($user->wallet->balance) : money(0),
            'notifications' => $user ? [
                'unreadCount' => $user->unreadNotifications()->count(),
                'recent' => $user->notifications()->take(10)->get()->map(fn ($n) => [
                    'id' => $n->id,
                    'data' => $n->data,
                    'read_at' => $n->read_at?->toISOString(),
                    'created_at' => $n->created_at?->toISOString(),
                    'created_at_diff' => $n->created_at?->diffForHumans(),
                ]),
            ] : null,
            'flash' => [
                'toast' => $this->buildToast($request),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    /**
     * Map a one-time flash message into a sonner toast payload.
     *
     * @return array{type: string, message: string}|null
     */
    private function buildToast(Request $request): ?array
    {
        foreach (['success', 'error', 'warning', 'info'] as $type) {
            if ($request->session()->get($type)) {
                return [
                    'type' => $type,
                    'message' => $request->session()->get($type),
                ];
            }
        }

        return null;
    }
}
