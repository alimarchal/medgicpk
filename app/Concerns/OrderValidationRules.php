<?php

namespace App\Concerns;

use App\Models\Order;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait OrderValidationRules
{
    /**
     * Get the validation rules for storing an order.
     *
     * @return array<string, array<int, ValidationRule|string>>
     */
    protected function storeOrderRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'regex:/^\+?[0-9]{10,15}$/'],
            'delivery_address' => ['required', 'string', 'max:1000'],
            'quantity' => ['required', 'integer', 'min:1', 'max:20'],
            'website' => ['nullable', 'string', 'max:0'],
        ];
    }

    /**
     * Get the validation rules for updating an order.
     *
     * @return array<string, array<int, ValidationRule|string>>
     */
    protected function updateOrderRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'regex:/^\+?[0-9]{10,15}$/'],
            'delivery_address' => ['required', 'string', 'max:1000'],
            'quantity' => ['required', 'integer', 'min:1', 'max:20'],
            'status' => ['required', 'string', Rule::in(Order::STATUSES)],
            'is_spam' => ['required', 'boolean'],
        ];
    }

    /**
     * Get validation messages for order forms.
     *
     * @return array<string, string>
     */
    protected function orderMessages(): array
    {
        return [
            'name.required' => 'Apna naam likhna zaroori hai.',
            'phone_number.required' => 'Phone number dena zaroori hai.',
            'phone_number.regex' => 'Phone number sirf digits mein sahi format ke saath likhein.',
            'delivery_address.required' => 'Delivery address dena zaroori hai.',
            'quantity.required' => 'Quantity select karna zaroori hai.',
            'quantity.min' => 'Quantity kam az kam 1 honi chahiye.',
            'quantity.max' => 'Quantity aik order mein 20 se zyada nahi ho sakti.',
            'website.max' => 'Spam request reject kar di gayi hai.',
            'status.required' => 'Order status select karna zaroori hai.',
            'status.in' => 'Selected status valid nahi hai.',
        ];
    }
}
