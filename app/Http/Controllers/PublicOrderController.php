<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class PublicOrderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('orders/home', [
            'product' => [
                'name' => Order::PRODUCT_NAME,
                'subtitle' => 'Natural Teeth Cleaning Powder',
                'ingredients' => ['Neem', 'Clove', 'Mint'],
                'whatsappNumber' => '923455889948',
            ],
        ]);
    }

    public function store(StoreOrderRequest $request): HttpResponse
    {
        $validated = $request->validated();
        $message = $this->buildWhatsappMessage($validated);
        $whatsappUrl = 'https://wa.me/923455889948?text='.rawurlencode($message);

        Order::query()->create([
            'name' => $validated['name'],
            'phone_number' => $validated['phone_number'],
            'delivery_address' => $validated['delivery_address'],
            'quantity' => $validated['quantity'],
            'product_name' => Order::PRODUCT_NAME,
            'status' => 'pending',
            'is_spam' => false,
            'whatsapp_message' => $message,
            'whatsapp_url' => $whatsappUrl,
            'submitted_ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return Inertia::location($whatsappUrl);
    }

    /**
     * Build the outbound WhatsApp message.
     *
     * @param  array{name: string, phone_number: string, delivery_address: string, quantity: int}  $validated
     */
    private function buildWhatsappMessage(array $validated): string
    {
        return collect([
            'Assalam o Alaikum, mujhe OrgaDent Herbal Dental Powder order karna hai.',
            '',
            'Product: '.Order::PRODUCT_NAME,
            'Name: '.$validated['name'],
            'Phone: '.$validated['phone_number'],
            'Delivery Address: '.$validated['delivery_address'],
            'Quantity: '.$validated['quantity'],
        ])->implode("\n");
    }
}
