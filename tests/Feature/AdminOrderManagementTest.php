<?php

use App\Models\Order;
use App\Models\User;

it('seeds the default admin account', function () {
    $this->seed();

    $this->assertDatabaseHas('users', [
        'email' => 'admin@medgicpk.test',
        'is_admin' => true,
    ]);
});

it('allows the seeded admin to log in and open the orders page', function () {
    $this->seed();

    $this->post('/login', [
        'email' => 'admin@medgicpk.test',
        'password' => 'password',
    ])->assertRedirect(route('dashboard'));

    $this->get(route('admin.orders.index'))->assertOk();
});

it('forbids non admins from viewing admin orders', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.orders.index'))
        ->assertForbidden();
});

it('allows admins to view, update, and delete orders', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $order = Order::factory()->create([
        'status' => 'pending',
        'is_spam' => false,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.orders.show', $order))
        ->assertOk();

    $this->actingAs($admin)
        ->patch(route('admin.orders.update', $order), [
            'name' => 'Updated Customer',
            'phone_number' => '03001234567',
            'delivery_address' => 'Updated address',
            'quantity' => 4,
            'status' => 'confirmed',
            'is_spam' => true,
        ])
        ->assertRedirect(route('admin.orders.show', $order));

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'name' => 'Updated Customer',
        'status' => 'confirmed',
        'is_spam' => true,
    ]);

    $this->actingAs($admin)
        ->delete(route('admin.orders.destroy', $order))
        ->assertRedirect(route('admin.orders.index'));

    $this->assertDatabaseMissing('orders', [
        'id' => $order->id,
    ]);
});
