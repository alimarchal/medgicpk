<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();
        $phoneNumber = '03'.fake()->numerify('#########');
        $deliveryAddress = fake()->address();
        $quantity = fake()->numberBetween(1, 6);
        $message = collect([
            'Assalam o Alaikum, mujhe OrgaDent Herbal Dental Powder order karna hai.',
            "Name: {$name}",
            "Phone: {$phoneNumber}",
            "Delivery Address: {$deliveryAddress}",
            "Quantity: {$quantity}",
        ])->implode("\n");

        return [
            'name' => $name,
            'phone_number' => $phoneNumber,
            'delivery_address' => $deliveryAddress,
            'quantity' => $quantity,
            'product_name' => Order::PRODUCT_NAME,
            'status' => fake()->randomElement(Order::STATUSES),
            'is_spam' => false,
            'whatsapp_message' => $message,
            'whatsapp_url' => 'https://wa.me/923455889948?text='.rawurlencode($message),
            'submitted_ip' => fake()->ipv4(),
            'user_agent' => Str::limit(fake()->userAgent(), 65535, ''),
        ];
    }
}
