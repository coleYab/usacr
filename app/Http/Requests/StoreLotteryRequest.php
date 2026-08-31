<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLotteryRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:10', 'max:5000'],
            'ticket_price' => ['required', 'numeric', 'min:0.50', 'max:100000'],
            'total_tickets' => ['required', 'integer', 'min:2', 'max:1000000'],
            'draw_at' => ['required', 'date', 'after:now'],
            'status' => ['required', 'in:draft,active'],
            'images' => ['nullable', 'array', 'max:6'],
            'images.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
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
            'draw_at.after' => 'The draw date and time must be in the future.',
            'images.max' => 'You can upload at most 6 images.',
            'images.*.max' => 'Each image must be 5MB or smaller.',
            'images.*.mimes' => 'Images must be in JPG, PNG, or WebP format.',
        ];
    }
}
