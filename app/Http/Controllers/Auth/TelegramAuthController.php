<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\TelegramService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TelegramAuthController extends Controller
{
    public function __construct(
        protected TelegramService $telegram,
    ) {}

    /**
     * Authenticate (or create) a user from a verified Telegram initData payload.
     */
    public function authenticate(Request $request): JsonResponse
    {
        $payload = $request->attributes->get('telegram');
        $tgUser = $payload['user'];

        $user = User::query()->where('telegram_id', $tgUser['id'])->first();

        if ($user === null) {
            $user = new User;
            $user->telegram_id = (int) $tgUser['id'];
            $user->status = User::STATUS_ACTIVE;
            $user->role = User::ROLE_USER;
        }

        $user->name = trim(($tgUser['first_name'] ?? '').' '.($tgUser['last_name'] ?? ''));
        $user->telegram_username = $tgUser['username'] ?? $user->telegram_username;
        $user->telegram_avatar = $tgUser['photo_url'] ?? $user->telegram_avatar;

        if ($user->role !== User::ROLE_ADMIN) {
            $user->role = $this->isAdminTelegramId((int) $tgUser['id'])
                ? User::ROLE_ADMIN
                : User::ROLE_USER;
        }

        $user->save();

        if (! $user->isActive()) {
            $message = $user->status === User::STATUS_BANNED
                ? 'This account has been banned.'
                : 'This account has been suspended.';

            Auth::logout();

            return response()->json(['error' => $message], 403);
        }

        Auth::login($user, true);

        return response()->json([
            'user' => $user,
            'is_admin' => $user->isAdmin(),
            'needs_phone' => $user->phone === null,
        ]);
    }

    /**
     * Persist a phone number shared by the user via Telegram's contact button.
     */
    public function storePhone(Request $request): JsonResponse
    {
        $rawContact = (string) $request->input('contact');

        if ($rawContact === '') {
            return response()->json(['error' => 'Missing contact data.'], 422);
        }

        try {
            $contact = $this->telegram->validateContact($rawContact);
        } catch (\InvalidArgumentException) {
            return response()->json(['error' => 'Invalid contact data.'], 422);
        }

        $user = $request->user();

        if ((int) $contact['user_id'] !== (int) $user->telegram_id) {
            return response()->json(['error' => 'Contact does not match the authenticated user.'], 422);
        }

        $user->phone = $contact['phone_number'];
        $user->save();

        return response()->json(['phone' => $user->phone]);
    }

    /**
     * Log the user out of the application session.
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['success' => true]);
    }

    /**
     * Determine whether a Telegram ID is allowed as an admin.
     */
    private function isAdminTelegramId(int $telegramId): bool
    {
        return in_array((string) $telegramId, config('telegram.admin_ids', []), true);
    }
}
