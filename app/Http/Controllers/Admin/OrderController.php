<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('is_spam')) {
            $query->where('is_spam', $request->boolean('is_spam'));
        }

        if ($request->filled('city')) {
            $query->where('city', 'like', '%'.$request->string('city').'%');
        }

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('phone_number', 'like', '%'.$search.'%');
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->string('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->string('date_to'));
        }

        $orders = $query->get()->map(fn (Order $order): array => [
            'id' => $order->id,
            'name' => $order->name,
            'phone_number' => $order->phone_number,
            'delivery_address' => $order->delivery_address,
            'city' => $order->city,
            'quantity' => $order->quantity,
            'product_name' => $order->product_name,
            'status' => $order->status,
            'is_spam' => $order->is_spam,
            'whatsapp_url' => $order->whatsapp_url,
            'created_at' => $order->created_at?->toDateTimeString(),
        ]);

        $allOrders = Order::query()->get();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'stats' => [
                'total' => $allOrders->count(),
                'pending' => $allOrders->where('status', 'pending')->count(),
                'confirmed' => $allOrders->where('status', 'confirmed')->count(),
                'dispatched' => $allOrders->where('status', 'dispatched')->count(),
                'delivered' => $allOrders->where('status', 'delivered')->count(),
                'cancelled' => $allOrders->where('status', 'cancelled')->count(),
                'spam' => $allOrders->where('is_spam', true)->count(),
            ],
            'filters' => $request->only(['status', 'is_spam', 'city', 'search', 'date_from', 'date_to']),
            'statuses' => Order::STATUSES,
            'cities' => Order::query()->whereNotNull('city')->distinct()->pluck('city')->sort()->values(),
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
                'city' => $order->city,
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
