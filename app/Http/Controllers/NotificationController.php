<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Mark a single notification as read.
     */
    public function markAsRead(string $id, Request $request): RedirectResponse
    {
        $user = $request->user();
        $user->notifications()->where('id', $id)->first()?->markAsRead();

        return back();
    }

    /**
     * Mark all notifications as read for the authenticated user.
     */
    public function markAllAsRead(Request $request): RedirectResponse
    {
        $user = $request->user();
        $user->unreadNotifications->markAsRead();

        return back();
    }
}
