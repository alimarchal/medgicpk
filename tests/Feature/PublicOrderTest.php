<?php

use App\Models\Order;
use Inertia\Testing\AssertableInertia as Assert;

it('shows the public order page on home', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('orders/home')
            ->where('product.name', Order::PRODUCT_NAME)
            ->where('product.whatsappNumber', config('order.whatsapp_number'))
            ->where('product.deliveryPrice', config('order.delivery_price'))
        );
});

it('stores a public order and redirects to whatsapp', function () {
    $response = $this->post(route('orders.store'), [
        'name' => 'Ali Raza',
        'phone_number' => '03123456789',
        'delivery_address' => 'House 10, Street 5, Lahore',
        'city' => 'Lahore',
        'quantity' => 2,
        'website' => '',
    ]);

    $response->assertRedirect();

    expect($response->headers->get('Location'))->toContain('https://wa.me/'.config('order.whatsapp_number'));

    $this->assertDatabaseHas('orders', [
        'name' => 'Ali Raza',
        'phone_number' => '03123456789',
        'delivery_address' => 'House 10, Street 5, Lahore',
        'city' => 'Lahore',
        'quantity' => 2,
        'status' => 'pending',
        'is_spam' => false,
    ]);
});

it('rejects honeypot submissions', function () {
    $this->post(route('orders.store'), [
        'name' => 'Spam Bot',
        'phone_number' => '03123456789',
        'delivery_address' => 'Fake address',
        'city' => 'Lahore',
        'quantity' => 1,
        'website' => 'filled-by-bot',
    ])->assertSessionHasErrors(['website']);

    expect(Order::query()->count())->toBe(0);
});

it('throttles repeated public order submissions', function () {
    $payload = [
        'name' => 'Repeated Customer',
        'phone_number' => '03123456789',
        'delivery_address' => 'Street 1, Karachi',
        'city' => 'Karachi',
        'quantity' => 1,
        'website' => '',
    ];

    foreach (range(1, 3) as $attempt) {
        $this->post(route('orders.store'), $payload)->assertRedirect();
    }

    $this->post(route('orders.store'), $payload)->assertStatus(429);
});
