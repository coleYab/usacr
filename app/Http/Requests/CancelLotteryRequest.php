<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CancelLotteryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'min:10', 'max:1000'],
        ];
    }

    /**
     * Get custom error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'reason.required' => 'A cancellation reason is required.',
            'reason.min' => 'The cancellation reason must be at least 10 characters.',
        ];
    }
}
