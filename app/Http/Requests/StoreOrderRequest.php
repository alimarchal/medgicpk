<?php

namespace App\Http\Requests;

use App\Concerns\OrderValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    use OrderValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return $this->storeOrderRules();
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
            'city' => trim((string) $this->input('city')),
        ]);
    }
}
