<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->latest()
            ->get()
            ->map(fn (Order $order): array => [
                'id' => $order->id,
                'name' => $order->name,
                'phone_number' => $order->phone_number,
                'delivery_address' => $order->delivery_address,
                'quantity' => $order->quantity,
                'product_name' => $order->product_name,
                'status' => $order->status,
                'is_spam' => $order->is_spam,
                'whatsapp_url' => $order->whatsapp_url,
                'created_at' => $order->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'stats' => [
                'total' => $orders->count(),
                'pending' => $orders->where('status', 'pending')->count(),
                'spam' => $orders->where('is_spam', true)->count(),
            ],
        ]);
    }

    public function show(Order $order): Response
    {
        return Inertia::render('admin/orders/show', [
            'order' => [
                'id' => $order->id,
                'name' => $order->name,
                'phone_number' => $order->phone_number,
                'delivery_address' => $order->delivery_address,
                'quantity' => $order->quantity,
                'product_name' => $order->product_name,
                'status' => $order->status,
                'is_spam' => $order->is_spam,
                'whatsapp_message' => $order->whatsapp_message,
                'whatsapp_url' => $order->whatsapp_url,
                'submitted_ip' => $order->submitted_ip,
                'user_agent' => $order->user_agent,
                'created_at' => $order->created_at?->toDateTimeString(),
                'updated_at' => $order->updated_at?->toDateTimeString(),
            ],
            'statuses' => Order::STATUSES,
        ]);
    }

    public function update(UpdateOrderRequest $request, Order $order): RedirectResponse
    {
        $order->update($request->validated());

        return to_route('admin.orders.show', $order);
    }

    public function destroy(Order $order): RedirectResponse
    {
        $order->delete();

        return to_route('admin.orders.index');
    }
}
