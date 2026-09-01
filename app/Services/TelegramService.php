<?php

namespace App\Services;

use Illuminate\Support\Carbon;
use InvalidArgumentException;

/**
 * Validates Telegram Mini App initData and share-contact responses.
 *
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
class TelegramService
{
    /**
     * Validate raw initData and return the parsed payload.
     *
     * @return array{user: array<string, mixed>, auth_date: int, raw: string}
     *
     * @throws InvalidArgumentException when the data is invalid or stale.
     */
    public function validateInitData(string $initData): array
    {
        $data = $this->parse($initData);

        $hash = $data['hash'] ?? null;
        unset($data['hash']);

        if ($hash === null || $this->computeHash($data) !== $hash) {
            throw new InvalidArgumentException('Invalid Telegram initData signature.');
        }

        $authDate = (int) ($data['auth_date'] ?? 0);

        if ($this->isStale($authDate)) {
            throw new InvalidArgumentException('Telegram initData is stale.');
        }

        $user = isset($data['user']) ? json_decode((string) $data['user'], true) : [];

        if (! is_array($user) || ! isset($user['id'])) {
            throw new InvalidArgumentException('Telegram initData is missing a user.');
        }

        return [
            'user' => $user,
            'auth_date' => $authDate,
            'raw' => $initData,
        ];
    }

    /**
     * Validate the raw share-contact response and return its contact payload.
     *
     * @return array{user_id: int, phone_number: string, first_name?: string, last_name?: string, raw: string}
     *
     * @throws InvalidArgumentException when the contact data is invalid.
     */
    public function validateContact(string $rawContact): array
    {
        $data = $this->parse($rawContact);

        $hash = $data['hash'] ?? null;
        unset($data['hash']);

        if ($hash === null || $this->computeHash($data) !== $hash) {
            throw new InvalidArgumentException('Invalid Telegram contact signature.');
        }

        $authDate = (int) ($data['auth_date'] ?? 0);

        if ($this->isStale($authDate)) {
            throw new InvalidArgumentException('Telegram contact data is stale.');
        }

        $contact = isset($data['contact']) ? json_decode((string) $data['contact'], true) : [];

        if (! is_array($contact) || ! isset($contact['user_id'], $contact['phone_number'])) {
            throw new InvalidArgumentException('Telegram contact data is missing fields.');
        }

        return [
            'user_id' => (int) $contact['user_id'],
            'phone_number' => (string) $contact['phone_number'],
            'first_name' => $contact['first_name'] ?? null,
            'last_name' => $contact['last_name'] ?? null,
            'raw' => $rawContact,
        ];
    }

    /**
     * Parse a raw query-string payload into its key/value map.
     *
     * The data string is flat (no nested-array syntax), so every value is
     * coerced to a string.
     *
     * @return array<string, string>
     */
    private function parse(string $raw): array
    {
        $parsed = [];
        parse_str($raw, $parsed);

        $data = [];

        foreach ($parsed as $key => $value) {
            $data[(string) $key] = is_scalar($value) ? (string) $value : '';
        }

        return $data;
    }

    /**
     * Compute the expected HMAC hash for a sorted key/value set.
     *
     * @param  array<string, string>  $data
     */
    private function computeHash(array $data): string
    {
        ksort($data);

        $dataCheckString = collect($data)
            ->map(static fn ($value, $key): string => $key.'='.$value)
            ->implode("\n");

        $secretKey = hash_hmac('sha256', config('telegram.bot_token'), 'WebAppData', true);

        return hash_hmac('sha256', $dataCheckString, $secretKey);
    }

    /**
     * Determine whether an auth timestamp is older than the allowed lifetime.
     */
    private function isStale(int $authDate): bool
    {
        $lifetime = max(1, (int) config('telegram.auth_date_lifetime'));

        return $authDate === 0 || Carbon::now()->subSeconds($lifetime)->getTimestamp() > $authDate;
    }
}
