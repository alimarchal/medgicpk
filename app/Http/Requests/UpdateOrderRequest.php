<?php

namespace App\Http\Requests;

use App\Concerns\OrderValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    use OrderValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return $this->updateOrderRules();
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return $this->orderMessages();
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
            'phone_number' => preg_replace('/\D+/', '', (string) $this->input('phone_number')),
            'delivery_address' => trim((string) $this->input('delivery_address')),
            'is_spam' => $this->boolean('is_spam'),
        ]);
    }
}
